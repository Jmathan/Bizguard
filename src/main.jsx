import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, BarChart3,
  Bot, BriefcaseBusiness, Calculator, CheckCircle2, ChevronRight,
  CircleDollarSign, Gauge, Lightbulb, Menu, Moon, RefreshCw, ShieldCheck,
  Sparkles, Target, TrendingUp, Wallet, X, Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, CartesianGrid, XAxis, YAxis,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import "./styles.css";

const demo = {
  business: "Nova Retail",
  revenue: 500000,
  expenses: 420000,
  cash: 200000,
  debt: 50000,
  inventory: 100000,
  employees: 8
};

const trend = [
  { month: "Apr", revenue: 410, expenses: 350, profit: 60 },
  { month: "May", revenue: 435, expenses: 362, profit: 73 },
  { month: "Jun", revenue: 455, expenses: 375, profit: 80 },
  { month: "Jul", revenue: 470, expenses: 392, profit: 78 },
  { month: "Aug", revenue: 488, expenses: 405, profit: 83 },
  { month: "Sep", revenue: 500, expenses: 420, profit: 80 }
];

const money = (n) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0
}).format(n);

function analyze(data) {
  const profit = data.revenue - data.expenses;
  const margin = data.revenue ? (profit / data.revenue) * 100 : 0;
  const expenseRatio = data.revenue ? (data.expenses / data.revenue) * 100 : 100;
  const runway = data.expenses ? data.cash / data.expenses : 0;
  const debtRatio = data.revenue ? (data.debt / data.revenue) * 100 : 0;

  let score = 100;
  if (margin < 5) score -= 28;
  else if (margin < 10) score -= 18;
  else if (margin < 20) score -= 8;
  if (runway < 1) score -= 30;
  else if (runway < 3) score -= 18;
  else if (runway < 6) score -= 6;
  if (debtRatio > 20) score -= 18;
  else if (debtRatio > 10) score -= 8;
  if (expenseRatio > 90) score -= 15;
  else if (expenseRatio > 80) score -= 7;
  score = Math.max(0, Math.min(100, Math.round(score)));

  const risk = score >= 75 ? "LOW" : score >= 55 ? "MEDIUM" : "HIGH";
  return { profit, margin, expenseRatio, runway, debtRatio, score, risk };
}

