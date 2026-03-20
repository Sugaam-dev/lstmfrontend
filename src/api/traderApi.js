/**
 * api/traderApi.js
 *
 * All backend API calls live here.
 * Every call injects the Clerk JWT via the `getToken` function
 * which is passed in from the component/hook level.
 */

const BASE = import.meta.env.VITE_API_BASE_URL || ''

async function request(method, path, { getToken, body } = {}) {
  const token = getToken ? await getToken() : null
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || 'Request failed')
  }

  return res.json()
}

// ── Config ────────────────────────────────────────────────
export const getConfig     = (getToken) => request('GET',  '/api/config',       { getToken })
export const updateConfig  = (getToken, body) => request('PUT', '/api/config',  { getToken, body })
export const resetConfig   = (getToken) => request('POST', '/api/config/reset', { getToken })

// ── Control ───────────────────────────────────────────────
export const startSession    = (getToken, body) => request('POST', '/api/control/start',          { getToken, body })
export const stopSession     = (getToken)       => request('POST', '/api/control/stop',           { getToken })
export const pauseTrading    = (getToken)       => request('POST', '/api/control/pause',          { getToken })
export const resumeTrading   = (getToken)       => request('POST', '/api/control/resume',         { getToken })
export const squareOffAll    = (getToken)       => request('POST', '/api/control/square-off-all', { getToken })
export const exitSlot        = (getToken, slot) => request('POST', '/api/control/exit-slot',      { getToken, body: { slot } })
export const getLoopState    = (getToken)       => request('GET',  '/api/control/state',          { getToken })

// ── Status ────────────────────────────────────────────────
export const getStatus    = (getToken) => request('GET', '/api/status',    { getToken })
export const getPositions = (getToken) => request('GET', '/api/positions', { getToken })
export const getSignals   = (getToken) => request('GET', '/api/signals',   { getToken })
export const getSessions  = (getToken) => request('GET', '/api/sessions',  { getToken })

// ── Logs ──────────────────────────────────────────────────
export const getTrades    = (getToken) => request('GET', '/api/trades',      { getToken })
export const getSignalLog = (getToken) => request('GET', '/api/signals/log', { getToken })

// ── Downloads (direct window navigation) ─────────────────
export async function downloadCSV(type, getToken) {
  const token = await getToken()
  const res = await fetch(`${BASE}/api/download/${type}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Download failed')
  const blob = await res.blob()
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `${type}_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
