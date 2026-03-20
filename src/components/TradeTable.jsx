function badge(action) {
  if (action.includes('BUY_LONG'))   return 'text-bull bg-bull/10 border-bull/20'
  if (action.includes('SELL_SHORT')) return 'text-bear bg-bear/10 border-bear/20'
  return 'text-dim bg-muted/30 border-border'
}

export default function TradeTable({ trades }) {
  if (!trades?.length) {
    return (
      <div className="flex items-center justify-center py-16 text-dim font-mono text-xs tracking-widest">
        NO TRADES YET TODAY
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs font-mono">
        <thead>
          <tr className="border-b border-border">
            {['TIME', 'ACTION', 'PRICE', 'QTY', 'SLOT', 'CHARGES', 'P&L', 'EQUITY'].map(h => (
              <th key={h} className="text-left text-[9px] text-dim tracking-[0.15em] pb-2 pr-4 font-normal">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...trades].reverse().map((t, i) => {
            const time = t.timestamp
              ? new Date(t.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
              : '—'
            const charges = t.leg_charges?.total_leg ?? t.total_leg_charges
            const pnlVal  = t.pnl
            return (
              <tr key={i} className="border-b border-border/30 hover:bg-surface/50 transition-colors">
                <td className="py-2.5 pr-4 text-dim">{time}</td>
                <td className="py-2.5 pr-4">
                  <span className={`px-2 py-0.5 rounded border text-[10px] tracking-wider ${badge(t.action ?? '')}`}>
                    {(t.action ?? '').replace(/_slot\d/, '').replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="py-2.5 pr-4 text-text">₹{Number(t.price).toFixed(2)}</td>
                <td className="py-2.5 pr-4 text-text">{t.shares}</td>
                <td className="py-2.5 pr-4 text-dim">{t.slot ?? '—'}</td>
                <td className="py-2.5 pr-4 text-dim">
                  {charges != null ? `₹${Number(charges).toFixed(2)}` : '—'}
                </td>
                <td className={`py-2.5 pr-4 font-semibold ${
                  pnlVal == null ? 'text-dim' :
                  pnlVal >= 0    ? 'text-bull' : 'text-bear'
                }`}>
                  {pnlVal != null ? `${pnlVal >= 0 ? '+' : ''}₹${Number(pnlVal).toFixed(2)}` : '—'}
                </td>
                <td className="py-2.5 text-dim">
                  {t.equity != null ? `₹${Number(t.equity).toFixed(2)}` : '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
