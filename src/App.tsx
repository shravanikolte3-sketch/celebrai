import { useMemo, useState } from 'react'
import {
  ArrowRight, BarChart3, Bell, CalendarDays, Check, ChevronDown, CircleHelp,
  ClipboardCheck, CloudRain, IndianRupee, LayoutDashboard, Leaf, Lightbulb,
  Menu, MessageCircle, MoreHorizontal, PartyPopper, Plus, Search, Send,
  Settings, Sparkles, Target, Users, X, Zap
} from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

type View = 'overview' | 'budget' | 'timeline' | 'vendors' | 'simulator'
type BudgetItem = { label: string; amount: number; color: string; note: string }

const initialBudget: BudgetItem[] = [
  { label: 'Catering', amount: 22500, color: '#f47b65', note: 'Vegetarian buffet + welcome drinks' },
  { label: 'Decorations', amount: 10500, color: '#7d5cff', note: 'Elegant floral and warm-light setup' },
  { label: 'Venue', amount: 8000, color: '#f7b955', note: 'Community hall, 5 hours' },
  { label: 'Photography', amount: 4500, color: '#58bca5', note: 'Candid coverage, 3 hours' },
  { label: 'Entertainment', amount: 2500, color: '#9b8cff', note: 'Games + curated playlist' },
  { label: 'Miscellaneous', amount: 2000, color: '#b8b2a7', note: 'Gifts, transport, buffer' },
]

const timeline = [
  { date: 'May 18', title: 'Book venue & caterer', group: 'This week', priority: 'High', done: true },
  { date: 'May 22', title: 'Send digital invitations', group: 'This week', priority: 'High', done: true },
  { date: 'May 28', title: 'Finalize menu tasting', group: 'Next week', priority: 'Medium', done: false },
  { date: 'Jun 04', title: 'Confirm guest count', group: 'Next week', priority: 'Medium', done: false },
  { date: 'Jun 10', title: 'Order cake & return gifts', group: 'In 3 weeks', priority: 'Low', done: false },
]

const vendors = [
  { name: 'Saffron Leaf Catering', type: 'Vegetarian catering', rating: '4.8', price: '₹18k–₹25k', initials: 'SL', color: '#fce3dc', saved: true },
  { name: 'Marigold Moments', type: 'Decorations', rating: '4.7', price: '₹8k–₹14k', initials: 'MM', color: '#e5e0ff', saved: false },
  { name: 'Frame & Fern Studio', type: 'Photography', rating: '4.9', price: '₹4k–₹8k', initials: 'FF', color: '#d9f0e9', saved: false },
  { name: 'The Courtyard Hall', type: 'Venue', rating: '4.6', price: '₹6k–₹10k', initials: 'CH', color: '#fff0cc', saved: true },
]

const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN')}`

