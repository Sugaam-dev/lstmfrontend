export default function SessionHistoryTable({ sessions }) {
  if (!sessions?.length) {
    return (
      <div className="flex items-center justify-center py-16 text-dim font-mono text-xs tracking-widest">
        NO SESSIONS RECORDED YET
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs font-mono">
        <thead>
          <tr className="border-b border-border">
            {['DATE', 'START CAPITAL', 'END CAPITAL', 'P&L', 'RETURN %', 'TRADES', 'STATUS'].map(h => (
              <th key={h} className="text-left text-[9px] text-dim tracking-[0.15em] pb-2 pr-4 font-normal">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sessions.map((s, i) => {
            const pnl  = s.daily_pnl
            const ret  = s.daily_return_pct
            const statusStyle =
              s.status === 'completed' ? 'text-bull bg-bull/10 border-bull/20' :
              s.status === 'running'   ? 'text-warn bg-warn/10 border-warn/20' :
              'text-dim bg-muted/30 border-border'
            return (
              <tr key={i} className="border-b border-border/30 hover:bg-surface/50 transition-colors">
                <td className="py-2.5 pr-4 text-text">{s.date}</td>
                <td className="py-2.5 pr-4 text-dim">₹{Number(s.starting_capital).toLocaleString('en-IN')}</td>
                <td className="py-2.5 pr-4 text-dim">
                  {s.ending_capital != null ? `₹${Number(s.ending_capital).toLocaleString('en-IN')}` : '—'}
                </td>
                <td className={`py-2.5 pr-4 font-semibold ${
                  pnl == null ? 'text-dim' : pnl >= 0 ? 'text-bull' : 'text-bear'
                }`}>
                  {pnl != null ? `${pnl >= 0 ? '+' : ''}₹${Number(pnl).toFixed(2)}` : '—'}
                </td>
                <td className={`py-2.5 pr-4 font-semibold ${
                  ret == null ? 'text-dim' : ret >= 0 ? 'text-bull' : 'text-bear'
                }`}>
                  {ret != null ? `${ret >= 0 ? '+' : ''}${Number(ret).toFixed(2)}%` : '—'}
                </td>
                <td className="py-2.5 pr-4 text-dim">{s.total_trades ?? '—'}</td>
                <td className="py-2.5">
                  <span className={`px-2 py-0.5 rounded border text-[10px] tracking-wider uppercase ${statusStyle}`}>
                    {s.status}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
