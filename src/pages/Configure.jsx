import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Save, Play, RotateCcw, ChevronRight, ChevronDown, Loader2 } from 'lucide-react'
import NavBar from '../components/NavBar'
import ConfigField from '../components/ConfigField'
import { getConfig, updateConfig, resetConfig, startSession } from '../api/traderApi'

const SECTIONS = [
  {
    id: 'capital',
    title: 'Capital & Sizing',
    description: 'Controls how much capital is deployed and leverage applied.',
    fields: [
      { name: 'initial_capital',       label: 'INITIAL CAPITAL',          type: 'number', prefix: '₹', min: 1000,  step: 1000,  description: 'Starting cash for this trading session.' },
      { name: 'leverage',              label: 'LEVERAGE',                 type: 'number', min: 1, max: 20, step: 1, description: 'Intraday leverage multiplier (e.g. 5 = 5x buying power).' },
      { name: 'max_capital_per_pos',   label: 'MAX CAPITAL PER POSITION', type: 'number', min: 0.01, max: 1, step: 0.01, description: 'Fraction of equity allowed per slot (0.5 = 50%).' },
    ],
  },
  {
    id: 'signals',
    title: 'Signal Thresholds',
    description: 'Model confidence levels that trigger entries and exits.',
    fields: [
      { name: 'long_entry_threshold',  label: 'LONG ENTRY THRESHOLD',     type: 'number', min: 0, max: 1, step: 0.001, description: 'Min buy_conf required to enter a long position.' },
      { name: 'short_entry_threshold', label: 'SHORT ENTRY THRESHOLD',    type: 'number', min: 0, max: 1, step: 0.001, description: 'Min sell_conf required to enter a short position.' },
      { name: 'exit_threshold',        label: 'EXIT THRESHOLD',           type: 'number', min: 0, max: 1, step: 0.001, description: 'Confidence below this for 4 consecutive candles triggers weak-signal exit.' },
    ],
  },
  {
    id: 'risk',
    title: 'Risk Parameters',
    description: 'Hard stop levels that protect capital on each position.',
    fields: [
      { name: 'stop_loss_pct',         label: 'STOP LOSS %',              type: 'number', min: 0, max: 0.5, step: 0.0001, description: 'Max loss per position before auto-exit (0.006 = 0.6%).' },
      { name: 'target_pct',            label: 'TARGET %',                 type: 'number', min: 0, max: 1,   step: 0.0001, description: 'Profit target per position before auto-exit (0.02 = 2%).' },
      { name: 'trailing_stop_pct',     label: 'TRAILING STOP %',          type: 'number', min: 0, max: 0.5, step: 0.0001, description: 'Trail below peak price to lock in profits.' },
    ],
  },
  {
    id: 'behaviour',
    title: 'Behaviour',
    description: 'Flags that change how the loop handles conflicting signals.',
    fields: [
      { name: 'reverse_exit_enabled',  label: 'REVERSE EXIT ENABLED',     type: 'toggle', description: 'When ON, entering a LONG will auto-exit any open SHORT (and vice versa).' },
    ],
  },
]

