import Link from "next/link";

const things=[
  ['EMAILS','“Find Dave’s email about the timber delivery.”'],
  ['QUOTES','“Find the Smith & Sons quote.”'],
  ['INVOICES','“Show me the invoice for the Bristol job.”'],
  ['CUSTOMERS','“Find everything we have for John Taylor.”'],
  ['PRICES','“What did we charge them last time?”'],
  ['DOCUMENTS','“Find that document from six months ago.”'],
];
const plans=[['Starter','£19','For small businesses that just want to find stuff fast.'],['Team','£49','For growing teams that need everything in one place.'],['Business','£99','For busy businesses that want more users and support.']];

export default function Home(){return <main>
  <nav><Link className="brand" href="/">GotIt<span>.</span></Link><div><a href="#what">What it finds</a><a href="#why">Why GotIt</a><a href="#pricing">Pricing</a><Link className="navbtn" href="/login">Get GotIt →</Link></div></nav>

  <section className="hero">
    <div className="pill">✦ SIMPLE BUSINESS SEARCH · NO ENTERPRISE BLOAT</div>
    <h1>Find your business stuff.<br/><em>Fast.</em></h1>
    <p className="lead">Emails. Quotes. Invoices. Documents. Customer details.</p>
    <p>Type what you're looking for. <strong>GotIt finds it.</strong> No complicated CRM. No setup calls. No pushy salespeople.</p>
    <div className="heroactions"><Link className="primary" href="/login">Get GotIt →</Link><a className="secondary" href="#what">See what it finds</a></div>
    <span className="micro">From £19/month · Easy setup · Cancel anytime</span>
    <div className="searchdemo"><div className="demohead"><b>GotIt.</b><span>Gmail ✓ &nbsp; Drive ✓</span></div><div className="fakeinput">⌕ &nbsp; Find the quote we sent Smith & Sons… <b>Find it</b></div><div className="result"><small>GMAIL · 12 AUG</small><strong>Quote — Smith & Sons timber delivery</strong><p>Hi James, attached is the revised quote for £4,860...</p></div><div className="result"><small>DRIVE · QUOTES</small><strong>Smith-Sons-Quote-August.pdf</strong><p>Revised quotation · Total £4,860 · Delivery included</p></div></div>
  </section>

  <section id="what" className="section"><div className="eyebrow">WHAT CAN I FIND?</div><h2>If it's in your business,<br/>just ask GotIt.</h2><div className="findgrid">{things.map((x,i)=><article key={x[0]}><i>0{i+1}</i><h3>{x[0]}</h3><p>{x[1]}</p></article>)}</div></section>

  <section className="strip"><div><strong>Connect Google.</strong><span>One simple connection.</span></div><b>→</b><div><strong>Type what you need.</strong><span>Normal words. No training.</span></div><b>→</b><div><strong>GotIt.</strong><span>Your email or document, found.</span></div></section>

  <section id="why" className="section why"><div><div className="eyebrow">WHY GOTIT?</div><h2>Business software got ridiculous.</h2><p>It got expensive. It got complicated. It started needing demos, onboarding calls and training just to find a bloody document.</p><p className="bigline">We're doing the opposite.</p></div><div className="whylist"><article><b>NO MASSIVE CRM</b><span>Keep using Gmail and Drive. GotIt makes them easier to search.</span></article><article><b>NO PUSHY SALES</b><span>See the price. Sign up. Connect. Start.</span></article><article><b>NO MASSIVE BILL</b><span>Useful business software from £19 a month.</span></article><article><b>NO LEARNING CURVE</b><span>If you can use Google, you can use GotIt.</span></article></div></section>

  <section id="pricing" className="section pricing"><div className="eyebrow">CHEAP. CLEAR. EASY.</div><h2>No quote. No sales call.<br/>Just the price.</h2><div className="plans">{plans.map((x,i)=><article className={i===0?'featured':''} key={x[0]}>{i===0&&<label>START HERE</label>}<h3>{x[0]}</h3><div className="price">{x[1]}<small>/month</small></div><p>{x[2]}</p><Link href="/login">Get GotIt →</Link></article>)}</div></section>

  <section className="finalcta"><div className="pill">READY WHEN YOU ARE</div><h2>Stop digging.<br/><em>GotIt.</em></h2><p>Connect your Google account and find the stuff your business already has.</p><Link className="primary" href="/login">Get GotIt from £19/month →</Link></section>

  <footer><b>GotIt.</b><span>Find your business stuff. Fast.</span><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div></footer>
</main>}