function App() {
  const [view, setView] = useState<View>('overview')
  const [budget, setBudget] = useState(initialBudget)
  const [chatOpen, setChatOpen] = useState(true)
  const [setupOpen, setSetupOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    { from: 'ai', text: 'I’ve put together a thoughtful plan for your birthday celebration. What would you like to adjust?' },
  ])
  const [completed, setCompleted] = useState(timeline.map((item) => item.done))
  const total = budget.reduce((sum, item) => sum + item.amount, 0)
  const chartData = budget.map(({ label, amount, color }) => ({ name: label, value: amount, color }))

  const navItems: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'budget', label: 'Budget planner', icon: BarChart3 },
    { id: 'timeline', label: 'Timeline', icon: CalendarDays },
    { id: 'vendors', label: 'Vendors', icon: Users },
    { id: 'simulator', label: 'What-if simulator', icon: Zap },
  ]

  const progress = useMemo(() => Math.round((completed.filter(Boolean).length / completed.length) * 100), [completed])

  function sendMessage() {
    if (!message.trim()) return
    const text = message.trim()
    setMessages((current) => [...current, { from: 'user', text }, { from: 'ai', text: 'Got it — I’ll keep catering quality and the guest experience protected. Try the What-if simulator to compare the revised plan.' }])
    setMessage('')
  }

  function adjustBudget(index: number, amount: number) {
    setBudget((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, amount: Math.max(0, amount) } : item))
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><Sparkles size={18} /></div><span>Celebr<span>AI</span></span></div>
        <button className="workspace-switcher" onClick={() => setSetupOpen(true)}><div className="event-avatar">B</div><div><strong>Birthday celebration</strong><small>Pune · Jun 21, 2025</small></div><ChevronDown size={15} /></button>
        <div className="side-label">Workspace</div>
        <nav>{navItems.map(({ id, label, icon: Icon }) => <button key={id} className={view === id ? 'nav-item active' : 'nav-item'} onClick={() => setView(id)}><Icon size={18} /><span>{label}</span>{id === 'simulator' && <span className="new-pill">NEW</span>}</button>)}</nav>
        <div className="sidebar-bottom">
          <div className="tip-card"><Lightbulb size={17} /><div><strong>Planning tip</strong><p>Book your caterer early — June weekends fill up fast.</p></div></div>
          <button className="nav-item"><Settings size={18} /><span>Settings</span></button>
          <div className="profile"><div className="profile-avatar">SK</div><div><strong>Shravani Kolte</strong><small>Personal workspace</small></div><MoreHorizontal size={17} /></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar"><button className="mobile-menu"><Menu size={21} /></button><div className="breadcrumb">My events <span>/</span> <strong>Birthday celebration</strong></div><div className="top-actions"><button className="icon-btn"><Bell size={18} /><i /></button><button className="help-btn"><CircleHelp size={17} /> Help</button><button className="share-btn">Share plan <ArrowRight size={16} /></button></div></header>
        <div className="page-wrap">
          {view === 'overview' && <Overview progress={progress} total={total} onView={setView} completed={completed} setCompleted={setCompleted} />}
          {view === 'budget' && <Budget budget={budget} total={total} chartData={chartData} onAdjust={adjustBudget} />}
          {view === 'timeline' && <Timeline completed={completed} setCompleted={setCompleted} />}
          {view === 'vendors' && <Vendors />}
          {view === 'simulator' && <Simulator budget={budget} />}
        </div>
      </main>

      {chatOpen && <aside className="copilot-panel">
        <div className="copilot-head"><div className="copilot-title"><div className="copilot-icon"><Sparkles size={18} /></div><div><strong>CelebrAI Copilot</strong><small>Demo mode · Ready to help</small></div></div><button className="close-btn" onClick={() => setChatOpen(false)}><X size={18} /></button></div>
        <div className="chat-body">{messages.map((item, index) => <div key={index} className={`chat-row ${item.from}`}><div className="chat-avatar">{item.from === 'ai' ? <Sparkles size={13} /> : 'SK'}</div><div className="chat-bubble">{item.text}</div></div>)}<div className="suggestion"><Sparkles size={14} /><span>Try: “Reduce budget to ₹40,000”</span></div></div>
        <div className="chat-input"><input value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && sendMessage()} placeholder="Ask your copilot anything..." /><button onClick={sendMessage}><Send size={16} /></button></div>
      </aside>}
      {!chatOpen && <button className="reopen-chat" onClick={() => setChatOpen(true)}><MessageCircle size={20} /><span>Ask CelebrAI</span></button>}
      {setupOpen && <SetupModal onClose={() => setSetupOpen(false)} />}
    </div>
  )
}

function SetupModal({ onClose }: { onClose: () => void }) {
  const [eventType, setEventType] = useState('Birthday')
  const [guestCount, setGuestCount] = useState('100')
  const [budget, setBudget] = useState('50000')
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="setup-modal">
      <div className="modal-head"><div><p className="eyebrow">EVENT SETUP</p><h2>Tell us about your celebration.</h2><p>We’ll use these details to personalize your blueprint.</p></div><button className="close-btn" onClick={onClose}><X size={18} /></button></div>
      <div className="setup-grid">
        <label>What are you celebrating?<select value={eventType} onChange={(event) => setEventType(event.target.value)}><option>Birthday</option><option>Wedding</option><option>Anniversary</option><option>College festival</option><option>Community event</option></select></label>
        <label>Event date<input type="date" defaultValue="2025-06-21" /></label>
        <label>Location<input defaultValue="Pune" /></label>
        <label>Guest count<input type="number" value={guestCount} onChange={(event) => setGuestCount(event.target.value)} /></label>
        <label>Planned budget (₹)<input type="number" value={budget} onChange={(event) => setBudget(event.target.value)} /></label>
        <label>Theme or mood<input defaultValue="Elegant, warm and family-friendly" /></label>
      </div>
      <div className="setup-preferences"><strong>Preferences</strong><div><button className="preference selected">Vegetarian</button><button className="preference selected">Elegant decor</button><button className="preference">Eco-friendly</button><button className="preference">Live music</button></div></div>
      <div className="modal-foot"><span><Sparkles size={14} /> Demo mode creates an instant sample blueprint</span><button className="primary-btn" onClick={onClose}>Generate my plan <ArrowRight size={16} /></button></div>
    </section>
  </div>
}