export default function Configure() {
  const navigate     = useNavigate()
  const { getToken } = useAuth()
  const [form, setForm]           = useState(null)
  const [saving, setSaving]       = useState(false)
  const [starting, setStarting]   = useState(false)
  const [activeSection, setActiveSection] = useState('capital')
  const [mobileOpen, setMobileOpen] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey:  ['config'],
    queryFn:   () => getConfig(getToken),
    staleTime: 60_000,
  })

  useEffect(() => { if (data) setForm(data) }, [data])

  function handleChange(name, value) {
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      await updateConfig(getToken, form)
      toast.success('Config saved successfully')
      setTimeout(() => navigate('/dashboard'), 800)
    } catch (e) { toast.error(e.message) }
    finally { setSaving(false) }
  }

  async function handleReset() {
    try {
      const defaults = await resetConfig(getToken)
      setForm(defaults)
      toast.success('Config reset to defaults')
    } catch (e) { toast.error(e.message) }
  }

  async function handleStart() {
    setStarting(true)
    try {
      await updateConfig(getToken, form)
      await startSession(getToken, {})
      toast.success('Trading session started!')
      navigate('/dashboard')
    } catch (e) { toast.error(e.message) }
    finally { setStarting(false) }
  }

  if (isLoading || !form) {
    return (
      <div className="fixed inset-0 bg-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={24} className="text-accent animate-spin" />
          <span className="font-mono text-xs text-dim tracking-widest">LOADING CONFIG</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-bg flex items-center justify-center px-4">
        <div className="font-mono text-xs text-bear text-center">
          <p>Failed to load config</p>
          <p className="text-dim mt-1">{error.message}</p>
        </div>
      </div>
    )
  }

  const currentSection = SECTIONS.find(s => s.id === activeSection)

  return (
    <div className="min-h-screen bg-bg">
      <NavBar />

      <div className="pt-14 flex flex-col md:flex-row min-h-screen">

        {/* ── Mobile section selector (dropdown) ───────── */}
        <div className="md:hidden border-b border-border px-4 py-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-surface border border-border rounded font-mono text-xs text-accent tracking-wider"
          >
            <span>{currentSection.title.toUpperCase()}</span>
            <ChevronDown size={14} className={`transition-transform ${mobileOpen ? 'rotate-180' : ''}`} />
          </button>
          {mobileOpen && (
            <div className="mt-1 bg-surface border border-border rounded overflow-hidden">
              {SECTIONS.map(s => (
                <button
                  key={s.id}
                  onClick={() => { setActiveSection(s.id); setMobileOpen(false) }}
                  className={`w-full text-left px-4 py-3 font-mono text-xs tracking-wider border-b border-border/30 last:border-0 transition-all ${
                    activeSection === s.id ? 'text-accent bg-accentDim' : 'text-dim hover:text-text'
                  }`}
                >
                  {s.title.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Desktop sidebar ───────────────────────────── */}
        <aside className="hidden md:flex w-64 shrink-0 border-r border-border h-full overflow-y-auto pt-8 pb-8 px-4 flex-col gap-1">
          <p className="font-mono text-[9px] text-dim tracking-[0.2em] px-3 mb-3">SECTIONS</p>
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded transition-all group ${
                activeSection === s.id
                  ? 'bg-accentDim text-accent border border-accent/20'
                  : 'text-dim hover:text-text hover:bg-border/40'
              }`}
            >
              <span className="font-mono text-xs tracking-wider">{s.title.toUpperCase()}</span>
              <ChevronRight size={12} className={`transition-transform ${activeSection === s.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
            </button>
          ))}
          <div className="mt-auto pt-6">
            <button
              onClick={handleReset}
              className="w-full flex items-center gap-2 px-3 py-2 rounded font-mono text-xs text-dim hover:text-text hover:bg-border/40 transition-all tracking-wider"
            >
              <RotateCcw size={11} /> RESET DEFAULTS
            </button>
          </div>
        </aside>

        {/* ── Main content ──────────────────────────────── */}
        <main className="flex-1 overflow-y-auto pt-4 md:pt-8 pb-32 px-4 md:px-10 animate-slide-up">

          {/* Mobile reset button */}
          <div className="md:hidden flex justify-end mb-4">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-xs text-dim hover:text-text hover:bg-border/40 transition-all tracking-wider"
            >
              <RotateCcw size={11} /> RESET
            </button>
          </div>

          {/* Section header */}
          <div className="mb-6 md:mb-8">
            <p className="font-mono text-[9px] text-accent tracking-[0.25em] mb-1">
              CONFIGURATION → {currentSection.title.toUpperCase()}
            </p>
            <h2 className="font-display text-xl md:text-2xl font-700 text-text">{currentSection.title}</h2>
            <p className="font-body text-sm text-dim mt-1">{currentSection.description}</p>
          </div>

          {/* Fields */}
          <div className="bg-surface border border-border rounded-lg px-4 md:px-6">
            {currentSection.fields.map(field => (
              <ConfigField
                key={field.name}
                {...field}
                value={form[field.name] ?? ''}
                onChange={handleChange}
              />
            ))}
          </div>

          {/* All values preview */}
          <div className="mt-6 md:mt-8 bg-surface border border-border rounded-lg p-4 md:p-5">
            <p className="font-mono text-[9px] text-dim tracking-[0.2em] mb-4">ALL CURRENT VALUES</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
              {Object.entries(form)
                .filter(([k]) => !['id','clerk_user_id','created_at','updated_at'].includes(k))
                .map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between py-1.5 border-b border-border/30">
                    <span className="font-mono text-[10px] text-dim truncate mr-2">{k}</span>
                    <span className="font-mono text-[10px] text-text shrink-0">
                      {typeof v === 'boolean' ? (v ? 'TRUE' : 'FALSE') : String(v)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </main>
      </div>

      {/* ── Sticky bottom action bar ──────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur border-t border-border px-4 md:px-8 py-3 md:py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 z-40">
        <p className="font-mono text-[10px] text-dim hidden sm:block">
          Changes are saved to your account and prefilled next time you log in.
        </p>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleSave}
            disabled={saving || starting}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-muted hover:bg-border text-text border border-border font-mono text-xs tracking-wider transition-all disabled:opacity-40"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            SAVE
          </button>
          <button
            onClick={handleStart}
            disabled={saving || starting}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-accent hover:bg-accent/80 text-bg font-mono text-xs font-semibold tracking-wider transition-all shadow-glow disabled:opacity-40"
          >
            {starting ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} />}
            START TRADING
          </button>
        </div>
      </div>
    </div>
  )
}