function App() {
  const [data, setData] = useState(demo);
  const [active, setActive] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [scenario, setScenario] = useState({ revenue: 10, expenses: 0 });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiText, setAiText] = useState("");

  const metrics = useMemo(() => analyze(data), [data]);
  const scenarioData = useMemo(() => ({
    ...data,
    revenue: data.revenue * (1 + scenario.revenue / 100),
    expenses: data.expenses * (1 + scenario.expenses / 100)
  }), [data, scenario]);
  const scenarioMetrics = useMemo(() => analyze(scenarioData), [scenarioData]);

  const update = (key, value) => setData(d => ({ ...d, [key]: Number(value) || 0 }));

  const notify = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  };

  const askAI = async () => {
    setAiLoading(true);
    setAiText("");
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey) {
      try {
        const prompt = `You are BizGuard, a concise business financial advisor. Analyze this business:
Revenue ${data.revenue}, expenses ${data.expenses}, profit ${metrics.profit}, profit margin ${metrics.margin.toFixed(1)}%, cash ${data.cash}, runway ${metrics.runway.toFixed(1)} months, debt payment ${data.debt}, financial score ${metrics.score}/100, risk ${metrics.risk}.
Give 3 prioritized actions and one warning. Do not claim certainty.`;
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const json = await res.json();
        const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) setAiText(text);
        else throw new Error("No AI response");
      } catch {
        setAiText("Live AI could not be reached, so BizGuard switched to its built-in decision engine. Focus first on improving cash runway, protecting margins, and controlling fixed expenses.");
      }
    } else {
      const actions = [];
      if (metrics.runway < 3) actions.push("Build a larger cash reserve before taking on new commitments.");
      if (metrics.margin < 10) actions.push("Review your highest recurring expenses and protect gross margin.");
      if (metrics.debtRatio > 10) actions.push("Keep debt obligations under close review and avoid unnecessary new borrowing.");
      if (!actions.length) actions.push("Maintain the current discipline and reinvest selectively into profitable growth.");
      setAiText(`BizGuard decision brief\n\nRisk level: ${metrics.risk}\n\nPriority actions:\n• ${actions.join("\n• ")}\n\nOpportunity:\nA ${scenario.revenue}% revenue improvement would move the modeled health score from ${metrics.score} to ${scenarioMetrics.score}.`);
    }
    setAiLoading(false);
  };

  const nav = [
    ["dashboard", "Dashboard", Gauge],
    ["finance", "Financials", Calculator],
    ["risk", "Risk Center", ShieldCheck],
    ["advisor", "AI Advisor", Bot],
    ["simulator", "What-If Lab", Target]
  ];

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><ShieldCheck size={23}/></div>
          <div><strong>BizGuard</strong><span>Financial Intelligence</span></div>
          <button className="mobile-close" onClick={() => setMobileOpen(false)}><X size={19}/></button>
        </div>

        <div className="workspace">
          <span className="eyebrow">WORKSPACE</span>
          <div className="workspace-card">
            <div className="avatar">NR</div>
            <div><strong>{data.business}</strong><span>Owner workspace</span></div>
          </div>
        </div>

        <nav>
          <span className="eyebrow nav-label">COMMAND CENTER</span>
          {nav.map(([id, label, Icon]) => (
            <button key={id} className={`nav-item ${active === id ? "active" : ""}`} onClick={() => {setActive(id);setMobileOpen(false)}}>
              <Icon size={18}/><span>{label}</span>{id === "advisor" && <i>AI</i>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="mini-tip"><Sparkles size={16}/><span>AI insights are ready for your next decision.</span></div>
          <div className="secure"><CheckCircle2 size={14}/> Local demo mode • Secure by design</div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="menu-btn" onClick={() => setMobileOpen(true)}><Menu size={20}/></button>
          <div>
            <span className="eyebrow">BUSINESS COMMAND CENTER</span>
            <h1>{nav.find(x => x[0] === active)?.[1] || "Dashboard"}</h1>
          </div>
          <div className="top-actions">
            <div className="status"><span className="pulse"/> System healthy</div>
            <button className="icon-btn" onClick={() => notify("Demo data refreshed")}><RefreshCw size={18}/></button>
            <div className="user-avatar">BM</div>
          </div>
        </header>

        <div className="content">
          <AnimatePresence mode="wait">
            {active === "dashboard" && <Dashboard metrics={metrics} data={data} setActive={setActive} notify={notify}/>}
            {active === "finance" && <Financials data={data} update={update} metrics={metrics}/>}
            {active === "risk" && <RiskCenter metrics={metrics} data={data}/>}
            {active === "advisor" && <Advisor metrics={metrics} data={data} loading={aiLoading} text={aiText} askAI={askAI}/>}
            {active === "simulator" && <Simulator data={data} metrics={metrics} scenario={scenario} setScenario={setScenario} scenarioMetrics={scenarioMetrics}/>}
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {toast && <motion.div initial={{y:30,opacity:0}} animate={{y:0,opacity:1}} exit={{y:30,opacity:0}} className="toast"><CheckCircle2 size={17}/>{toast}</motion.div>}
      </AnimatePresence>
    </div>
  );
}

const pageMotion = { initial:{opacity:0,y:12}, animate:{opacity:1,y:0}, exit:{opacity:0,y:-8}, transition:{duration:.28} };

function Dashboard({metrics,data,setActive,notify}) {
  const pie = [{name:"Expenses",value:data.expenses},{name:"Profit",value:Math.max(metrics.profit,0)}];
  return <motion.div {...pageMotion}>
    <section className="hero">
      <div>
        <div className="hero-tag"><Sparkles size={14}/> AI-POWERED FINANCIAL COMMAND</div>
        <h2>Know your business.<br/><span>Guard your future.</span></h2>
        <p>One intelligent cockpit for cash flow, risk detection and better financial decisions.</p>
        <button className="primary" onClick={() => setActive("advisor")}><Bot size={17}/> Get AI decision brief <ChevronRight size={17}/></button>
      </div>
      <div className="score-orb">
        <div className="orb-ring"><div><strong>{metrics.score}</strong><span>/ 100</span></div></div>
        <p>Financial Health</p><b className={`risk-${metrics.risk.toLowerCase()}`}>{metrics.risk} RISK</b>
      </div>
    </section>

    <div className="metric-grid">
      <Metric title="Revenue" value={money(data.revenue)} icon={TrendingUp} trend="+8.4%" positive/>
      <Metric title="Net Profit" value={money(metrics.profit)} icon={CircleDollarSign} trend={`${metrics.margin.toFixed(1)}% margin`} positive={metrics.profit >= 0}/>
      <Metric title="Cash Reserve" value={money(data.cash)} icon={Wallet} trend={`${metrics.runway.toFixed(1)} mo runway`} positive={metrics.runway >= 3}/>
      <Metric title="Debt Obligation" value={money(data.debt)} icon={Activity} trend={`${metrics.debtRatio.toFixed(1)}% of revenue`} positive={metrics.debtRatio < 10}/>
    </div>

    <div className="grid-2">
      <Panel title="Revenue vs Expenses" subtitle="Last 6 months" action="View financials" onAction={() => setActive("finance")}>
        <div className="chart"><ResponsiveContainer width="100%" height={255}>
          <AreaChart data={trend}><defs><linearGradient id="rev" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopOpacity=".28"/><stop offset="100%" stopOpacity="0"/></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="month" axisLine={false} tickLine={false}/><YAxis axisLine={false} tickLine={false} tickFormatter={v=>`₹${v}k`}/>
            <Tooltip formatter={(v)=>[`₹${v}k`]}/><Area type="monotone" dataKey="revenue" strokeWidth={2.5} fill="url(#rev)" name="Revenue"/><Area type="monotone" dataKey="expenses" strokeWidth={2.5} fill="none" name="Expenses"/>
          </AreaChart>
        </ResponsiveContainer></div>
      </Panel>

      <Panel title="Profit Composition" subtitle="Current month">
        <div className="pie-wrap"><ResponsiveContainer width="50%" height={220}><PieChart><Pie data={pie} dataKey="value" innerRadius={65} outerRadius={88} paddingAngle={4}>{pie.map((_,i)=><Cell key={i} fill={i===0?"#24405d":"#7c6cff"}/>)}</Pie><Tooltip formatter={v=>money(v)}/></PieChart></ResponsiveContainer>
        <div className="pie-center"><strong>{money(metrics.profit)}</strong><span>Net profit</span></div></div>
        <div className="legend"><span><i className="dot dark"/>Expenses <b>{metrics.expenseRatio.toFixed(0)}%</b></span><span><i className="dot purple"/>Profit <b>{Math.max(metrics.margin,0).toFixed(0)}%</b></span></div>
      </Panel>
    </div>

    <section className="insight-strip">
      <div className="insight-icon"><Lightbulb size={19}/></div>
      <div><strong>BizGuard's read</strong><p>{metrics.runway < 3 ? "Cash runway is your biggest vulnerability. Prioritize liquidity before aggressive expansion." : metrics.margin < 10 ? "Your margin is tight. Small cost reductions can materially improve resilience." : "Your core numbers look healthy. Focus on controlled growth while preserving your cash buffer."}</p></div>
      <button className="ghost" onClick={() => setActive("risk")}>Explore risks <ChevronRight size={16}/></button>
    </section>
  </motion.div>
}

function Metric({title,value,icon:Icon,trend,positive}) {
  return <motion.div className="metric-card" whileHover={{y:-3}}>
    <div className="metric-top"><span>{title}</span><div className="metric-icon"><Icon size={17}/></div></div>
    <strong>{value}</strong><small className={positive?"positive":"negative"}>{positive?<ArrowUpRight size={13}/>:<ArrowDownRight size={13}/>} {trend}</small>
  </motion.div>
}

function Panel({title,subtitle,action,onAction,children}) {
  return <section className="panel"><div className="panel-head"><div><h3>{title}</h3><span>{subtitle}</span></div>{action && <button className="link-btn" onClick={onAction}>{action}<ChevronRight size={14}/></button>}</div>{children}</section>
}

function Financials({data,update,metrics}) {
  return <motion.div {...pageMotion}>
    <div className="section-intro"><div><span className="eyebrow">INPUT + ANALYSIS</span><h2>Financial profile</h2><p>Adjust the business numbers and BizGuard recalculates its intelligence instantly.</p></div><div className="score-pill"><Gauge size={16}/> Score <b>{metrics.score}/100</b></div></div>
    <div className="finance-layout">
      <Panel title="Business inputs" subtitle="Demo data — editable">
        <div className="input-grid">
          {[
            ["business","Business name",data.business,"text"],
            ["revenue","Monthly revenue",data.revenue,"number"],
            ["expenses","Monthly expenses",data.expenses,"number"],
            ["cash","Available cash",data.cash,"number"],
            ["debt","Monthly debt payment",data.debt,"number"],
            ["inventory","Inventory value",data.inventory,"number"],
            ["employees","Employees",data.employees,"number"]
          ].map(([k,label,val,type])=><label className="field" key={k}><span>{label}</span><div className="input-wrap">{type==="number"&&<b>₹</b>}<input type={type} value={val} onChange={e=>update(k,e.target.value)}/></div></label>)}
        </div>
      </Panel>
      <div className="formula-stack">
        <Formula title="Net Profit" value={money(metrics.profit)} formula="Revenue − Expenses" icon={CircleDollarSign}/>
        <Formula title="Profit Margin" value={`${metrics.margin.toFixed(1)}%`} formula="Profit ÷ Revenue × 100" icon={BarChart3}/>
        <Formula title="Cash Runway" value={`${metrics.runway.toFixed(1)} months`} formula="Cash ÷ Monthly Expenses" icon={Wallet}/>
        <Formula title="Debt Ratio" value={`${metrics.debtRatio.toFixed(1)}%`} formula="Debt Payment ÷ Revenue × 100" icon={Activity}/>
      </div>
    </div>
  </motion.div>
}

function Formula({title,value,formula,icon:Icon}) {
  return <motion.div className="formula" whileHover={{x:4}}><div className="formula-icon"><Icon size={18}/></div><div><span>{title}</span><strong>{value}</strong><small>{formula}</small></div></motion.div>
}

function RiskCenter({metrics,data}) {
  const risks = [
    {name:"Cash resilience", level:metrics.runway < 1 ? "Critical" : metrics.runway < 3 ? "Watch" : "Healthy", score:Math.min(100,metrics.runway*20+20), text:`${metrics.runway.toFixed(1)} months of operating runway.`},
    {name:"Profitability", level:metrics.margin < 5 ? "Critical" : metrics.margin < 10 ? "Watch" : "Healthy", score:Math.min(100,Math.max(0,metrics.margin*5)), text:`${metrics.margin.toFixed(1)}% net margin at current revenue.`},
    {name:"Debt pressure", level:metrics.debtRatio > 20 ? "Critical" : metrics.debtRatio > 10 ? "Watch" : "Healthy", score:Math.max(0,100-metrics.debtRatio*3), text:`Debt payment equals ${metrics.debtRatio.toFixed(1)}% of monthly revenue.`},
    {name:"Cost efficiency", level:metrics.expenseRatio > 90 ? "Critical" : metrics.expenseRatio > 80 ? "Watch" : "Healthy", score:Math.max(0,100-(metrics.expenseRatio-50)*2), text:`${metrics.expenseRatio.toFixed(1)}% of revenue is currently spent.`}
  ];
  return <motion.div {...pageMotion}>
    <div className="section-intro"><div><span className="eyebrow">EARLY WARNING SYSTEM</span><h2>Risk center</h2><p>BizGuard converts financial signals into an easy-to-act-on risk map.</p></div><div className={`big-risk risk-${metrics.risk.toLowerCase()}`}><ShieldCheck size={18}/> {metrics.risk} RISK</div></div>
    <div className="risk-summary"><div className="risk-score"><strong>{metrics.score}</strong><span>Overall resilience</span></div><div className="risk-message"><AlertTriangle size={20}/><div><strong>{metrics.risk === "HIGH" ? "Immediate attention required" : metrics.risk === "MEDIUM" ? "A few signals need attention" : "Business fundamentals look resilient"}</strong><p>Risk is calculated from cash runway, profitability, debt pressure and expense load.</p></div></div></div>
    <div className="risk-list">{risks.map((r,i)=><motion.div className="risk-row" key={r.name} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*.07}}><div className="risk-title"><div className={`risk-bullet ${r.level.toLowerCase()}`}>{r.level==="Healthy"?<CheckCircle2 size={16}/>:<AlertTriangle size={16}/>}</div><div><strong>{r.name}</strong><span>{r.text}</span></div></div><div className="risk-meter"><div style={{width:`${r.score}%`}}/></div><b className={r.level==="Healthy"?"healthy":r.level==="Watch"?"watch":"critical"}>{r.level}</b></motion.div>)}</div>
  </motion.div>
}

