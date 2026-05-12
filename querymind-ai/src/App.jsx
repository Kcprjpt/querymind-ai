import { useState, useRef, useEffect } from "react";

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #050810; --card: #0c1120; --border: rgba(99,179,255,0.12);
    --accent: #3b82f6; --accent2: #06b6d4; --gold: #f59e0b;
    --green: #10b981; --red: #ef4444; --text: #e2e8f0; --muted: #64748b;
    --glow: rgba(59,130,246,0.25);
  }
  body { background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--text); }
  .app { min-height: 100vh; }
  .nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 40px; border-bottom: 1px solid var(--border);
    background: rgba(5,8,16,0.92); backdrop-filter: blur(12px);
    position: sticky; top: 0; z-index: 100;
  }
  .logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 22px;
    background: linear-gradient(135deg, #3b82f6, #06b6d4); -webkit-background-clip: text;
    -webkit-text-fill-color: transparent; }
  .logo span { -webkit-text-fill-color: #f59e0b; }
  .nav-tabs { display: flex; gap: 4px; background: var(--card);
    border: 1px solid var(--border); border-radius: 10px; padding: 4px; }
  .nav-tab { padding: 8px 18px; border-radius: 7px; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    color: var(--muted); background: transparent; transition: all 0.2s; }
  .nav-tab.active { background: var(--accent); color: white; }
  .nav-tab:hover:not(.active) { color: var(--text); }
  .nav-cta { background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: white; border: none; padding: 9px 20px; border-radius: 8px;
    font-family: 'DM Sans', sans-serif; font-weight: 500; cursor: pointer; font-size: 13px; }
  .scrollable { max-height: calc(100vh - 61px); overflow-y: auto; }
  .scrollable::-webkit-scrollbar { width: 4px; }
  .scrollable::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
  .landing { padding: 0 40px; }
  .hero {
    text-align: center; padding: 80px 0 60px;
    background: radial-gradient(ellipse 70% 40% at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 70%);
  }
  .hero-badge { display: inline-flex; align-items: center; gap: 6px;
    background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.3);
    border-radius: 20px; padding: 6px 14px; margin-bottom: 24px; font-size: 12px; color: var(--accent2); }
  .pulse { width: 6px; height: 6px; border-radius: 50%; background: var(--green);
    animation: blink 1.5s infinite; display: inline-block; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
  .hero h1 { font-family: 'Syne', sans-serif; font-size: clamp(30px,5vw,60px);
    font-weight: 800; line-height: 1.1; margin-bottom: 20px; }
  .grad { background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #8b5cf6 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .hero p { font-size: 17px; color: var(--muted); max-width: 540px;
    margin: 0 auto 36px; line-height: 1.65; }
  .hero-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  .btn-primary { background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: white; border: none; padding: 14px 28px; border-radius: 10px; font-size: 15px;
    font-weight: 600; cursor: pointer; transition: all 0.2s; box-shadow: 0 0 24px var(--glow);
    font-family: 'DM Sans', sans-serif; }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 40px var(--glow); }
  .btn-outline { background: transparent; color: var(--text); border: 1px solid var(--border);
    padding: 14px 28px; border-radius: 10px; font-size: 15px; cursor: pointer;
    transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
  .btn-outline:hover { border-color: var(--accent); color: var(--accent); }
  .stats { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; padding: 0 0 60px; }
  .stat-card { background: var(--card); border: 1px solid var(--border);
    border-radius: 12px; padding: 20px 32px; text-align: center; }
  .stat-num { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .stat-label { font-size: 12px; color: var(--muted); margin-top: 4px; }
  .section-title { font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800;
    text-align: center; margin-bottom: 8px; }
  .section-sub { text-align: center; color: var(--muted); margin-bottom: 40px; }
  .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 16px; margin-bottom: 80px; }
  .feat-card { background: var(--card); border: 1px solid var(--border);
    border-radius: 16px; padding: 28px; transition: all 0.3s; }
  .feat-card:hover { border-color: var(--accent); transform: translateY(-4px);
    box-shadow: 0 8px 32px rgba(59,130,246,0.15); }
  .feat-icon { width: 44px; height: 44px; border-radius: 10px; display: flex;
    align-items: center; justify-content: center; font-size: 20px; margin-bottom: 16px; }
  .feat-card h3 { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 16px; margin-bottom: 8px; }
  .feat-card p { font-size: 13px; color: var(--muted); line-height: 1.65; }
  .pricing { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-bottom: 80px; }
  .price-card { background: var(--card); border: 1px solid var(--border);
    border-radius: 20px; padding: 32px 28px; width: 280px; position: relative; transition: all 0.3s; }
  .price-card.popular { border-color: var(--accent); box-shadow: 0 0 40px rgba(59,130,246,0.2); }
  .popular-tag { position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
    background: linear-gradient(135deg, var(--accent), var(--accent2)); color: white;
    font-size: 11px; font-weight: 700; padding: 4px 14px; border-radius: 20px; white-space: nowrap; }
  .price-plan { font-size: 12px; color: var(--muted); text-transform: uppercase;
    letter-spacing: 1px; margin-bottom: 12px; }
  .price-amount { font-family: 'Syne', sans-serif; font-size: 36px; font-weight: 800; margin-bottom: 4px; }
  .price-amount span { font-size: 16px; color: var(--muted); font-weight: 400; }
  .price-desc { font-size: 13px; color: var(--muted); margin-bottom: 24px; }
  .price-features { list-style: none; margin-bottom: 28px; }
  .price-features li { font-size: 13px; padding: 7px 0; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 8px; }
  .price-features li:last-child { border-bottom: none; }
  .check { color: var(--green); }
  .btn-plan { width: 100%; padding: 12px; border-radius: 10px; font-weight: 600;
    font-size: 14px; cursor: pointer; transition: all 0.2s; border: none; font-family: 'DM Sans', sans-serif; }
  .btn-plan-outline { background: transparent; border: 1px solid var(--border) !important; color: var(--text); }
  .btn-plan-outline:hover { border-color: var(--accent) !important; color: var(--accent); }
  .btn-plan-filled { background: linear-gradient(135deg, var(--accent), var(--accent2)); color: white; }
  .app-container { display: grid; grid-template-columns: 220px 1fr; min-height: calc(100vh - 61px); }
  .sidebar { background: var(--card); border-right: 1px solid var(--border);
    padding: 24px 0; display: flex; flex-direction: column; }
  .sidebar-section { padding: 0 16px; margin-bottom: 24px; }
  .sidebar-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px;
    color: var(--muted); margin-bottom: 8px; padding: 0 8px; }
  .sidebar-item { display: flex; align-items: center; gap: 10px; padding: 10px 8px;
    border-radius: 8px; cursor: pointer; font-size: 13px; color: var(--muted);
    transition: all 0.2s; margin-bottom: 2px; }
  .sidebar-item:hover, .sidebar-item.active { background: rgba(59,130,246,0.1); color: var(--text); }
  .sidebar-item.active { color: var(--accent); }
  .main-content { padding: 28px; overflow-y: auto; }
  .chat-header { margin-bottom: 24px; }
  .chat-header h2 { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; }
  .chat-header p { color: var(--muted); font-size: 13px; margin-top: 4px; }
  .chat-messages { height: 380px; overflow-y: auto; display: flex; flex-direction: column;
    gap: 16px; margin-bottom: 16px; padding: 4px; }
  .chat-messages::-webkit-scrollbar { width: 4px; }
  .chat-messages::-webkit-scrollbar-thumb { background: var(--border); }
  .msg { display: flex; gap: 12px; align-items: flex-start; }
  .msg.user { flex-direction: row-reverse; }
  .msg-avatar { width: 32px; height: 32px; border-radius: 8px; display: flex;
    align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
  .msg-avatar.ai { background: linear-gradient(135deg, var(--accent), var(--accent2)); }
  .msg-avatar.user-av { background: rgba(245,158,11,0.2); }
  .msg-bubble { max-width: 75%; background: var(--card); border: 1px solid var(--border);
    border-radius: 12px; padding: 12px 16px; font-size: 13px; line-height: 1.65; }
  .msg.user .msg-bubble { background: rgba(59,130,246,0.1); border-color: rgba(59,130,246,0.25); }
  .msg-bubble pre { background: rgba(0,0,0,0.4); border-radius: 8px; padding: 12px;
    overflow-x: auto; font-size: 12px; margin: 10px 0; white-space: pre-wrap;
    border: 1px solid var(--border); }
  .msg-bubble code { font-family: 'Courier New', monospace; color: var(--accent2); }
  .chat-input-row { display: flex; gap: 8px; }
  .chat-input { flex: 1; background: var(--card); border: 1px solid var(--border);
    border-radius: 10px; padding: 12px 16px; color: var(--text);
    font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; resize: none; }
  .chat-input:focus { border-color: var(--accent); }
  .chat-input::placeholder { color: var(--muted); }
  .chat-send { background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: white; border: none; padding: 12px 20px; border-radius: 10px;
    cursor: pointer; font-size: 18px; transition: all 0.2s; }
  .chat-send:hover { opacity: 0.9; transform: scale(1.05); }
  .chat-send:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .typing { display: flex; gap: 4px; align-items: center; padding: 8px; }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent);
    animation: bounce 1.2s infinite; }
  .dot:nth-child(2) { animation-delay: 0.2s; }
  .dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
  .quick-prompts { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
  .qp { background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.2);
    border-radius: 20px; padding: 6px 14px; font-size: 12px; cursor: pointer;
    color: var(--accent2); transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
  .qp:hover { background: rgba(59,130,246,0.18); }
  .error-msg { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3);
    color: #fca5a5; border-radius: 8px; padding: 10px 14px; font-size: 13px; margin-bottom: 12px; }
  .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
    gap: 16px; margin-bottom: 24px; }
  .metric-card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 20px; }
  .metric-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px;
    color: var(--muted); margin-bottom: 8px; }
  .metric-value { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; }
  .metric-change { font-size: 12px; margin-top: 4px; }
  .up { color: var(--green); } .dn { color: var(--red); }
  .sql-container { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .sql-panel { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 20px; }
  .sql-panel h3 { font-family: 'Syne', sans-serif; font-weight: 700; margin-bottom: 12px; font-size: 15px; }
  .sql-textarea { width: 100%; min-height: 120px; background: rgba(0,0,0,0.4);
    border: 1px solid var(--border); border-radius: 8px; padding: 12px; color: var(--text);
    font-family: 'Courier New', monospace; font-size: 13px; resize: vertical; outline: none; }
  .sql-textarea:focus { border-color: var(--accent); }
  .sql-output { background: rgba(0,0,0,0.5); border: 1px solid var(--border);
    border-radius: 8px; padding: 12px; min-height: 200px; font-family: 'Courier New', monospace;
    font-size: 12px; color: var(--accent2); white-space: pre-wrap; overflow-x: auto; line-height: 1.6; }
  .generate-btn { width: 100%; margin-top: 12px; padding: 11px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: white; border: none; border-radius: 8px; font-weight: 600;
    font-size: 14px; cursor: pointer; font-family: 'DM Sans', sans-serif; }
  .generate-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .calc-box { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 28px; }
  .calc-box h3 { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px; margin-bottom: 20px; }
  .calc-row { display: flex; align-items: center; justify-content: space-between;
    padding: 14px 0; border-bottom: 1px solid var(--border); }
  .calc-label { font-size: 14px; color: var(--muted); }
  .calc-input { background: rgba(0,0,0,0.3); border: 1px solid var(--border);
    border-radius: 8px; padding: 8px 12px; color: var(--text); width: 110px;
    text-align: right; font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; }
  .calc-input:focus { border-color: var(--accent); }
  .total-box { background: linear-gradient(135deg, rgba(59,130,246,0.08), rgba(6,182,212,0.08));
    border: 1px solid rgba(59,130,246,0.3); border-radius: 12px; padding: 24px;
    text-align: center; margin-top: 20px; }
  .total-amount { font-family: 'Syne', sans-serif; font-size: 44px; font-weight: 800;
    background: linear-gradient(135deg, var(--accent), var(--green));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .tag { display: inline-flex; align-items: center; background: rgba(16,185,129,0.1);
    border: 1px solid rgba(16,185,129,0.25); color: var(--green); border-radius: 6px;
    padding: 2px 8px; font-size: 11px; font-weight: 600; }
  @media (max-width: 768px) {
    .nav { padding: 12px 16px; } .nav-tabs { display: none; }
    .landing { padding: 0 16px; } .hero { padding: 48px 0 36px; }
    .app-container { grid-template-columns: 1fr; } .sidebar { display: none; }
    .sql-container { grid-template-columns: 1fr; } .main-content { padding: 16px; }
  }
`;

const FEATURES = [
  { icon: "🧠", bg: "rgba(59,130,246,0.15)", title: "Natural Language to SQL", desc: "Type your question in plain English — QueryMind converts it to a perfect SQL query instantly. No coding required." },
  { icon: "📊", bg: "rgba(16,185,129,0.15)", title: "Real-time Business Insights", desc: "Sales trends, revenue patterns, customer behavior — AI analyzes your data and delivers clear, actionable insights." },
  { icon: "🔮", bg: "rgba(139,92,246,0.15)", title: "Predictive Analytics", desc: "Revenue forecasting, churn prediction, inventory planning — know what's coming before it happens." },
  { icon: "📈", bg: "rgba(245,158,11,0.15)", title: "Automated Reports", desc: "Schedule daily or weekly PDF reports. They auto-generate and land in your inbox — zero manual effort." },
  { icon: "🔗", bg: "rgba(239,68,68,0.15)", title: "100+ Integrations", desc: "Connect MySQL, PostgreSQL, Snowflake, Shopify, Salesforce and more — all in one unified platform." },
  { icon: "🛡️", bg: "rgba(6,182,212,0.15)", title: "Enterprise Security", desc: "SOC 2 certified, GDPR compliant, end-to-end encrypted. Your data stays safe at all times." },
];

const PLANS = [
  { name: "Starter", price: "₹2,999", period: "/month", desc: "Perfect for small businesses", popular: false,
    features: ["5 database connections", "10,000 AI queries/mo", "Basic SQL generation", "Email reports", "Email support"] },
  { name: "Growth", price: "₹7,999", period: "/month", desc: "For scaling teams", popular: true,
    features: ["25 DB connections", "Unlimited AI queries", "Advanced analytics", "Custom dashboards", "Predictive insights", "Priority support"] },
  { name: "Enterprise", price: "Custom", period: "", desc: "For large organizations", popular: false,
    features: ["Unlimited everything", "On-premise deployment", "Custom AI model training", "Dedicated CSM", "SLA guarantee", "White-label option"] },
];

const QUICK_PROMPTS = [
  "Show revenue for last 30 days",
  "Who are my top 10 customers?",
  "Which products are underperforming?",
  "Forecast next month's sales",
];

// ✅ MAIN API CALL FUNCTION — Netlify Function use karta hai
const callAPI = async (question, type = "chat") => {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, type }),
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  const data = await res.json();
  return data.reply;
};

export default function App() {
  const [tab, setTab] = useState("landing");
  const [subTab, setSubTab] = useState("chat");
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hello! 👋 I'm QueryMind AI — your intelligent business data assistant. Ask me anything about your data: SQL queries, revenue trends, customer insights, predictions, and more. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatError, setChatError] = useState("");
  const [sqlInput, setSqlInput] = useState("Show me total revenue by product category for the last 6 months");
  const [sqlOutput, setSqlOutput] = useState("");
  const [sqlLoading, setSqlLoading] = useState(false);
  const [sqlError, setSqlError] = useState("");
  const [customers, setCustomers] = useState(100);
  const [planPrice, setPlanPrice] = useState(2999);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput("");
    setChatError("");
    setMessages(prev => [...prev, { role: "user", text: msg }]);
    setLoading(true);
    try {
      const reply = await callAPI(msg, "chat");
      setMessages(prev => [...prev, { role: "ai", text: reply }]);
    } catch (err) {
      setChatError("❌ API Error: " + err.message + " — Check Netlify Function logs.");
    }
    setLoading(false);
  };

  const generateSQL = async () => {
    if (!sqlInput.trim()) return;
    setSqlLoading(true);
    setSqlOutput("");
    setSqlError("");
    try {
      const reply = await callAPI(sqlInput, "sql");
      setSqlOutput(reply);
    } catch (err) {
      setSqlError("❌ Error: " + err.message);
    }
    setSqlLoading(false);
  };

  const formatMsg = (text) =>
    text.split(/(```[\s\S]*?```)/g).map((part, i) => {
      if (part.startsWith("```")) {
        const code = part.replace(/^```\w*\n?/, "").replace(/```$/, "");
        return <pre key={i}><code>{code}</code></pre>;
      }
      return <span key={i} style={{ whiteSpace: "pre-wrap" }}>{part}</span>;
    });

  const mrr = customers * planPrice;
  const arr = mrr * 12;

  return (
    <>
      <style>{STYLE}</style>
      <div className="app">

        {/* NAV */}
        <nav className="nav">
          <div className="logo">Query<span>Mind</span> AI</div>
          <div className="nav-tabs">
            {[["landing", "🏠 Home"], ["app", "⚡ Live Demo"], ["calculator", "💰 Revenue Calc"]].map(([t, l]) => (
              <button key={t} className={`nav-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{l}</button>
            ))}
          </div>
          <button className="nav-cta" onClick={() => setTab("app")}>Start Free Trial →</button>
        </nav>

        {/* LANDING PAGE */}
        {tab === "landing" && (
          <div className="scrollable">
            <div className="landing">
              <div className="hero">
                <div className="hero-badge"><span className="pulse" /> Live · 500+ Businesses Trust QueryMind</div>
                <h1>Turn Your Business Data Into<br /><span className="grad">Instant AI Insights</span></h1>
                <p>No SQL knowledge needed. Just ask in plain English — QueryMind AI delivers instant answers, automated reports, and revenue-driving predictions from your data.</p>
                <div className="hero-btns">
                  <button className="btn-primary" onClick={() => setTab("app")}>⚡ Try Live Demo Free</button>
                  <button className="btn-outline" onClick={() => setTab("calculator")}>💰 See Revenue Potential</button>
                </div>
              </div>

              <div className="stats">
                {[["500+", "Active Customers"], ["$2.1M", "ARR Achieved"], ["10M+", "AI Queries / Month"], ["4.9★", "Average Rating"]].map(([n, l]) => (
                  <div key={l} className="stat-card">
                    <div className="stat-num">{n}</div>
                    <div className="stat-label">{l}</div>
                  </div>
                ))}
              </div>

              <div className="section-title">Everything You Need to Win with Data</div>
              <div className="section-sub">One platform for SQL, Analytics, Predictions, and Automated Reporting</div>
              <div className="features">
                {FEATURES.map(f => (
                  <div key={f.title} className="feat-card">
                    <div className="feat-icon" style={{ background: f.bg }}>{f.icon}</div>
                    <h3>{f.title}</h3><p>{f.desc}</p>
                  </div>
                ))}
              </div>

              <div className="section-title">Simple, Transparent Pricing</div>
              <div className="section-sub">No hidden fees. Monthly billing. Cancel anytime.</div>
              <div className="pricing">
                {PLANS.map(p => (
                  <div key={p.name} className={`price-card ${p.popular ? "popular" : ""}`}>
                    {p.popular && <div className="popular-tag">⭐ MOST POPULAR</div>}
                    <div className="price-plan">{p.name}</div>
                    <div className="price-amount">{p.price}<span>{p.period}</span></div>
                    <div className="price-desc">{p.desc}</div>
                    <ul className="price-features">
                      {p.features.map(f => <li key={f}><span className="check">✓</span>{f}</li>)}
                    </ul>
                    <button className={`btn-plan ${p.popular ? "btn-plan-filled" : "btn-plan-outline"}`} onClick={() => setTab("app")}>
                      {p.name === "Enterprise" ? "Contact Sales" : "Start Free Trial"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* APP DEMO */}
        {tab === "app" && (
          <div className="app-container">
            <div className="sidebar">
              <div className="sidebar-section">
                <div className="sidebar-label">Navigation</div>
                {[["chat", "💬", "AI Chat"], ["dashboard", "📊", "Dashboard"], ["sql", "🔧", "SQL Generator"]].map(([id, ic, label]) => (
                  <div key={id} className={`sidebar-item ${subTab === id ? "active" : ""}`} onClick={() => setSubTab(id)}>
                    <span>{ic}</span><span>{label}</span>
                  </div>
                ))}
              </div>
              <div className="sidebar-section">
                <div className="sidebar-label">Data Sources</div>
                {[["🟢", "PostgreSQL", "Connected"], ["🟢", "MySQL", "Connected"], ["🔴", "Snowflake", "Add"]].map(([dot, name, status]) => (
                  <div key={name} className="sidebar-item">
                    <span>{dot}</span>
                    <span style={{ fontSize: "12px" }}>{name} <span style={{ color: "var(--muted)", fontSize: "10px" }}>({status})</span></span>
                  </div>
                ))}
              </div>
              <div className="sidebar-section" style={{ marginTop: "auto" }}>
                <div style={{ padding: "12px", background: "rgba(59,130,246,0.08)", borderRadius: "10px", border: "1px solid rgba(59,130,246,0.2)" }}>
                  <div style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "4px" }}>Current Plan</div>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--accent)" }}>Growth ⭐</div>
                  <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "2px" }}>₹7,999/month</div>
                </div>
              </div>
            </div>

            <div className="main-content">

              {/* AI CHAT */}
              {subTab === "chat" && (
                <div>
                  <div className="chat-header">
                    <h2>AI Chat Assistant 🧠</h2>
                    <p>Ask anything about your business data in plain English</p>
                  </div>
                  <div className="quick-prompts">
                    {QUICK_PROMPTS.map(p => (
                      <button key={p} className="qp" onClick={() => sendMessage(p)}>{p}</button>
                    ))}
                  </div>
                  {chatError && <div className="error-msg">{chatError}</div>}
                  <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px" }}>
                    <div className="chat-messages">
                      {messages.map((m, i) => (
                        <div key={i} className={`msg ${m.role === "user" ? "user" : ""}`}>
                          <div className={`msg-avatar ${m.role === "user" ? "user-av" : "ai"}`}>
                            {m.role === "user" ? "👤" : "🤖"}
                          </div>
                          <div className="msg-bubble">{formatMsg(m.text)}</div>
                        </div>
                      ))}
                      {loading && (
                        <div className="msg">
                          <div className="msg-avatar ai">🤖</div>
                          <div className="msg-bubble">
                            <div className="typing"><div className="dot" /><div className="dot" /><div className="dot" /></div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                    <div className="chat-input-row">
                      <textarea className="chat-input" rows={2}
                        placeholder="e.g. What was my total revenue last week broken down by category?"
                        value={input} onChange={e => setInput(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} />
                      <button className="chat-send" onClick={() => sendMessage()} disabled={loading || !input.trim()}>➤</button>
                    </div>
                  </div>
                </div>
              )}

              {/* DASHBOARD */}
              {subTab === "dashboard" && (
                <div>
                  <div className="chat-header">
                    <h2>Business Dashboard 📊</h2>
                    <p>Real-time metrics — your entire business at a glance</p>
                  </div>
                  <div className="metrics-grid">
                    {[
                      { label: "Revenue (MTD)", value: "₹8,42,300", change: "+18.4% vs last month", up: true },
                      { label: "Active Customers", value: "1,247", change: "+34 this week", up: true },
                      { label: "Avg Order Value", value: "₹2,840", change: "-2.1% vs last week", up: false },
                      { label: "Pending Orders", value: "89", change: "+12 today", up: true },
                    ].map(m => (
                      <div key={m.label} className="metric-card">
                        <div className="metric-label">{m.label}</div>
                        <div className="metric-value">{m.value}</div>
                        <div className={`metric-change ${m.up ? "up" : "dn"}`}>{m.up ? "▲" : "▼"} {m.change}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    {[
                      { title: "Top Products 🔥", cols: ["Product", "Revenue", "Units"], rows: [["Premium Widget", "₹1,24,500", "45"], ["Basic Kit", "₹89,200", "102"], ["Pro Bundle", "₹76,800", "28"]] },
                      { title: "Recent Orders 📦", cols: ["Order ID", "Customer", "Amount"], rows: [["#ORD-8821", "Rahul Sharma", "₹4,200"], ["#ORD-8820", "Priya Gupta", "₹8,900"], ["#ORD-8819", "Amit Patel", "₹2,100"]] },
                    ].map(panel => (
                      <div key={panel.title} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px" }}>
                        <h3 style={{ fontFamily: "Syne,sans-serif", fontWeight: "700", marginBottom: "14px", fontSize: "15px" }}>{panel.title}</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4px", marginBottom: "8px" }}>
                          {panel.cols.map(c => <span key={c} style={{ fontSize: "10px", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>{c}</span>)}
                        </div>
                        {panel.rows.map(row => (
                          <div key={row[0]} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "9px 0", borderTop: "1px solid var(--border)", fontSize: "13px" }}>
                            <span>{row[0]}</span>
                            <span style={{ color: "var(--muted)" }}>{row[1]}</span>
                            <span style={{ color: "var(--green)", fontWeight: "600" }}>{row[2]}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SQL GENERATOR */}
              {subTab === "sql" && (
                <div>
                  <div className="chat-header">
                    <h2>SQL Generator 🔧</h2>
                    <p>Describe what you want in plain English — get production-ready SQL instantly</p>
                  </div>
                  {sqlError && <div className="error-msg" style={{ marginBottom: "16px" }}>{sqlError}</div>}
                  <div className="sql-container">
                    <div className="sql-panel">
                      <h3>📝 Your Question</h3>
                      <textarea className="sql-textarea" value={sqlInput}
                        onChange={e => setSqlInput(e.target.value)}
                        placeholder="e.g. Find top 10 customers by total spend this quarter..." />
                      <button className="generate-btn" onClick={generateSQL} disabled={sqlLoading}>
                        {sqlLoading ? "⏳ Generating..." : "⚡ Generate SQL Query"}
                      </button>
                    </div>
                    <div className="sql-panel">
                      <h3>💻 Generated SQL <span className="tag">AI Powered</span></h3>
                      <div className="sql-output">
                        {sqlLoading ? "Generating optimized query..." : sqlOutput || "← Enter your question and click Generate"}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* REVENUE CALCULATOR */}
        {tab === "calculator" && (
          <div className="scrollable">
            <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 20px" }}>
              <div style={{ textAlign: "center", marginBottom: "32px" }}>
                <div className="section-title">💰 Revenue Calculator</div>
                <p style={{ color: "var(--muted)", marginTop: "8px" }}>Model your SaaS revenue potential</p>
              </div>
              <div className="calc-box">
                <h3>📊 Estimate Your Monthly Revenue</h3>
                <div className="calc-row">
                  <span className="calc-label">Number of Paying Customers</span>
                  <input type="number" className="calc-input" value={customers} min={1}
                    onChange={e => setCustomers(Number(e.target.value))} />
                </div>
                <div className="calc-row">
                  <span className="calc-label">Average Plan Price (₹/mo)</span>
                  <input type="number" className="calc-input" value={planPrice} min={1}
                    onChange={e => setPlanPrice(Number(e.target.value))} />
                </div>
                <div className="calc-row">
                  <span className="calc-label">SaaS Gross Margin</span>
                  <span style={{ color: "var(--green)", fontWeight: "700" }}>~85%</span>
                </div>
                <div className="total-box">
                  <div style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "8px" }}>Monthly Recurring Revenue (MRR)</div>
                  <div className="total-amount">₹{mrr.toLocaleString("en-IN")}</div>
                  <div style={{ fontSize: "14px", color: "var(--muted)", marginTop: "8px" }}>
                    Annual Recurring Revenue: <strong style={{ color: "var(--green)" }}>₹{arr.toLocaleString("en-IN")}</strong>
                  </div>
                </div>
                <div style={{ marginTop: "20px", padding: "16px", background: "rgba(16,185,129,0.06)", borderRadius: "12px", border: "1px solid rgba(16,185,129,0.2)" }}>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--green)", marginBottom: "12px" }}>📈 Growth Roadmap to ₹25L/month:</div>
                  {[
                    ["Month 1–3", "10–20 customers", "₹30K–60K/mo", "Beta launch + referrals"],
                    ["Month 4–6", "100 customers", "₹3L/mo", "LinkedIn + cold email"],
                    ["Month 7–12", "400 customers", "₹12L/mo", "Paid ads + partnerships"],
                    ["Year 2+", "800+ customers", "₹25L+/mo", "Enterprise + resellers"],
                  ].map(([phase, cust, rev, how]) => (
                    <div key={phase} style={{ padding: "10px 0", borderBottom: "1px solid rgba(16,185,129,0.12)", fontSize: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                        <span style={{ color: "var(--accent)", fontWeight: "600" }}>{phase}</span>
                        <span style={{ color: "var(--green)", fontWeight: "700" }}>{rev}</span>
                      </div>
                      <div style={{ color: "var(--muted)" }}>{cust} — {how}</div>
                    </div>
                  ))}
                </div>
                <button className="generate-btn" style={{ marginTop: "20px" }} onClick={() => setTab("app")}>
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