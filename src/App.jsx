import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth, SignIn } from '@clerk/clerk-react'
import Configure from './pages/Configure'
import Dashboard from './pages/Dashboard'

function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth()
  if (!isLoaded) return <FullScreenLoader />
  if (!isSignedIn) return <Navigate to="/login" replace />
  return children
}

function FullScreenLoader() {
  return (
    <div className="fixed inset-0 bg-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-sm text-dim tracking-widest">INITIALISING</span>
      </div>
    </div>
  )
}

function LoginPage() {
  const { isSignedIn } = useAuth()
  if (isSignedIn) return <Navigate to="/configure" replace />
  return (
    <div className="fixed inset-0 bg-bg flex items-center justify-center">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(#00d4aa 1px, transparent 1px), linear-gradient(90deg, #00d4aa 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="text-center">
          <p className="font-mono text-accent text-xs tracking-[0.3em] mb-2">PAPER TRADING TERMINAL</p>
          <h1 className="font-display text-4xl font-800 text-text">NeuralTrader</h1>
          <p className="font-body text-dim text-sm mt-2">LSTM-powered · Groww API · NSE Intraday</p>
        </div>
        <SignIn
          appearance={{
            variables: {
              colorPrimary: '#00d4aa',
              colorBackground: '#0f1621',
              colorText: '#c8d8e8',
              colorInputBackground: '#090d12',
              colorInputText: '#c8d8e8',
              borderRadius: '6px',
            },
            elements: {
              card: 'shadow-none border border-border',
              formButtonPrimary: 'bg-accent hover:bg-accent/80 text-bg font-mono text-sm font-semibold',
            }
          }}
        />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/configure" element={<ProtectedRoute><Configure /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/configure" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
