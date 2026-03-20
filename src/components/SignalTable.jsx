export default function SignalTable({ signals }) {
  if (!signals?.length) {
    return (
      <div className="flex items-center justify-center py-16 text-dim font-mono text-xs tracking-widest">
        NO SIGNALS YET
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs font-mono">
        <thead>
          <tr className="border-b border-border">
            {['TIME', 'PRICE', 'BUY CONF', 'SELL CONF', 'SIGNAL', 'SIDEWAYS', 'POSITIONS', 'EQUITY'].map(h => (
              <th key={h} className="text-left text-[9px] text-dim tracking-[0.15em] pb-2 pr-4 font-normal">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...signals].reverse().map((s, i) => {
            const time = s.timestamp
              ? new Date(s.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
              : '—'
            const buyPct  = s.buy_conf  != null ? (s.buy_conf  * 100).toFixed(1) : '—'
            const sellPct = s.sell_conf != null ? (s.sell_conf * 100).toFixed(1) : '—'
            const signal  = s.buy_signal ? 'BUY' : s.sell_signal ? 'SELL' : 'NONE'

            return (
              <tr key={i} className="border-b border-border/30 hover:bg-surface/50 transition-colors">
                <td className="py-2.5 pr-4 text-dim">{time}</td>
                <td className="py-2.5 pr-4 text-text">₹{Number(s.price).toFixed(2)}</td>
                <td className={`py-2.5 pr-4 font-semibold ${s.buy_signal ? 'text-bull' : 'text-dim'}`}>{buyPct}%</td>
                <td className={`py-2.5 pr-4 font-semibold ${s.sell_signal ? 'text-bear' : 'text-dim'}`}>{sellPct}%</td>
                <td className="py-2.5 pr-4">
                  <span className={`px-2 py-0.5 rounded border text-[10px] tracking-wider ${
                    signal === 'BUY'  ? 'text-bull bg-bull/10 border-bull/20' :
                    signal === 'SELL' ? 'text-bear bg-bear/10 border-bear/20' :
                    'text-dim bg-muted/30 border-border'
                  }`}>
                    {signal}
                  </span>
                </td>
                <td className="py-2.5 pr-4">
                  {s.is_sideways
                    ? <span className="text-warn">YES</span>
                    : <span className="text-dim">—</span>
                  }
                </td>
                <td className="py-2.5 pr-4 text-dim">{s.open_positions ?? 0}</td>
                <td className="py-2.5 text-dim">
                  {s.equity != null ? `₹${Number(s.equity).toFixed(2)}` : '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