function Overview({ progress, total, onView, completed, setCompleted }: { progress: number; total: number; onView: (view: View) => void; completed: boolean[]; setCompleted: (value: boolean[]) => void }) {
  return <><div className="welcome-row"><div><p className="eyebrow">Saturday, May 17, 2025</p><h1>Good morning, Shravani <span>✦</span></h1><p className="subheading">Your celebration is coming together beautifully.</p></div><button className="outline-btn"><CalendarDays size={16} /> Jun 21, 2025 <ChevronDown size={14} /></button></div>
    <section className="hero-card"><div className="hero-copy"><div className="hero-tag"><PartyPopper size={14} /> 35 days to go</div><h2>A celebration as <em>special</em> as they are.</h2><p>Your plan for a warm, elegant birthday celebration with 100 guests in Pune.</p><div className="hero-actions"><button className="primary-btn" onClick={() => onView('budget')}>Review your plan <ArrowRight size={16} /></button><button className="text-btn" onClick={() => onView('simulator')}>Explore what-if scenarios</button></div></div><div className="hero-illustration"><div className="sun"></div><div className="cake">✦<span>Happy</span><strong>Birthday</strong></div><div className="confetti c1">✦</div><div className="confetti c2">•</div><div className="confetti c3">✦</div></div></section>
    <div className="section-heading"><div><h2>At a glance</h2><p>Everything you need, in one calm place.</p></div><button className="text-btn" onClick={() => onView('timeline')}>View all activity <ArrowRight size={15} /></button></div>
    <div className="stats-grid"><StatCard icon={<IndianRupee />} label="Budget remaining" value={formatCurrency(total)} note="of ₹50,000 planned" color="coral" action={() => onView('budget')} /><StatCard icon={<Target />} label="Planning progress" value={`${progress}%`} note={`${completed.filter(Boolean).length} of ${completed.length} tasks complete`} color="purple" progress={progress} action={() => onView('timeline')} /><StatCard icon={<Users />} label="Guest count" value="100" note="Vegetarian menu" color="yellow" action={() => onView('vendors')} /></div>
    <div className="content-grid"><section className="panel upcoming"><div className="panel-title"><div><h3>Up next</h3><p>Your most important planning tasks.</p></div><button className="dots-btn"><MoreHorizontal size={18} /></button></div><div className="task-list">{timeline.slice(0, 3).map((task, index) => <div className="task-row" key={task.title}><button className={`check ${completed[index] ? 'checked' : ''}`} onClick={() => setCompleted(completed.map((value, taskIndex) => taskIndex === index ? !value : value))}>{completed[index] && <Check size={13} />}</button><div className="task-date">{task.date}</div><div className="task-info"><strong>{task.title}</strong><small>{task.priority} priority</small></div><ArrowRight size={15} className="task-arrow" /></div>)}</div><button className="panel-link" onClick={() => onView('timeline')}>See full timeline <ArrowRight size={15} /></button></section><section className="panel idea-panel"><div className="idea-icon"><Leaf size={18} /></div><p className="eyebrow">A thoughtful touch</p><h3>Make it memorable</h3><p>Set up a “memory lane” with printed photos and handwritten notes from loved ones. It’s personal, beautiful, and budget-friendly.</p><button className="text-btn">Add to my plan <Plus size={15} /></button></section></div>
  </>
}

function StatCard({ icon, label, value, note, color, progress, action }: { icon: React.ReactNode; label: string; value: string; note: string; color: string; progress?: number; action: () => void }) {
  return <button className="stat-card" onClick={action}><div className={`stat-icon ${color}`}>{icon}</div><div className="stat-label">{label}<ArrowRight size={14} /></div><strong>{value}</strong>{progress !== undefined ? <div className="progress-track"><div style={{ width: `${progress}%` }} /></div> : null}<small>{note}</small></button>
}