function Advisor({metrics,data,loading,text,askAI}) {
  return <motion.div {...pageMotion}>
    <div className="advisor-hero"><div className="ai-orb"><Bot size={28}/></div><div><span className="eyebrow">BIZGUARD AI</span><h2>Decision brief</h2><p>Turn your numbers into clear, prioritized business actions.</p></div><button className="primary ai-button" onClick={askAI} disabled={loading}>{loading?<RefreshCw className="spin" size={17}/>:<Sparkles size={17}/>} {loading?"Analyzing...":"Run AI analysis"}</button></div>
    <div className="ai-grid">
      <Panel title="Current context" subtitle="What the AI sees">
        <div className="context-grid">
          <div><span>Health score</span><strong>{metrics.score}/100</strong></div><div><span>Risk</span><strong>{metrics.risk}</strong></div><div><span>Profit margin</span><strong>{metrics.margin.toFixed(1)}%</strong></div><div><span>Runway</span><strong>{metrics.runway.toFixed(1)} mo</strong></div>
        </div>
        <div className="prompt-card"><Sparkles size={16}/><span>AI combines these signals to produce recommendations. It does not replace a qualified financial professional.</span></div>
      </Panel>
      <Panel title="AI recommendation" subtitle={text ? "Generated decision brief" : "Ready when you are"}>
        <div className={`ai-output ${!text?"empty":""}`}>
          {!text ? <><div className="empty-orb"><Bot size={26}/></div><strong>Generate your first decision brief</strong><p>BizGuard will explain the biggest risk, the best next actions and a growth opportunity.</p><button className="secondary" onClick={askAI}><Zap size={15}/> Analyze now</button></> : <pre>{text}</pre>}
        </div>
      </Panel>
    </div>
  </motion.div>
}

