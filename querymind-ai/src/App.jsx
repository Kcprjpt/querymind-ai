import { useState, useRef, useEffect } from "react";

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  :root{
    --bg:#050810;--card:#0c1120;--border:rgba(99,179,255,0.12);
    --accent:#3b82f6;--accent2:#06b6d4;--green:#10b981;--red:#ef4444;
    --text:#e2e8f0;--muted:#64748b;--glow:rgba(59,130,246,0.25);
  }
  body{background:var(--bg);font-family:'DM Sans',sans-serif;color:var(--text)}
  .app{min-height:100vh}
  .nav{display:flex;align-items:center;justify-content:space-between;padding:16px 40px;
    border-bottom:1px solid var(--border);background:rgba(5,8,16,0.92);
    backdrop-filter:blur(12px);position:sticky;top:0;z-index:100}
  .logo{font-family:'Syne',sans-serif;font-weight:800;font-size:22px;
    background:linear-gradient(135deg,#3b82f6,#06b6d4);-webkit-background-clip:text;
    -webkit-text-fill-color:transparent}
  .logo span{-webkit-text-fill-color:#f59e0b}
  .nav-tabs{display:flex;gap:4px;background:var(--card);border:1px solid var(--border);
    border-radius:10px;padding:4px}
  .nav-tab{padding:8px 18px;border-radius:7px;border:none;cursor:pointer;
    font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;
    color:var(--muted);background:transparent;transition:all 0.2s}
  .nav-tab.active{background:var(--accent);color:white}
  .nav-tab:hover:not(.active){color:var(--text)}
  .nav-cta{background:linear-gradient(135deg,var(--accent),var(--accent2));
    color:white;border:none;padding:9px 20px;border-radius:8px;
    font-family:'DM Sans',sans-serif;font-weight:500;cursor:pointer;font-size:13px}
  .scroll{max-height:calc(100vh - 61px);overflow-y:auto}
  .scroll::-webkit-scrollbar{width:4px}
  .scroll::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
  .landing{padding:0 40px}
  .hero{text-align:center;padding:80px 0 60px;
    background:radial-gradient(ellipse 70% 40% at 50% 0%,rgba(59,130,246,0.12) 0%,transparent 70%)}
  .badge{display:inline-flex;align-items:center;gap:6px;
    background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.3);
    border-radius:20px;padding:6px 14px;margin-bottom:24px;font-size:12px;color:var(--accent2)}
  .dot{width:6px;height:6px;border-radius:50%;background:var(--green);
    animation:blink 1.5s infinite;display:inline-block}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
  .hero h1{font-family:'Syne',sans-serif;font-size:clamp(30px,5vw,60px);
    font-weight:800;line-height:1.1;margin-bottom:20px}
  .grad{background:linear-gradient(135deg,#3b82f6,#06b6d4,#8b5cf6);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent}
  .hero p{font-size:17px;color:var(--muted);max-width:540px;
    margin:0 auto 36px;line-height:1.65}
  .btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
  .btn-p{background:linear-gradient(135deg,var(--accent),var(--accent2));
    color:white;border:none;padding:14px 28px;border-radius:10px;font-size:15px;
    font-weight:600;cursor:pointer;transition:all 0.2s;
    box-shadow:0 0 24px var(--glow);font-family:'DM Sans',sans-serif}
  .btn-p:hover{transform:translateY(-2px);box-shadow:0 0 40px var(--glow)}
  .btn-o{background:transparent;color:var(--text);border:1px solid var(--border);
    padding:14px 28px;border-radius:10px;font-size:15px;cursor:pointer;
    transition:all 0.2s;font-family:'DM Sans',sans-serif}
  .btn-o:hover{border-color:var(--accent);color:var(--accent)}
  .stats{display:flex;gap:16px;justify-content:center;flex-wrap:wrap;padding:0 0 60px}
  .stat{background:var(--card);border:1px solid var(--border);
    border-radius:12px;padding:20px 32px;text-align:center}
  .stat-n{font-family:'Syne',sans-serif;font-size:28px;font-weight:800;
    background:linear-gradient(135deg,var(--accent),var(--accent2));
    -webkit-background-clip:text;-webkit-text-fill-color:transparent}
  .stat-l{font-size:12px;color:var(--muted);margin-top:4px}
  .sec-title{font-family:'Syne',sans-serif;font-size:32px;font-weight:800;
    text-align:center;margin-bottom:8px}
  .sec-sub{text-align:center;color:var(--muted);margin-bottom:40px}
  .feats{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
    gap:16px;margin-bottom:80px}
  .feat{background:var(--card);border:1px solid var(--border);
    border-radius:16px;padding:28px;transition:all 0.3s}
  .feat:hover{border-color:var(--accent);transform:translateY(-4px);
    box-shadow:0 8px 32px rgba(59,130,246,0.15)}
  .feat-ic{width:44px;height:44px;border-radius:10px;display:flex;
    align-items:center;justify-content:center;font-size:20px;margin-bottom:16px}
  .feat h3{font-family:'Syne',sans-serif;font-weight:700;font-size:16px;margin-bottom:8px}
  .feat p{font-size:13px;color:var(--muted);line-height:1.65}
  .plans{display:flex;gap:16px;justify-content:center;flex-wrap:wrap;margin-bottom:80px}
  .plan{background:var(--card);border:1px solid var(--border);
    border-radius:20px;padding:32px 28px;width:280px;position:relative;transition:all 0.3s}
  .plan.pop{border-color:var(--accent);box-shadow:0 0 40px rgba(59,130,246,0.2)}
  .pop-tag{position:absolute;top:-12px;left:50%;transform:translateX(-50%);
    background:linear-gradient(135deg,var(--accent),var(--accent2));
    color:white;font-size:11px;font-weight:700;padding:4px 14px;
    border-radius:20px;white-space:nowrap}
  .plan-name{font-size:12px;color:var(--muted);text-transform:uppercase;
    letter-spacing:1px;margin-bottom:12px}
  .plan-price{font-family:'Syne',sans-serif;font-size:36px;font-weight:800;margin-bottom:4px}
  .plan-price span{font-size:16px;color:var(--muted);font-weight:400}
  .plan-desc{font-size:13px;color:var(--muted);margin-bottom:24px}
  .plan-feats{list-style:none;margin-bottom:28px}
  .plan-feats li{font-size:13px;padding:7px 0;border-bottom:1px solid var(--border);
    display:flex;align-items:center;gap:8px}
  .plan-feats li:last-child{border-bottom:none}
  .chk{color:var(--green)}
  .plan-btn{width:100%;padding:12px;border-radius:10px;font-weight:600;font-size:14px;
    cursor:pointer;transition:all 0.2s;border:none;font-family:'DM Sans',sans-serif}
  .plan-btn-o{background:transparent;border:1px solid var(--border)!important;color:var(--text)}
  .plan-btn-o:hover{border-color:var(--accent)!important;color:var(--accent)}
  .plan-btn-f{background:linear-gradient(135deg,var(--accent),var(--accent2));color:white}
  .app-wrap{display:grid;grid-template-columns:220px 1fr;min-height:calc(100vh - 61px)}
  .sidebar{background:var(--card);border-right:1px solid var(--border);
    padding:24px 0;display:flex;flex-direction:column}
  .sb-sec{padding:0 16px;margin-bottom:24px}
  .sb-label{font-size:10px;text-transform:uppercase;letter-spacing:1.5px;
    color:var(--muted);margin-bottom:8px;padding:0 8px}
  .sb-item{display:flex;align-items:center;gap:10px;padding:10px 8px;
    border-radius:8px;cursor:pointer;font-size:13px;color:var(--muted);
    transition:all 0.2s;margin-bottom:2px}
  .sb-item:hover,.sb-item.active{background:rgba(59,130,246,0.1);color:var(--text)}
  .sb-item.active{color:var(--accent)}
  .main{padding:28px;overflow-y:auto}
  .chat-hd{margin-bottom:24px}
  .chat-hd h2{font-family:'Syne',sans-serif;font-size:22px;font-weight:700}
  .chat-hd p{color:var(--muted);font-size:13px;margin-top:4px}
  .msgs{height:380px;overflow-y:auto;display:flex;flex-direction:column;
    gap:16px;margin-bottom:16px;padding:4px}
  .msgs::-webkit-scrollbar{width:4px}
  .msgs::-webkit-scrollbar-thumb{background:var(--border)}
  .msg{display:flex;gap:12px;align-items:flex-start}
  .msg.u{flex-direction:row-reverse}
  .av{width:32px;height:32px;border-radius:8px;display:flex;
    align-items:center;justify-content:center;font-size:14px;flex-shrink:0}
  .av.ai{background:linear-gradient(135deg,var(--accent),var(--accent2))}
  .av.u{background:rgba(245,158,11,0.2)}
  .bubble{max-width:75%;background:var(--card);border:1px solid var(--border);
    border-radius:12px;padding:12px 16px;font-size:13px;line-height:1.65}
  .msg.u .bubble{background:rgba(59,130,246,0.1);border-color:rgba(59,130,246,0.25)}
  .bubble pre{background:rgba(0,0,0,0.4);border-radius:8px;padding:12px;
    overflow-x:auto;font-size:12px;margin:10px 0;white-space:pre-wrap;
    border:1px solid var(--border)}
  .bubble code{font-family:'Courier New',monospace;color:var(--accent2)}
  .input-row{display:flex;gap:8px}
  .inp{flex:1;background:var(--card);border:1px solid var(--border);
    border-radius:10px;padding:12px 16px;color:var(--text);
    font-family:'DM Sans',sans-serif;font-size:14px;outline:none;resize:none}
  .inp:focus{border-color:var(--accent)}
  .inp::placeholder{color:var(--muted)}
  .send{background:linear-gradient(135deg,var(--accent),var(--accent2));
    color:white;border:none;padding:12px 20px;border-radius:10px;
    cursor:pointer;font-size:18px;transition:all 0.2s}
  .send:hover{opacity:0.9;transform:scale(1.05)}
  .send:disabled{opacity:0.5;cursor:not-allowed;transform:none}
  .typing{display:flex;gap:4px;align-items:center;padding:8px}
  .d{width:6px;height:6px;border-radius:50%;background:var(--accent);
    animation:bounce 1.2s infinite}
  .d:nth-child(2){animation-delay:0.2s}
  .d:nth-child(3){animation-delay:0.4s}
  @keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}
  .qps{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
  .qp{background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.2);
    border-radius:20px;padding:6px 14px;font-size:12px;cursor:pointer;
    color:var(--accent2);transition:all 0.2s;font-family:'DM Sans',sans-serif}
  .qp:hover{background:rgba(59,130,246,0.18)}
  .err{background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);
    color:#fca5a5;border-radius:8px;padding:10px 14px;font-size:13px;margin-bottom:12px}
  .metrics{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));
    gap:16px;margin-bottom:24px}
  .mc{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px}
  .mc-l{font-size:11px;text-transform:uppercase;letter-spacing:1px;
    color:var(--muted);margin-bottom:8px}
  .mc-v{font-family:'Syne',sans-serif;font-size:26px;font-weight:800}
  .mc-c{font-size:12px;margin-top:4px}
  .up{color:var(--green)}.dn{color:var(--red)}
  .sql-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
  .sql-panel{background:var(--card);border:1px solid var(--border);
    border-radius:12px;padding:20px}
  .sql-panel h3{font-family:'Syne',sans-serif;font-weight:700;
    margin-bottom:12px;font-size:15px}
  .sql-ta{width:100%;min-height:120px;background:rgba(0,0,0,0.4);
    border:1px solid var(--border);border-radius:8px;padding:12px;
    color:var(--text);font-family:'Courier New',monospace;font-size:13px;
    resize:vertical;outline:none}
  .sql-ta:focus{border-color:var(--accent)}
  .sql-out{background:rgba(0,0,0,0.5);border:1px solid var(--border);
    border-radius:8px;padding:12px;min-height:200px;
    font-family:'Courier New',monospace;font-size:12px;color:var(--accent2);
    white-space:pre-wrap;overflow-x:auto;line-height:1.6}
  .gen-btn{width:100%;margin-top:12px;padding:11px;
    background:linear-gradient(135deg,var(--accent),var(--accent2));
    color:white;border:none;border-radius:8px;font-weight:600;
    font-size:14px;cursor:pointer;font-family:'DM Sans',sans-serif}
  .gen-btn:disabled{opacity:0.6;cursor:not-allowed}
  .calc-box{background:var(--card);border:1px solid var(--border);
    border-radius:16px;padding:28px}
  .calc-box h3{font-family:'Syne',sans-serif;font-weight:800;
    font-size:20px;margin-bottom:20px}
  .c-row{display:flex;align-items:center;justify-content:space-between;
    padding:14px 0;border-bottom:1px solid var(--border)}
  .c-label{font-size:14px;color:var(--muted)}
  .c-inp{background:rgba(0,0,0,0.3);border:1px solid var(--border);
    border-radius:8px;padding:8px 12px;color:var(--text);width:110px;
    text-align:right;font-family:'DM Sans',sans-serif;font-size:14px;outline:none}
  .c-inp:focus{border-color:var(--accent)}
  .total{background:linear-gradient(135deg,rgba(59,130,246,0.08),rgba(6,182,212,0.08));
    border:1px solid rgba(59,130,246,0.3);border-radius:12px;
    padding:24px;text-align:center;margin-top:20px}
  .total-amt{font-family:'Syne',sans-serif;font-size:44px;font-weight:800;
    background:linear-gradient(135deg,var(--accent),var(--green));
    -webkit-background-clip:text;-webkit-text-fill-color:transparent}
  .tag{display:inline-flex;align-items:center;
    background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.25);
    color:var(--green);border-radius:6px;padding:2px 8px;
    font-size:11px;font-weight:600}
  @media(max-width:768px){
    .nav{padding:12px 16px}.nav-tabs{display:none}
    .landing{padding:0 16px}.hero{padding:48px 0 36px}
    .app-wrap{grid-template-columns:1fr}.sidebar{display:none}
    .sql-grid{grid-template-columns:1fr}.main{padding:16px}
  }
