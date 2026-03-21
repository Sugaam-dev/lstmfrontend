import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'
import { Settings, LayoutDashboard, Activity, Menu, X } from 'lucide-react'

export default function NavBar() {
  const navigate     = useNavigate()
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const tabs = [
    { path: '/configure', label: 'Configure', Icon: Settings },
    { path: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-surface/80 backdrop-blur border-b border-border flex items-center px-4 md:px-6 justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Activity size={16} className="text-accent" />
        <span className="font-display font-700 text-text tracking-tight text-sm md:text-base">NeuralTrader</span>
        <span className="font-mono text-[9px] text-dim bg-muted px-1.5 py-0.5 rounded ml-1 hidden sm:inline">PAPER</span>
      </div>

      {/* Desktop tabs */}
      <div className="hidden md:flex items-center gap-1">
        {tabs.map(({ path, label, Icon }) => {
          const active = pathname === path
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded font-mono text-xs tracking-wider transition-all ${
                active ? 'bg-accentDim text-accent border border-accent/20' : 'text-dim hover:text-text hover:bg-border/50'
              }`}
            >
              <Icon size={13} />
              {label.toUpperCase()}
            </button>
          )
        })}
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <UserButton appearance={{ elements: { avatarBox: 'w-8 h-8 border border-border' } }} />
        <button className="md:hidden text-dim hover:text-text" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-14 left-0 right-0 bg-surface border-b border-border flex flex-col md:hidden z-50">
          {tabs.map(({ path, label, Icon }) => {
            const active = pathname === path
            return (
              <button
                key={path}
                onClick={() => { navigate(path); setMenuOpen(false) }}
                className={`flex items-center gap-3 px-6 py-4 font-mono text-xs tracking-wider border-b border-border/30 transition-all ${
                  active ? 'text-accent bg-accentDim' : 'text-dim hover:text-text'
                }`}
              >
                <Icon size={14} />
                {label.toUpperCase()}
              </button>
            )
          })}
        </div>
      )}
    </nav>
  )
}