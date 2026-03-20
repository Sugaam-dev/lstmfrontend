import { TrendingUp, TrendingDown, X } from 'lucide-react'

export default function PositionCard({ slot, position, lastPrice, onExit, disabled }) {
  if (!position) {
    return (
      <div className="bg-surface border border-border rounded-lg p-5 flex flex-col items-center justify-center min-h-[160px] opacity-40">
        <div className="w-8 h-8 rounded-full border-2 border-dashed border-muted flex items-center justify-center mb-2">
          <span className="font-mono text-xs text-dim">{slot}</span>
        </div>
        <p className="font-mono text-xs text-dim tracking-widest">SLOT {slot} EMPTY</p>
      </div>
    )
  }

  const isLong    = position.side === 'long'
  const entry     = position.entry_price
  const current   = lastPrice ?? entry
  const qty       = position.shares
  const unrealised = isLong
    ? (current - entry) * qty
    : (entry - current) * qty
  const unrealisedPct = ((Math.abs(unrealised) / (entry * qty)) * 100 * (unrealised >= 0 ? 1 : -1)).toFixed(2)
  const isProfit  = unrealised >= 0

  const sl = isLong
    ? entry * (1 - (position.stop_loss_pct || 0.006))
    : entry * (1 + (position.stop_loss_pct || 0.006))
  const tgt = isLong
    ? entry * (1 + (position.target_pct || 0.02))
    : entry * (1 - (position.target_pct || 0.02))

  return (
    <div className={`bg-surface border rounded-lg p-5 relative overflow-hidden animate-fade-in ${
      isLong ? 'border-bull/30' : 'border-bear/30'
    }`}>
      {/* Glow strip */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${isLong ? 'bg-bull' : 'bg-bear'}`} />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded flex items-center justify-center ${isLong ? 'bg-bull/10' : 'bg-bear/10'}`}>
            {isLong
              ? <TrendingUp size={13} className="text-bull" />
              : <TrendingDown size={13} className="text-bear" />
            }
          </div>
          <span className={`font-mono text-xs font-semibold tracking-widest ${isLong ? 'text-bull' : 'text-bear'}`}>
            {isLong ? 'LONG' : 'SHORT'} · SLOT {slot}
          </span>
        </div>
        <button
          onClick={() => onExit(slot)}
          disabled={disabled}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-muted/50 hover:bg-bear/20 hover:text-bear border border-border hover:border-bear/30 font-mono text-xs text-dim transition-all disabled:opacity-40"
        >
          <X size={10} /> EXIT
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <Stat label="ENTRY" value={`₹${entry.toFixed(2)}`} />
        <Stat label="CURRENT" value={`₹${current.toFixed(2)}`} highlight />
        <Stat label="QUANTITY" value={qty} />
        <Stat
          label="UNREALISED"
          value={`${isProfit ? '+' : ''}₹${unrealised.toFixed(2)} (${unrealisedPct}%)`}
          color={isProfit ? 'text-bull' : 'text-bear'}
        />
        <Stat label="STOP LOSS" value={`₹${sl.toFixed(2)}`} color="text-bear/70" />
        <Stat label="TARGET" value={`₹${tgt.toFixed(2)}`} color="text-bull/70" />
      </div>

      {/* Sideways badge */}
      {position.sideways_detected_time && (
        <div className="mt-3 flex items-center gap-1.5 px-2 py-1 bg-warn/10 border border-warn/20 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-warn animate-pulse-slow" />
          <span className="font-mono text-[10px] text-warn tracking-wider">SIDEWAYS DETECTED</span>
        </div>
      )}
    </div>
  )
}

function Stat({ label, value, color, highlight }) {
  return (
    <div>
      <p className="font-mono text-[9px] text-dim tracking-[0.15em] mb-0.5">{label}</p>
      <p className={`font-mono text-xs font-semibold ${color ?? (highlight ? 'text-text' : 'text-text/70')}`}>
        {value}
      </p>
    </div>
  )
}
