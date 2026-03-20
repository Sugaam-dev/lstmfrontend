import { useNavigate, useLocation } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'
import { Settings, LayoutDashboard, Activity } from 'lucide-react'

export default function NavBar() {
  const navigate  = useNavigate()
  const { pathname } = useLocation()

  const tabs = [
    { path: '/configure', label: 'Configure', Icon: Settings },
    { path: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-surface/80 backdrop-blur border-b border-border flex items-center px-6 justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Activity size={16} className="text-accent" />
        <span className="font-display font-700 text-text tracking-tight">NeuralTrader</span>
        <span className="font-mono text-[10px] text-dim bg-muted px-1.5 py-0.5 rounded ml-1">PAPER</span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1">
        {tabs.map(({ path, label, Icon }) => {
          const active = pathname === path
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded font-mono text-xs tracking-wider transition-all ${
                active
                  ? 'bg-accentDim text-accent border border-accent/20'
                  : 'text-dim hover:text-text hover:bg-border/50'
              }`}
            >
              <Icon size={13} />
              {label.toUpperCase()}
            </button>
          )
        })}
      </div>

      {/* User */}
      <UserButton
        appearance={{
          elements: {
            avatarBox: 'w-8 h-8 border border-border',
          }
        }}
      />
    </nav>
  )
}