function Budget({ budget, total, chartData, onAdjust }: { budget: BudgetItem[]; total: number; chartData: { name: string; value: number; color: string }[]; onAdjust: (index: number, amount: number) => void }) {
  return <><PageHeader eyebrow="YOUR PLAN / BUDGET" title="A budget that feels good." description="Keep every rupee intentional. These are estimates based on your preferences." action={<button className="primary-btn"><Sparkles size={15} /> Get saving ideas</button>} /><div className="budget-top"><section className="panel budget-summary"><div className="panel-title"><div><h3>Budget overview</h3><p>Estimated plan · Updated just now</p></div><span className="estimate-badge">ESTIMATES</span></div><div className="big-total">{formatCurrency(total)} <small>/ ₹50,000</small></div><div className="budget-progress"><div style={{ width: `${Math.min(total / 50000 * 100, 100)}%` }} /></div><div className="summary-foot"><span>{total <= 50000 ? `${formatCurrency(50000 - total)} remaining` : `${formatCurrency(total - 50000)} over budget`}</span><span>{Math.round(total / 50000 * 100)}% allocated</span></div><div className="chart-wrap"><ResponsiveContainer width="100%" height={190}><PieChart><Pie data={chartData} dataKey="value" innerRadius={58} outerRadius={82} paddingAngle={3}>{chartData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip formatter={(value) => formatCurrency(Number(value))} /></PieChart></ResponsiveContainer><div className="chart-center"><strong>{formatCurrency(total)}</strong><small>planned</small></div></div><div className="legend">{chartData.map((item) => <span key={item.name}><i style={{ background: item.color }} />{item.name}</span>)}</div></section><section className="panel saving-card"><div className="idea-icon"><Lightbulb size={18} /></div><h3>Room to be thoughtful</h3><p>You have a healthy buffer for the little details that make a gathering feel personal.</p><div className="saving-row"><span>Suggested buffer</span><strong>₹2,000</strong></div><button className="outline-btn">See saving alternatives <ArrowRight size={15} /></button></section></div><section className="panel expense-panel"><div className="panel-title"><div><h3>Expense breakdown</h3><p>Adjust allocations to make this plan yours.</p></div><button className="outline-btn"><Plus size={15} /> Add category</button></div>{budget.map((item, index) => <div className="expense-row" key={item.label}><div className="expense-color" style={{ background: item.color }} /><div className="expense-name"><strong>{item.label}</strong><small>{item.note}</small></div><input type="number" value={item.amount} onChange={(event) => onAdjust(index, Number(event.target.value))} /><span className="estimate-label">Estimated</span><MoreHorizontal size={18} className="muted" /></div>)}</section></>
}

function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) { return <div className="page-header"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="subheading">{description}</p></div>{action}</div> }

function Timeline({ completed, setCompleted }: { completed: boolean[]; setCompleted: (value: boolean[]) => void }) {
  return <><PageHeader eyebrow="YOUR PLAN / TIMELINE" title="A little progress, every day." description="A calm, practical path from today to celebration day." action={<button className="primary-btn"><Plus size={16} /> Add task</button>} /><div className="timeline-layout"><section className="panel timeline-panel"><div className="timeline-summary"><div><strong>{completed.filter(Boolean).length} of {completed.length}</strong><span>tasks complete</span></div><div className="progress-track large"><div style={{ width: `${completed.filter(Boolean).length / completed.length * 100}%` }} /></div><span className="percentage">{Math.round(completed.filter(Boolean).length / completed.length * 100)}%</span></div>{timeline.map((item, index) => <div className="timeline-row" key={item.title}><div className="timeline-date"><strong>{item.date.split(' ')[1]}</strong><span>{item.date.split(' ')[0]}</span></div><div className={`timeline-line ${index === 0 ? 'first' : ''}`}><button className={`check ${completed[index] ? 'checked' : ''}`} onClick={() => setCompleted(completed.map((value, i) => i === index ? !value : value))}>{completed[index] && <Check size={13} />}</button></div><div className="timeline-task"><strong className={completed[index] ? 'strike' : ''}>{item.title}</strong><span className={`priority ${item.priority.toLowerCase()}`}>{item.priority} priority</span></div><MoreHorizontal size={18} className="muted" /></div>)}</section><aside className="panel timeline-note"><CloudRain size={20} /><p className="eyebrow">Plan for peace of mind</p><h3>Your backup plan is ready.</h3><p>Rain on the day? We’ve prepared an indoor setup option and a guest communication checklist.</p><button className="text-btn">View contingency plan <ArrowRight size={15} /></button></aside></div></>
}

