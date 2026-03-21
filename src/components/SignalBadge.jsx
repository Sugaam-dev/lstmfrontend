export default function SignalBadge({ signals }) {
  if (!signals) return null
  const { buy_conf, sell_conf, last_price, last_time, is_sideways } = signals

  const buy  = buy_conf  != null ? (buy_conf  * 100).toFixed(1) : null
  const sell = sell_conf != null ? (sell_conf * 100).toFixed(1) : null

  const time = last_time
    ? new Date(last_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    : '—'

  return (
    <div className="bg-surface border border-border rounded-lg px-4 md:px-5 py-3 md:py-4">
      {/* Price row */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="font-mono text-[9px] text-dim tracking-[0.15em] block mb-0.5">LAST PRICE</span>
          <span className="font-mono text-base md:text-lg font-semibold text-text">
            {last_price != null ? `₹${Number(last_price).toFixed(2)}` : '—'}
          </span>
        </div>
        <span className="font-mono text-[10px] text-dim">{time}</span>
      </div>

      {/* Confidence bars — side by side always */}
      <div className="flex gap-4">
        <ConfBar label="BUY CONF"  value={buy}  color="text-bull" barColor="bg-bull" />
        <ConfBar label="SELL CONF" value={sell} color="text-bear" barColor="bg-bear" />
      </div>

      {/* Sideways badge */}
      {is_sideways && (
        <div className="mt-3 flex items-center gap-1.5 px-2 py-1 bg-warn/10 border border-warn/20 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-warn animate-pulse-slow" />
          <span className="font-mono text-[10px] text-warn tracking-widest">SIDEWAYS MARKET</span>
        </div>
      )}
    </div>
  )
}

function ConfBar({ label, value, color, barColor }) {
  const pct = value != null ? Math.min(100, parseFloat(value)) : 0
  return (
    <div className="flex-1 flex flex-col gap-1.5">
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