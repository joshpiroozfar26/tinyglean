import GoogleButton from '@/components/google-button'
import AuthRedirect from '@/components/auth-redirect'

export default function Home(){
  return <main className="landing"><AuthRedirect />
    <div className="wrap">
      <nav className="nav">
        <a className="brand" href="/"><span className="mark">T</span>TinyGlean</a>
        <div className="navlinks"><a href="#features">Features</a><a href="#pricing">Pricing</a><a href="/privacy">Privacy</a></div>
        <GoogleButton label="Try TinyGlean" compact />
      </nav>

      <section className="hero">
        <div className="eyebrow">⚡ AI company search without enterprise bloat</div>
        <h1>Search your whole company like Google.</h1>
        <p>Connect Gmail and Google Drive. Ask a question in plain English and TinyGlean finds the relevant emails and files, answers it, and takes you back to the source.</p>
        <div className="heroActions"><GoogleButton label="Search my company →" /><a className="btn" href="#demo">See the demo</a></div>

        <div className="proof" id="demo">
          <div className="preview-label">Product preview — sign in to search your own workspace</div>
          <div className="appMock">
            <aside className="sideMock">
              <div className="smallbrand"><span className="mark">T</span>TinyGlean</div>
              <div className="navitem active">⌕ Search</div>
              <div className="navitem">◫ Sources</div>
              <div className="navitem">◌ Activity</div>
              <div className="navitem">⚙ Settings</div>
            </aside>
            <div className="mockContent">
              <div className="toprow"><div><h2>Company search</h2><div className="muted">Ask anything your team already knows.</div></div><div className="connectors"><span className="chip">Gmail ✓</span><span className="chip">Drive ✓</span></div></div>
              <div className="mockSearch"><div>What did we promise Acme about delivery?</div><span>Ask</span></div>
              <div className="answer show"><h3>Acme was told delivery would take approximately 14 working days after final artwork approval.</h3><div className="muted">TinyGlean found this across your connected company sources.</div><div className="source">✉ Gmail · Customer conversation<br/><small>Delivery discussed after artwork approval.</small></div><div className="source">📄 Google Drive · Acme Proposal v3.pdf<br/><small>Delivery: 10–14 working days after approval.</small></div></div>
              <div className="stats"><div className="stat"><span>Sources indexed</span><b>4,281</b></div><div className="stat"><span>Questions this week</span><b>73</b></div><div className="stat"><span>Time saved</span><b>11.4h</b></div></div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <section className="section" id="features"><div className="wrap"><h2>The bit you actually need.</h2><p className="lead">No 200-feature enterprise rollout. TinyGlean does one job: find what your company already knows.</p><div className="features"><div className="feature"><div className="icon">✉️</div><h3>Search Gmail</h3><p>Find old promises, pricing, customer decisions and conversations without remembering the exact wording.</p></div><div className="feature"><div className="icon">📁</div><h3>Search Drive</h3><p>Ask questions across proposals, PDFs, docs and spreadsheets — and jump straight back to the source.</p></div><div className="feature"><div className="icon">🔒</div><h3>Read-only by design</h3><p>TinyGlean requests read-only Google permissions. It does not edit, delete or send your Gmail messages or Drive files.</p></div></div></div></section>

    <section className="section" id="pricing"><div className="wrap"><h2>Not enterprise pricing.</h2><p className="lead">Start without a demo, sales call or annual contract.</p><div className="pricing"><div className="price"><h3>Solo</h3><div className="amount">£19<span>/mo</span></div><p>1 user · Gmail + Drive</p></div><div className="price pop"><h3>Team</h3><div className="amount">£49<span>/mo</span></div><p>Up to 10 users · Unlimited searches</p></div><div className="price"><h3>Business</h3><div className="amount">£99<span>/mo</span></div><p>Up to 30 users · Priority support</p></div></div></div></section>

    <footer className="footer"><div className="wrap">© 2026 TinyGlean · <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a></div></footer>
  </main>
}
