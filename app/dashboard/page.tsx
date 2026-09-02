"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

type Source = { title: string; url: string; type: string; snippet: string };
type Plan = "starter" | "pro" | "business";

export default function Dashboard() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [q, setQ] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    void (async () => {
      const { data } = await createClient().auth.getSession();
      if (!data.session) {
        router.replace("/");
        return;
      }
      setEmail(data.session.user.email ?? "");
      setReady(true);
    })();
  }, [router]);

  async function search() {
    if (!q.trim() || loading) return;
    setLoading(true);
    setErr("");
    setAnswer("");
    setSources([]);
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query: q.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Search failed");
      setAnswer(data.answer);
      setSources(data.sources ?? []);
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }

  async function checkout(plan: Plan) {
    setErr("");
    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await response.json();
    if (data.url) window.location.assign(data.url);
    else setErr(data.error ?? "Checkout unavailable");
  }

  async function signOut() {
    await createClient().auth.signOut();
    router.replace("/");
    router.refresh();
  }

  return (
    <div className="dashboard">
      <aside className="side">
        <div className="logo">Tiny<span>Glean</span></div>
        <div className="connect"><span className="status">✓ Gmail connected</span><span className="status">✓ Drive connected</span></div>
        <p className="small">{email || "Loading account…"}</p>
        <div className="plan-buttons">
          <button className="plan-button" onClick={() => checkout("starter")}><span>Starter</span><strong>£19/mo</strong></button>
          <button className="plan-button featured" onClick={() => checkout("pro")}><span>Pro</span><strong>£49/mo</strong></button>
          <button className="plan-button" onClick={() => checkout("business")}><span>Business</span><strong>£99/mo</strong></button>
        </div>
        <button className="text-button" onClick={signOut}>Sign out</button>
      </aside>
      <main className="dashboard-main">
        <div className="eyebrow">Company search</div>
        <h1>What do you want to know?</h1>
        <div className="dashboard-searchbox">
          <input value={q} onChange={(event) => setQ(event.target.value)} onKeyDown={(event) => event.key === "Enter" && void search()} placeholder="e.g. What did we quote Acme?" />
          <button disabled={loading || !q.trim() || !ready} onClick={search}>{loading ? "Searching…" : "Search"}</button>
        </div>
        {err && <p className="error">{err}</p>}
        {answer && <section className="answer"><strong>Answer</strong><p>{answer}</p><div className="sources">
          {sources.map((source, index) => <a className="source" href={source.url} target="_blank" rel="noreferrer" key={`${source.url}-${index}`}><strong>{source.title}</strong><div className="small">{source.type} · {source.snippet}</div></a>)}
        </div></section>}
      </main>
    </div>
  );
}