function Simulator({data,metrics,scenario,setScenario,scenarioMetrics}) {
  const delta = scenarioMetrics.score - metrics.score;
  return <motion.div {...pageMotion}>
    <div className="section-intro"><div><span className="eyebrow">DECISION SIMULATION</span><h2>What-If Lab</h2><p>Test a business decision before making it. Results are modeled, not guaranteed forecasts.</p></div><div className="scenario-badge"><Zap size={15}/> Live simulation</div></div>
    <div className="sim-layout">
      <Panel title="Change the assumptions" subtitle="Drag the levers">
        <div className="slider-block"><div><span>Revenue change</span><b>{scenario.revenue > 0 ? "+" : ""}{scenario.revenue}%</b></div><input type="range" min="-30" max="50" value={scenario.revenue} onChange={e=>setScenario(s=>({...s,revenue:Number(e.target.value)}))}/><div className="range-labels"><span>-30%</span><span>+50%</span></div></div>
        <div className="slider-block"><div><span>Expense change</span><b>{scenario.expenses > 0 ? "+" : ""}{scenario.expenses}%</b></div><input type="range" min="-30" max="40" value={scenario.expenses} onChange={e=>setScenario(s=>({...s,expenses:Number(e.target.value)}))}/><div className="range-labels"><span>-30%</span><span>+40%</span></div></div>
        <div className="scenario-callout"><Lightbulb size={17}/><span>Try <b>+20% revenue</b> with <b>-5% expenses</b> for a strong growth scenario.</span></div>
      </Panel>
      <div className="compare-card">
        <div className="compare-head"><span>BASELINE</span><ArrowUpRight size={16}/><span>SIMULATED</span></div>
        <Compare label="Revenue" base={data.revenue} next={scenarioData(data,scenario).revenue}/>
        <Compare label="Profit" base={metrics.profit} next={scenarioMetrics.profit}/>
        <Compare label="Health score" base={metrics.score} next={scenarioMetrics.score} suffix="/100"/>
        <div className={`impact ${delta>=0?"up":"down"}`}><TrendingUp size={19}/><div><strong>{delta>=0?"+":""}{delta} points</strong><span>change in modeled financial health</span></div></div>
      </div>
    </div>
  </motion.div>
}
function scenarioData(d,s){return {...d,revenue:d.revenue*(1+s.revenue/100),expenses:d.expenses*(1+s.expenses/100)}}
function Compare({label,base,next,suffix=""}){return <div className="compare-row"><span>{label}</span><div><b>{label==="Health score"?base:money(base)}{suffix}</b><ChevronRight size={15}/><b className={next>=base?"better":"worse"}>{label==="Health score"?Math.round(next):money(next)}{suffix}</b></div></div>}

createRoot(document.getElementById("root")).render(<App />);
