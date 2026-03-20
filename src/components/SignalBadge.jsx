export default function SignalBadge({ signals }) {
  if (!signals) return null
  const { buy_conf, sell_conf, last_price, last_time, is_sideways } = signals

  const buy  = buy_conf  != null ? (buy_conf  * 100).toFixed(1) : null
  const sell = sell_conf != null ? (sell_conf * 100).toFixed(1) : null

  const time = last_time
    ? new Date(last_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    : '—'

  return (
    <div className="bg-surface border border-border rounded-lg px-5 py-4 flex items-center gap-6 flex-wrap">
      <div className="flex flex-col gap-0.5">
        <span className="font-mono text-[9px] text-dim tracking-[0.15em]">LAST PRICE</span>
        <span className="font-mono text-lg font-semibold text-text">
          {last_price != null ? `₹${Number(last_price).toFixed(2)}` : '—'}
        </span>
        <span className="font-mono text-[9px] text-dim">{time}</span>
      </div>

      <div className="w-px h-10 bg-border" />

      <div className="flex items-center gap-4">
        <ConfBar label="BUY CONF" value={buy} color="text-bull" barColor="bg-bull" />
        <ConfBar label="SELL CONF" value={sell} color="text-bear" barColor="bg-bear" />
      </div>

      {is_sideways && (
        <>
          <div className="w-px h-10 bg-border" />
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-warn/10 border border-warn/20 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-warn animate-pulse-slow" />
            <span className="font-mono text-[10px] text-warn tracking-widest">SIDEWAYS MARKET</span>
          </div>
        </>
      )}
    </div>
  )
}

function ConfBar({ label, value, color, barColor }) {
  const pct = value != null ? Math.min(100, parseFloat(value)) : 0
  return (
    <div className="flex flex-col gap-1.5 w-28">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] text-dim tracking-[0.12em]">{label}</span>
        <span className={`font-mono text-xs font-semibold ${color}`}>{value != null ? `${value}%` : '—'}</span>
      </div>
      <div className="h-1 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${pct}%`, opacity: 0.7 }}
        />
      </div>
    </div>
  )
}
