import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Download, RefreshCw, Settings2 } from 'lucide-react'

import NavBar              from '../components/NavBar'
import AccountBar          from '../components/AccountBar'
import SignalBadge         from '../components/SignalBadge'
import PositionCard        from '../components/PositionCard'
import ControlButtons      from '../components/ControlButtons'
import TradeTable          from '../components/TradeTable'
import SignalTable         from '../components/SignalTable'
import SessionHistoryTable from '../components/SessionHistoryTable'

import {
  getStatus, getPositions, getSignals,
  getTrades, getSignalLog, getSessions,
  exitSlot, downloadCSV,
} from '../api/traderApi'

const POLL = 15_000   // 15 seconds

export default function Dashboard() {
  const { getToken }   = useAuth()
  const navigate       = useNavigate()
  const queryClient    = useQueryClient()
  const [tab, setTab]  = useState('signals')

  // ── Polled queries ───────────────────────────────────
  const { data: status } = useQuery({
    queryKey:        ['status'],
    queryFn:         () => getStatus(getToken),
    refetchInterval: POLL,
  })

  const { data: positions } = useQuery({
    queryKey:        ['positions'],
    queryFn:         () => getPositions(getToken),
    refetchInterval: POLL,
  })

  const { data: signals } = useQuery({
    queryKey:        ['signals'],
    queryFn:         () => getSignals(getToken),
    refetchInterval: POLL,
  })

  const { data: tradesData } = useQuery({
    queryKey:        ['trades'],
    queryFn:         () => getTrades(getToken),
    refetchInterval: POLL * 3,
  })

  const { data: signalLogData } = useQuery({
    queryKey:        ['signalLog'],
    queryFn:         () => getSignalLog(getToken),
    refetchInterval: POLL * 3,
  })

  const { data: sessionsData } = useQuery({
    queryKey:        ['sessions'],
    queryFn:         () => getSessions(getToken),
    refetchInterval: POLL * 6,
  })

  // ── Handlers ─────────────────────────────────────────
  function refresh() {
    queryClient.invalidateQueries()
    toast.success('Refreshed')
  }

  async function handleExitSlot(slot) {
    try {
      await exitSlot(getToken, slot)
      toast.success(`Exit queued for slot ${slot}`)
      queryClient.invalidateQueries({ queryKey: ['positions'] })
    } catch (e) {
      toast.error(e.message)
    }
  }

  async function handleDownload(type) {
    try {
      await downloadCSV(type, getToken)
    } catch (e) {
      toast.error(e.message)
    }
  }

  const lastPrice = signals?.last_price
  const trades    = tradesData?.trades    ?? []
  const sigLogs   = signalLogData?.signals ?? []
  const sessions  = sessionsData           ?? []

  const TABS = [
    { id: 'signals',  label: 'Signal Log',      count: sigLogs.length },
    { id: 'trades',   label: 'Trade Log',        count: trades.length  },
    { id: 'sessions', label: 'Session History',  count: sessions.length },
  ]

  return (
    <div className="min-h-screen bg-bg">
      <NavBar />

      <div className="pt-14 px-6 pb-10 max-w-[1400px] mx-auto space-y-4">

        {/* ── Top: account bar ───────────────────────── */}
        <div className="pt-6 animate-slide-up">
          <AccountBar status={status} />
        </div>

        {/* ── Signal bar + controls row ───────────────── */}
        <div className="flex items-stretch gap-4 flex-wrap animate-fade-in" style={{ animationDelay: '0.05s' }}>
          <div className="flex-1 min-w-[280px]">
            <SignalBadge signals={signals} />
          </div>
          <div className="bg-surface border border-border rounded-lg px-5 py-4 flex items-center gap-3 flex-wrap">
            <ControlButtons status={status} onAction={refresh} />
          </div>
        </div>

        {/* ── Positions row ───────────────────────────── */}
        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="font-mono text-[9px] text-dim tracking-[0.2em]">OPEN POSITIONS</p>
            <span className="font-mono text-[9px] text-dim">
              {status?.num_open ?? 0} / 2 SLOTS OCCUPIED
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PositionCard
              slot={0}
              position={positions?.slot0}
              lastPrice={lastPrice}
              onExit={handleExitSlot}
              disabled={!status?.loop_running}
            />
            <PositionCard
              slot={1}
              position={positions?.slot1}
              lastPrice={lastPrice}
              onExit={handleExitSlot}
              disabled={!status?.loop_running}
            />
          </div>
        </div>

        {/* ── Log tabs ────────────────────────────────── */}
        <div className="bg-surface border border-border rounded-lg animate-fade-in" style={{ animationDelay: '0.15s' }}>
          {/* Tab header */}
          <div className="flex items-center justify-between border-b border-border px-5 py-0">
            <div className="flex items-center">
              {TABS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-4 py-3.5 font-mono text-xs tracking-wider border-b-2 transition-all flex items-center gap-2 ${
                    tab === t.id
                      ? 'border-accent text-accent'
                      : 'border-transparent text-dim hover:text-text'
                  }`}
                >
                  {t.label.toUpperCase()}
                  <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                    tab === t.id ? 'bg-accentDim text-accent' : 'bg-muted text-dim'
                  }`}>
                    {t.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={refresh}
                className="p-1.5 rounded hover:bg-border/50 text-dim hover:text-text transition-all"
                title="Refresh"
              >
                <RefreshCw size={13} />
              </button>

              {tab === 'trades' && (
                <button
                  onClick={() => handleDownload('trades')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-accentDim hover:bg-accent/20 text-accent border border-accent/20 font-mono text-[10px] tracking-wider transition-all"
                >
                  <Download size={11} /> TRADE CSV
                </button>
              )}
              {tab === 'signals' && (
                <button
                  onClick={() => handleDownload('signals')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-accentDim hover:bg-accent/20 text-accent border border-accent/20 font-mono text-[10px] tracking-wider transition-all"
                >
                  <Download size={11} /> SIGNAL CSV
                </button>
              )}
            </div>
          </div>

          {/* Tab content */}
          <div className="p-5 overflow-x-auto">
            {tab === 'signals'  && <SignalTable         signals={sigLogs}  />}
            {tab === 'trades'   && <TradeTable          trades={trades}    />}
            {tab === 'sessions' && <SessionHistoryTable sessions={sessions} />}
          </div>
        </div>

        {/* ── Configure shortcut ──────────────────────── */}
        {!status?.loop_running && (
          <div className="flex items-center justify-center py-4 animate-fade-in">
            <button
              onClick={() => navigate('/configure')}
              className="flex items-center gap-2 px-5 py-2.5 rounded bg-accentDim hover:bg-accent/20 text-accent border border-accent/20 font-mono text-xs tracking-wider transition-all shadow-glow"
            >
              <Settings2 size={13} /> GO TO CONFIGURE TO START A SESSION
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