`;

const FEATS = [
  {icon:"🧠",bg:"rgba(59,130,246,0.15)",title:"Natural Language to SQL",desc:"Type in plain English — QueryMind converts it to perfect SQL instantly. No coding required."},
  {icon:"📊",bg:"rgba(16,185,129,0.15)",title:"Real-time Insights",desc:"Sales trends, revenue, customer behavior — AI analyzes your data and delivers actionable insights."},
  {icon:"🔮",bg:"rgba(139,92,246,0.15)",title:"Predictive Analytics",desc:"Revenue forecasting, churn prediction, inventory planning — know what's coming before it happens."},
  {icon:"📈",bg:"rgba(245,158,11,0.15)",title:"Automated Reports",desc:"Daily/weekly PDF reports auto-generate and land in your inbox — zero manual effort."},
  {icon:"🔗",bg:"rgba(239,68,68,0.15)",title:"100+ Integrations",desc:"Connect MySQL, PostgreSQL, Snowflake, Shopify, Salesforce — all in one platform."},
  {icon:"🛡️",bg:"rgba(6,182,212,0.15)",title:"Enterprise Security",desc:"SOC 2 certified, GDPR compliant, end-to-end encrypted. Your data stays safe."},
];

const PLANS = [
  {name:"Starter",price:"₹2,999",per:"/month",desc:"Perfect for small businesses",pop:false,
    feats:["5 database connections","10,000 AI queries/mo","Basic SQL generation","Email reports","Email support"]},
  {name:"Growth",price:"₹7,999",per:"/month",desc:"For scaling teams",pop:true,
    feats:["25 DB connections","Unlimited AI queries","Advanced analytics","Custom dashboards","Predictive insights","Priority support"]},
  {name:"Enterprise",price:"Custom",per:"",desc:"For large organizations",pop:false,
    feats:["Unlimited everything","On-premise deployment","Custom AI training","Dedicated CSM","SLA guarantee","White-label option"]},
];

const QPS = [
  "Show revenue for last 30 days",
  "Who are my top 10 customers?",
  "Which products are underperforming?",
  "Forecast next month's sales",
];

export default function App() {
  const [tab, setTab] = useState("landing");
  const [sub, setSub] = useState("chat");
  const [msgs, setMsgs] = useState([
    {role:"ai",text:"Hello! 👋 I'm QueryMind AI — your intelligent business data assistant. Ask me anything about your data. How can I help you today?"}
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatErr, setChatErr] = useState("");
  const [sqlQ, setSqlQ] = useState("Show total revenue by product category for last 6 months");
  const [sqlA, setSqlA] = useState("");
  const [sqlLoad, setSqlLoad] = useState(false);
  const [sqlErr, setSqlErr] = useState("");
  const [custs, setCusts] = useState(100);
  const [price, setPrice] = useState(2999);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({behavior:"smooth"}); }, [msgs, loading]);

  const callAPI = async (question, type) => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({question, type}),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data.reply;
  };

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput(""); setChatErr("");
    setMsgs(p => [...p, {role:"user", text:msg}]);
    setLoading(true);
    try {
      const reply = await callAPI(msg, "chat");
      setMsgs(p => [...p, {role:"ai", text:reply}]);
    } catch(e) {
      setChatErr("Error: " + e.message + " — Check Netlify Functions & API key.");
    }
    setLoading(false);
  };

  const genSQL = async () => {
    if (!sqlQ.trim()) return;
    setSqlLoad(true); setSqlA(""); setSqlErr("");
    try {
      const reply = await callAPI(sqlQ, "sql");
      setSqlA(reply);
    } catch(e) {
      setSqlErr("Error: " + e.message);
    }
    setSqlLoad(false);
  };

  const fmt = (text) =>
    text.split(/(```[\s\S]*?```)/g).map((p,i) => {
      if (p.startsWith("```")) {
        const code = p.replace(/^```\w*\n?/,"").replace(/```$/,"");
        return <pre key={i}><code>{code}</code></pre>;
      }
      return <span key={i} style={{whiteSpace:"pre-wrap"}}>{p}</span>;
    });

  const mrr = custs * price;

  return (
    <>
      <style>{STYLE}</style>
      <div className="app">

        {/* NAV */}
        <nav className="nav">
          <div className="logo">Query<span>Mind</span> AI</div>
          <div className="nav-tabs">
            {[["landing","🏠 Home"],["app","⚡ Live Demo"],["calc","💰 Revenue Calc"]].map(([t,l])=>(
              <button key={t} className={`nav-tab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>{l}</button>
            ))}
          </div>
          <button className="nav-cta" onClick={()=>setTab("app")}>Start Free Trial →</button>
        </nav>

        {/* LANDING */}
        {tab==="landing" && (
          <div className="scroll">
            <div className="landing">
              <div className="hero">
                <div className="badge"><span className="dot"/>Live · 500+ Businesses Trust QueryMind</div>
                <h1>Turn Your Business Data Into<br/><span className="grad">Instant AI Insights</span></h1>
                <p>No SQL knowledge needed. Just ask in plain English — get instant answers, automated reports, and revenue-driving predictions.</p>
                <div className="btns">
                  <button className="btn-p" onClick={()=>setTab("app")}>⚡ Try Live Demo Free</button>
                  <button className="btn-o" onClick={()=>setTab("calc")}>💰 See Revenue Potential</button>
                </div>
              </div>
              <div className="stats">
                {[["500+","Active Customers"],["$2.1M","ARR Achieved"],["10M+","Queries / Month"],["4.9★","Average Rating"]].map(([n,l])=>(
                  <div key={l} className="stat"><div className="stat-n">{n}</div><div className="stat-l">{l}</div></div>
                ))}
              </div>
              <div className="sec-title">Everything You Need to Win with Data</div>
              <div className="sec-sub">SQL · Analytics · Predictions · Automated Reports — all in one platform</div>
              <div className="feats">
                {FEATS.map(f=>(
                  <div key={f.title} className="feat">
                    <div className="feat-ic" style={{background:f.bg}}>{f.icon}</div>
                    <h3>{f.title}</h3><p>{f.desc}</p>
                  </div>
                ))}
              </div>
              <div className="sec-title">Simple, Transparent Pricing</div>
              <div className="sec-sub">No hidden fees. Monthly billing. Cancel anytime.</div>
              <div className="plans">
                {PLANS.map(p=>(
                  <div key={p.name} className={`plan ${p.pop?"pop":""}`}>
                    {p.pop && <div className="pop-tag">⭐ MOST POPULAR</div>}
                    <div className="plan-name">{p.name}</div>
                    <div className="plan-price">{p.price}<span>{p.per}</span></div>
                    <div className="plan-desc">{p.desc}</div>
                    <ul className="plan-feats">
                      {p.feats.map(f=><li key={f}><span className="chk">✓</span>{f}</li>)}
                    </ul>
                    <button className={`plan-btn ${p.pop?"plan-btn-f":"plan-btn-o"}`} onClick={()=>setTab("app")}>
                      {p.name==="Enterprise"?"Contact Sales":"Start Free Trial"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* APP */}
        {tab==="app" && (
          <div className="app-wrap">
            <div className="sidebar">
              <div className="sb-sec">
                <div className="sb-label">Navigation</div>
                {[["chat","💬","AI Chat"],["dashboard","📊","Dashboard"],["sql","🔧","SQL Generator"]].map(([id,ic,label])=>(
                  <div key={id} className={`sb-item ${sub===id?"active":""}`} onClick={()=>setSub(id)}>
                    <span>{ic}</span><span>{label}</span>
                  </div>
                ))}
              </div>
              <div className="sb-sec">
                <div className="sb-label">Data Sources</div>
                {[["🟢","PostgreSQL","Connected"],["🟢","MySQL","Connected"],["🔴","Snowflake","Add"]].map(([d,n,s])=>(
                  <div key={n} className="sb-item">
                    <span>{d}</span>
                    <span style={{fontSize:"12px"}}>{n} <span style={{color:"var(--muted)",fontSize:"10px"}}>({s})</span></span>
                  </div>
                ))}
              </div>
              <div className="sb-sec" style={{marginTop:"auto"}}>
                <div style={{padding:"12px",background:"rgba(59,130,246,0.08)",borderRadius:"10px",border:"1px solid rgba(59,130,246,0.2)"}}>
                  <div style={{fontSize:"11px",color:"var(--muted)",marginBottom:"4px"}}>Current Plan</div>
                  <div style={{fontSize:"14px",fontWeight:"600",color:"var(--accent)"}}>Growth ⭐</div>
                  <div style={{fontSize:"11px",color:"var(--muted)",marginTop:"2px"}}>₹7,999/month</div>
                </div>
              </div>
            </div>

            <div className="main">
              {/* CHAT */}
              {sub==="chat" && (
                <div>
                  <div className="chat-hd">
                    <h2>AI Chat Assistant 🧠</h2>
                    <p>Ask anything about your business data in plain English</p>
                  </div>
                  <div className="qps">
                    {QPS.map(q=><button key={q} className="qp" onClick={()=>send(q)}>{q}</button>)}
                  </div>
                  {chatErr && <div className="err">{chatErr}</div>}
                  <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"16px",padding:"20px"}}>
                    <div className="msgs">
                      {msgs.map((m,i)=>(
                        <div key={i} className={`msg ${m.role==="user"?"u":""}`}>
                          <div className={`av ${m.role==="user"?"u":"ai"}`}>{m.role==="user"?"👤":"🤖"}</div>
                          <div className="bubble">{fmt(m.text)}</div>
                        </div>
                      ))}
                      {loading && (
                        <div className="msg">
                          <div className="av ai">🤖</div>
                          <div className="bubble"><div className="typing"><div className="d"/><div className="d"/><div className="d"/></div></div>
                        </div>
                      )}
                      <div ref={endRef}/>
                    </div>
                    <div className="input-row">
                      <textarea className="inp" rows={2}
                        placeholder="e.g. What was my total revenue last week by category?"
                        value={input} onChange={e=>setInput(e.target.value)}
                        onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}}}/>
                      <button className="send" onClick={()=>send()} disabled={loading||!input.trim()}>➤</button>
                    </div>
                  </div>
                </div>
              )}

              {/* DASHBOARD */}
              {sub==="dashboard" && (
                <div>
                  <div className="chat-hd"><h2>Business Dashboard 📊</h2><p>Real-time metrics at a glance</p></div>
                  <div className="metrics">
                    {[
                      {l:"Revenue (MTD)",v:"₹8,42,300",c:"+18.4%",up:true},
                      {l:"Active Customers",v:"1,247",c:"+34 this week",up:true},
                      {l:"Avg Order Value",v:"₹2,840",c:"-2.1%",up:false},
                      {l:"Pending Orders",v:"89",c:"+12 today",up:true},
                    ].map(m=>(
                      <div key={m.l} className="mc">
                        <div className="mc-l">{m.l}</div>
                        <div className="mc-v">{m.v}</div>
                        <div className={`mc-c ${m.up?"up":"dn"}`}>{m.up?"▲":"▼"} {m.c}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}}>
                    {[
                      {title:"Top Products 🔥",rows:[["Premium Widget","₹1,24,500","45 units"],["Basic Kit","₹89,200","102 units"],["Pro Bundle","₹76,800","28 units"]]},
                      {title:"Recent Orders 📦",rows:[["#ORD-8821","Rahul Sharma","₹4,200"],["#ORD-8820","Priya Gupta","₹8,900"],["#ORD-8819","Amit Patel","₹2,100"]]},
                    ].map(panel=>(
                      <div key={panel.title} style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"12px",padding:"20px"}}>
                        <h3 style={{fontFamily:"Syne,sans-serif",fontWeight:"700",marginBottom:"14px",fontSize:"15px"}}>{panel.title}</h3>
                        {panel.rows.map(row=>(
                          <div key={row[0]} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",padding:"9px 0",borderTop:"1px solid var(--border)",fontSize:"13px"}}>
                            <span>{row[0]}</span>
                            <span style={{color:"var(--muted)"}}>{row[1]}</span>
                            <span style={{color:"var(--green)",fontWeight:"600"}}>{row[2]}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SQL */}
              {sub==="sql" && (
                <div>
                  <div className="chat-hd"><h2>SQL Generator 🔧</h2><p>Plain English → Production-ready SQL instantly</p></div>
                  {sqlErr && <div className="err" style={{marginBottom:"16px"}}>{sqlErr}</div>}
                  <div className="sql-grid">
                    <div className="sql-panel">
                      <h3>📝 Your Question</h3>
                      <textarea className="sql-ta" value={sqlQ} onChange={e=>setSqlQ(e.target.value)}
                        placeholder="e.g. Top 10 customers by spend this quarter..."/>
                      <button className="gen-btn" onClick={genSQL} disabled={sqlLoad}>
                        {sqlLoad?"⏳ Generating...":"⚡ Generate SQL Query"}
                      </button>
                    </div>
                    <div className="sql-panel">
                      <h3>💻 Generated SQL <span className="tag">AI Powered</span></h3>
                      <div className="sql-out">{sqlLoad?"Generating...":sqlA||"← Enter question and click Generate"}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CALC */}
        {tab==="calc" && (
          <div className="scroll">
            <div style={{maxWidth:"600px",margin:"0 auto",padding:"40px 20px"}}>
              <div style={{textAlign:"center",marginBottom:"32px"}}>
                <div className="sec-title">💰 Revenue Calculator</div>
                <p style={{color:"var(--muted)",marginTop:"8px"}}>Model your SaaS revenue potential</p>
              </div>
              <div className="calc-box">
                <h3>📊 Estimate Your Monthly Revenue</h3>
                <div className="c-row">
                  <span className="c-label">Paying Customers</span>
                  <input type="number" className="c-inp" value={custs} min={1} onChange={e=>setCusts(Number(e.target.value))}/>
                </div>
                <div className="c-row">
                  <span className="c-label">Avg Plan Price (₹/mo)</span>
                  <input type="number" className="c-inp" value={price} min={1} onChange={e=>setPrice(Number(e.target.value))}/>
                </div>
                <div className="c-row" style={{borderBottom:"none"}}>
                  <span className="c-label">SaaS Gross Margin</span>
                  <span style={{color:"var(--green)",fontWeight:"700"}}>~85%</span>
                </div>
                <div className="total">
                  <div style={{fontSize:"13px",color:"var(--muted)",marginBottom:"8px"}}>Monthly Recurring Revenue</div>
                  <div className="total-amt">₹{mrr.toLocaleString("en-IN")}</div>
                  <div style={{fontSize:"14px",color:"var(--muted)",marginTop:"8px"}}>
                    Annual: <strong style={{color:"var(--green)"}}>₹{(mrr*12).toLocaleString("en-IN")}</strong>
                  </div>
                </div>
                <div style={{marginTop:"20px",padding:"16px",background:"rgba(16,185,129,0.06)",borderRadius:"12px",border:"1px solid rgba(16,185,129,0.2)"}}>
                  <div style={{fontSize:"13px",fontWeight:"600",color:"var(--green)",marginBottom:"12px"}}>📈 Roadmap to ₹25L/month:</div>
                  {[
                    ["Month 1–3","10–20 customers","₹30K–60K/mo","Beta + referrals"],
                    ["Month 4–6","100 customers","₹3L/mo","LinkedIn + cold email"],
                    ["Month 7–12","400 customers","₹12L/mo","Paid ads + partners"],
                    ["Year 2+","800+ customers","₹25L+/mo","Enterprise + resellers"],
                  ].map(([ph,cu,re,hw])=>(
                    <div key={ph} style={{padding:"10px 0",borderBottom:"1px solid rgba(16,185,129,0.12)",fontSize:"12px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:"3px"}}>
                        <span style={{color:"var(--accent)",fontWeight:"600"}}>{ph}</span>
                        <span style={{color:"var(--green)",fontWeight:"700"}}>{re}</span>
                      </div>
                      <div style={{color:"var(--muted)"}}>{cu} — {hw}</div>
                    </div>
                  ))}
                </div>
                <button className="gen-btn" style={{marginTop:"20px"}} onClick={()=>setTab("app")}>
                  🚀 Try the Live Demo — Free
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
