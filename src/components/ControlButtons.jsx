import { useState } from 'react'
import { StopCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@clerk/clerk-react'
import { stopSession } from '../api/traderApi'

export default function ControlButtons({ status, onAction }) {
  const { getToken } = useAuth()
  const [loading, setLoading] = useState(null)
  const isRunning = status?.loop_running

  async function handle(action, fn, label) {
    setLoading(action)
    try {
      await fn(getToken)
      toast.success(`${label} command sent`)
      onAction?.()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(null)
    }
  }

  const btnBase = 'flex items-center gap-2 px-4 py-2 rounded font-mono text-xs tracking-wider transition-all disabled:opacity-40'

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {isRunning && (
        <button
          className={`${btnBase} bg-bear/10 text-bear border border-bear/20 hover:bg-bear/20`}
          disabled={!!loading}
          onClick={() => handle('stop', stopSession, 'Stop Session')}
        >
          {loading === 'stop'
            ? <span className="w-3 h-3 border border-bear border-t-transparent rounded-full animate-spin" />
            : <StopCircle size={12} />}
          STOP SESSION
        </button>
      )}
      {!isRunning && (
        <span className="font-mono text-xs text-dim tracking-wider px-2">
          No active session — go to Configure to start one.
        </span>
      )}
    </div>
  )
}