function Vendors() { const [search, setSearch] = useState(''); const [saved, setSaved] = useState(vendors.map(v => v.saved)); const filtered = vendors.filter(v => v.name.toLowerCase().includes(search.toLowerCase()) || v.type.toLowerCase().includes(search.toLowerCase())); return <><PageHeader eyebrow="YOUR PLAN / VENDORS" title="People who make it happen." description="A shortlist of what you need, with transparent estimate ranges." action={<button className="primary-btn"><Search size={16} /> Discover vendors</button>} /><div className="vendor-toolbar"><div className="search-field"><Search size={17} /><input placeholder="Search vendors or services" value={search} onChange={event => setSearch(event.target.value)} /></div><button className="outline-btn">All services <ChevronDown size={14} /></button><button className="outline-btn">Recommended <ChevronDown size={14} /></button></div><div className="vendor-grid">{filtered.map((vendor, index) => <article className="vendor-card" key={vendor.name}><div className="vendor-card-top"><div className="vendor-initials" style={{ background: vendor.color }}>{vendor.initials}</div><button className={`save-btn ${saved[index] ? 'saved' : ''}`} onClick={() => setSaved(saved.map((value, i) => i === index ? !value : value))}>♥</button></div><p className="eyebrow">{vendor.type}</p><h3>{vendor.name}</h3><div className="vendor-meta"><span>★ {vendor.rating}</span><span>{vendor.price}</span></div><div className="vendor-foot"><span className="estimate-label">Estimate · Demo data</span><button className="text-btn">View details <ArrowRight size={14} /></button></div></article>)}</div><div className="demo-notice"><CircleHelp size={16} /><span>Vendor listings are sample data for demo purposes. Availability and prices must be verified directly with vendors.</span></div></> }

function Simulator({ budget }: { budget: BudgetItem[] }) { const [guests, setGuests] = useState(100); const [simBudget, setSimBudget] = useState(50000); const baseCatering = budget[0].amount; const newCatering = Math.round(baseCatering * guests / 100); const difference = newCatering - baseCatering; const savings = simBudget - (50000 + difference); return <><PageHeader eyebrow="YOUR PLAN / WHAT-IF SIMULATOR" title="Try it before you decide." description="Explore changes without touching your saved plan." action={<span className="demo-badge"><Sparkles size={14} /> Live estimate</span>} /><div className="simulator-grid"><section className="panel scenario-controls"><div className="panel-title"><div><h3>Change a few things</h3><p>Your saved plan stays safe.</p></div><Target size={19} className="muted" /></div><label>Guest count <strong>{guests} guests</strong><input type="range" min="50" max="200" step="10" value={guests} onChange={e => setGuests(Number(e.target.value))} /><div className="range-labels"><span>50</span><span>200</span></div></label><label>Total budget <strong>₹{simBudget.toLocaleString('en-IN')}</strong><input type="range" min="30000" max="80000" step="5000" value={simBudget} onChange={e => setSimBudget(Number(e.target.value))} /><div className="range-labels"><span>₹30k</span><span>₹80k</span></div></label><div className="toggle-row"><div><strong>Outdoor event</strong><small>See weather-related changes</small></div><button className="toggle" onClick={e => e.currentTarget.classList.toggle('on')}><i /></button></div><div className="toggle-row"><div><strong>Prioritize food quality</strong><small>Protect catering in trade-offs</small></div><button className="toggle on"><i /></button></div></section><section className="panel scenario-result"><div className="result-label"><Sparkles size={15} /> COMPARED TO YOUR SAVED PLAN</div><h3>{guests === 100 && simBudget === 50000 ? 'Your plan is nicely balanced.' : 'Here’s what would change.'}</h3><div className="impact-number">{savings >= 0 ? '+' : ''}{formatCurrency(savings)} <small>{savings >= 0 ? 'room in budget' : 'over current budget'}</small></div><div className="impact-list"><div><span className="impact-icon coral"><IndianRupee size={16} /></span><div><strong>Catering</strong><small>{guests === 100 ? 'No change' : `${formatCurrency(Math.abs(difference))} ${difference > 0 ? 'increase' : 'decrease'} for ${guests} guests`}</small></div><b className={difference > 0 ? 'negative' : 'positive'}>{difference > 0 ? '+' : ''}{formatCurrency(difference)}</b></div><div><span className="impact-icon purple"><ClipboardCheck size={16} /></span><div><strong>Tasks affected</strong><small>{guests === 100 ? 'Your timeline stays the same' : 'Confirm final guest count earlier'}</small></div><b>1 task</b></div><div><span className="impact-icon yellow"><Leaf size={16} /></span><div><strong>Recommendation</strong><small>{savings >= 0 ? 'Use the buffer for return gifts or a dessert upgrade.' : 'Trim decor before touching food quality.'}</small></div></div></div><button className="primary-btn full">Apply this scenario to my plan <ArrowRight size={16} /></button></section></div></> }

export default App
