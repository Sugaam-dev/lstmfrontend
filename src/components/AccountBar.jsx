import { Wifi, WifiOff, PauseCircle } from 'lucide-react'

function Metric({ label, value, color }) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="font-mono text-[9px] text-dim tracking-[0.15em] truncate">{label}</span>
      <span className={`font-mono text-xs md:text-sm font-semibold truncate ${color ?? 'text-text'}`}>{value}</span>
    </div>
  )
}

function fmt(n) {
  if (n == null) return '—'
  return `₹${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default function AccountBar({ status }) {
  if (!status) return null
  const { cash, blocked_margin, equity, daily_pnl, loop_running, loop_paused, last_heartbeat } = status
  const pnlPositive = daily_pnl >= 0

  let statusLabel, StatusIcon, statusColor
  if (!loop_running)    { statusLabel = 'STOPPED'; StatusIcon = WifiOff;     statusColor = 'text-dim' }
  else if (loop_paused) { statusLabel = 'PAUSED';  StatusIcon = PauseCircle; statusColor = 'text-warn' }
  else                  { statusLabel = 'LIVE';    StatusIcon = Wifi;        statusColor = 'text-bull' }

  const heartbeat = last_heartbeat
    ? new Date(last_heartbeat).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '—'

  return (
    <div className="bg-surface border border-border rounded-lg px-4 md:px-6 py-3 md:py-4">
      {/* Top row: status + heartbeat */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StatusIcon size={14} className={statusColor} />
          <span className={`font-mono text-xs font-semibold tracking-widest ${statusColor}`}>{statusLabel}</span>
          {loop_running && <span className="w-1.5 h-1.5 rounded-full bg-bull animate-pulse-slow" />}
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="font-mono text-[9px] text-dim tracking-[0.15em]">LAST UPDATE</span>
          <span className="font-mono text-[10px] text-dim">{heartbeat}</span>
        </div>
      </div>

      {/* Metrics grid — 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
        <Metric label="CASH"           value={fmt(cash)} />
        <Metric label="BLOCKED MARGIN" value={fmt(blocked_margin)} />
        <Metric label="EQUITY"         value={fmt(equity)} />
        <Metric
          label="DAILY P&L"
          value={`${pnlPositive ? '+' : ''}${fmt(daily_pnl)}`}
          color={pnlPositive ? 'text-bull' : 'text-bear'}
        />
      </div>
    </div>
  )
}