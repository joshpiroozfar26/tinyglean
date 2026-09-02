"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Check, FileText, Leaf, LoaderCircle, LockKeyhole, LogOut, Mail, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type User = { email: string; name: string | null; avatar: string | null };
type Result = { id: string; source: "gmail" | "drive"; title: string; snippet: string; meta: string; url: string };

export function SearchWorkspace({ configured, user }: { configured: boolean; user: User | null }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [source, setSource] = useState<"all" | "gmail" | "drive">("all");
  const [results, setResults] = useState<Result[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function signIn() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: "openid email profile https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/drive.readonly",
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
  }

  async function signOut() { await createClient().auth.signOut(); router.replace("/"); router.refresh(); }

  async function search(event: FormEvent) {
    event.preventDefault();
    if (query.trim().length < 2) return;
    setLoading(true); setError("");
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Search failed.");
      setResults(data.results); setSearched(true);
    } catch (err) { setError(err instanceof Error ? err.message : "Search failed."); }
    finally { setLoading(false); }
  }

  const visibleResults = source === "all" ? results : results.filter((result) => result.source === source);

  return <div className="shell">
    <header className="topbar">
      <div className="brand"><span className="brand-mark"><Leaf size={18} /></span>TinyGlean</div>
      <div className="privacy"><LockKeyhole size={15} /> Read-only by design</div>
    </header>

    {!configured ? <main className="center"><section className="setup">
      <div className="eyebrow">One-minute setup</div><h1>Connect Supabase</h1>
      <p className="lede">Create <code>.env.local</code> from <code>.env.example</code>, add your Supabase URL and publishable key, then restart the app.</p>
      <div className="notice">TinyGlean will never need your Google client secret in browser code.</div>
    </section></main> : !user ? <main className="center"><section className="hero">
      <div className="eyebrow">Find the thing. Skip the digging.</div><h1>Your work,<br />gathered lightly.</h1>
      <p className="lede">Search Gmail and Google Drive from one calm place. TinyGlean only asks for read access and never changes your files or messages.</p>
      <button className="google-button" onClick={signIn}><span className="google-g">G</span>Continue with Google</button>
      <div className="scope-row"><span><Check size={15} /> Gmail read-only</span><span><Check size={15} /> Drive read-only</span><span><Check size={15} /> No data stored</span></div>
      <div className="notice">Google may show an “unverified app” warning while your OAuth consent screen is in testing. Add your own Google account as a test user.</div>
    </section></main> : <main className="main">
      <section className="workspace-head">
        <div><div className="eyebrow">Private workspace search</div><h1>What are we looking for?</h1></div>
        <div className="account">
          {user.avatar ? <Image className="avatar" src={user.avatar} alt="" width={32} height={32} unoptimized /> : <span className="avatar" />}
          <span className="account-email">{user.name || user.email}</span>
          <button className="signout" onClick={signOut} aria-label="Sign out"><LogOut size={16} /></button>
        </div>
      </section>
      <form className="searchbox" onSubmit={search}>
        <Search size={20} color="#69746d" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search an invoice, project, person…" aria-label="Search Gmail and Drive" />
        <button disabled={loading || query.trim().length < 2}>{loading ? <LoaderCircle className="spin" size={18} /> : "Search"}</button>
      </form>
      <div className="filters">
        {(["all", "gmail", "drive"] as const).map((filter) => <button key={filter} className={`filter ${source === filter ? "active" : ""}`} onClick={() => setSource(filter)}>
          {filter === "all" ? <Search size={14} /> : filter === "gmail" ? <Mail size={14} /> : <FileText size={14} />}{filter === "all" ? "Everything" : filter === "gmail" ? "Gmail" : "Drive"}
        </button>)}
      </div>
      {error && <div className="error">{error}</div>}
      {searched && <div className="status">{visibleResults.length} result{visibleResults.length === 1 ? "" : "s"}</div>}
      <div className="results">
        {visibleResults.map((result) => <a className="result" href={result.url} target="_blank" rel="noreferrer" key={`${result.source}-${result.id}`}>
          <span className={`result-icon ${result.source}`}>{result.source === "gmail" ? <Mail size={19} /> : <FileText size={19} />}</span>
          <span><h2>{result.title}</h2><p>{result.snippet}</p><span className="meta">{result.meta}</span></span><ArrowUpRight className="open" size={18} />
        </a>)}
        {searched && visibleResults.length === 0 && <div className="empty"><strong>Nothing turned up</strong>Try a person’s name, a phrase, or fewer words.</div>}
      </div>
    </main>}
  </div>;
}
