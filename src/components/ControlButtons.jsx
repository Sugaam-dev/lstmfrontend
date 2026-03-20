import { useState } from 'react'
import { Play, Pause, Square, AlertTriangle, StopCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@clerk/clerk-react'
import { pauseTrading, resumeTrading, stopSession, squareOffAll } from '../api/traderApi'

export default function ControlButtons({ status, onAction }) {
  const { getToken }  = useAuth()
  const [loading, setLoading] = useState(null)
  const isRunning  = status?.loop_running
  const isPaused   = status?.loop_paused

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
      {/* Pause / Resume */}
      {isRunning && !isPaused && (
        <button
          className={`${btnBase} bg-warn/10 text-warn border border-warn/20 hover:bg-warn/20`}
          disabled={!!loading}
          onClick={() => handle('pause', pauseTrading, 'Pause')}
        >
          {loading === 'pause'
            ? <span className="w-3 h-3 border border-warn border-t-transparent rounded-full animate-spin" />
            : <Pause size={12} />
          }
          PAUSE
        </button>
      )}
      {isRunning && isPaused && (
        <button
          className={`${btnBase} bg-bull/10 text-bull border border-bull/20 hover:bg-bull/20`}
          disabled={!!loading}
          onClick={() => handle('resume', resumeTrading, 'Resume')}
        >
          {loading === 'resume'
            ? <span className="w-3 h-3 border border-bull border-t-transparent rounded-full animate-spin" />
            : <Play size={12} />
          }
          RESUME
        </button>
      )}

      {/* Square off all */}
      {isRunning && (
        <button
          className={`${btnBase} bg-warn/10 text-warn border border-warn/20 hover:bg-warn/20`}
          disabled={!!loading}
          onClick={() => handle('squareoff', squareOffAll, 'Square Off All')}
        >
          {loading === 'squareoff'
            ? <span className="w-3 h-3 border border-warn border-t-transparent rounded-full animate-spin" />
            : <AlertTriangle size={12} />
          }
          SQUARE OFF ALL
        </button>
      )}

      {/* Stop session */}
      {isRunning && (
        <button
          className={`${btnBase} bg-bear/10 text-bear border border-bear/20 hover:bg-bear/20`}
          disabled={!!loading}
          onClick={() => handle('stop', stopSession, 'Stop Session')}
        >
          {loading === 'stop'
            ? <span className="w-3 h-3 border border-bear border-t-transparent rounded-full animate-spin" />
            : <StopCircle size={12} />
          }
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
