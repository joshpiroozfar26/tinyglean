import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

type SearchItem = { id: string; source: "gmail" | "drive"; title: string; snippet: string; meta: string; url: string };
const googleHeaders = (token: string) => ({ Authorization: `Bearer ${token}` });

async function searchGmail(query: string, token: string): Promise<SearchItem[]> {
  const listUrl = new URL("https://gmail.googleapis.com/gmail/v1/users/me/messages");
  listUrl.searchParams.set("q", query);
  listUrl.searchParams.set("maxResults", "8");
  const listResponse = await fetch(listUrl, { headers: googleHeaders(token), cache: "no-store" });
  if (!listResponse.ok) throw new Error(`Gmail search failed (${listResponse.status})`);
  const list = (await listResponse.json()) as { messages?: { id: string }[] };

  return Promise.all((list.messages ?? []).map(async ({ id }) => {
    const url = new URL(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}`);
    url.searchParams.set("format", "metadata");
    ["Subject", "From", "Date"].forEach((header) => url.searchParams.append("metadataHeaders", header));
    const response = await fetch(url, { headers: googleHeaders(token), cache: "no-store" });
    if (!response.ok) throw new Error(`Gmail message lookup failed (${response.status})`);
    const message = (await response.json()) as { snippet?: string; payload?: { headers?: { name: string; value: string }[] } };
    const headers = message.payload?.headers ?? [];
    const value = (name: string) => headers.find((header) => header.name === name)?.value ?? "";
    return {
      id, source: "gmail" as const, title: value("Subject") || "(No subject)", snippet: message.snippet ?? "",
      meta: [value("From"), value("Date")].filter(Boolean).join(" · "),
      url: `https://mail.google.com/mail/u/0/#search/${encodeURIComponent(query)}`,
    };
  }));
}

async function searchDrive(query: string, token: string): Promise<SearchItem[]> {
  const escaped = query.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
  const url = new URL("https://www.googleapis.com/drive/v3/files");
  url.searchParams.set("q", `fullText contains '${escaped}' and trashed = false`);
  url.searchParams.set("pageSize", "8");
  url.searchParams.set("orderBy", "modifiedTime desc");
  url.searchParams.set("fields", "files(id,name,mimeType,modifiedTime,webViewLink,description,owners(displayName))");
  const response = await fetch(url, { headers: googleHeaders(token), cache: "no-store" });
  if (!response.ok) throw new Error(`Drive search failed (${response.status})`);
  const data = (await response.json()) as { files?: { id: string; name: string; mimeType: string; modifiedTime?: string; webViewLink?: string; description?: string; owners?: { displayName: string }[] }[] };
  return (data.files ?? []).map((file) => ({
    id: file.id, source: "drive" as const, title: file.name,
    snippet: file.description || file.mimeType.replace("application/vnd.google-apps.", "Google "),
    meta: [file.owners?.[0]?.displayName, file.modifiedTime ? `Updated ${new Date(file.modifiedTime).toLocaleDateString("en-GB")}` : null].filter(Boolean).join(" · "),
    url: file.webViewLink ?? `https://drive.google.com/open?id=${file.id}`,
  }));
}

async function runSearch(query: string | undefined) {
  if (!query || query.length < 2) return NextResponse.json({ error: "Enter at least two characters." }, { status: 400 });

  const supabase = await createClient();
  const [{ data: userData }, { data: sessionData }] = await Promise.all([supabase.auth.getUser(), supabase.auth.getSession()]);
  if (!userData.user) return NextResponse.json({ error: "Sign in to search." }, { status: 401 });
  const token = sessionData.session?.provider_token;
  if (!token) return NextResponse.json({ error: "Your Google access expired. Sign out and reconnect Google." }, { status: 401 });

  try {
    const [gmail, drive] = await Promise.all([searchGmail(query, token), searchDrive(query, token)]);
    const results = [...gmail, ...drive];
    return NextResponse.json({
      results,
      answer: results.length
        ? `I found ${results.length} relevant item${results.length === 1 ? "" : "s"} across Gmail and Google Drive. The strongest matches are listed below.`
        : "I couldn't find a matching email or Drive file. Try a person's name, exact phrase, or fewer words.",
      sources: results.map((item) => ({
        title: item.title,
        url: item.url,
        type: item.source === "gmail" ? "Gmail" : "Google Drive",
        snippet: item.snippet,
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Google search failed." }, { status: 502 });
  }
}

export async function GET(request: Request) {
  return runSearch(new URL(request.url).searchParams.get("q")?.trim());
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { query?: string };
  return runSearch(body.query?.trim());
}
