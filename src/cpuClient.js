const DEFAULT_CPU_API = 'https://games-cpu.theburnsasylum.co.uk'

export function cpuApiBase() {
  return (import.meta.env.VITE_CPU_API_URL || DEFAULT_CPU_API).replace(/\/$/, '')
}

export async function requestCpuMove(payload, { signal } = {}) {
  const res = await fetch(`${cpuApiBase()}/v1/cpu-move`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || `CPU API ${res.status}`)
  }
  return data
}

function sessionKey(game) {
  return `arcade-session-${game}`
}

export function ensureSessionId(game) {
  try {
    const key = sessionKey(game)
    let id = sessionStorage.getItem(key)
    if (!id) {
      id = (crypto.randomUUID && crypto.randomUUID()) || `s-${Date.now()}-${Math.random().toString(16).slice(2)}`
      sessionStorage.setItem(key, id)
    }
    return id
  } catch {
    return `s-${Date.now()}`
  }
}

export function reportMatchEvent(payload) {
  // Use fetch (not sendBeacon): cross-origin sendBeacon with application/json
  // often returns true but is dropped by CORS, so match counters never move.
  const body = JSON.stringify({
    ...payload,
    session_id: payload.session_id || ensureSessionId(payload.game),
  })
  return fetch(`${cpuApiBase()}/v1/match-event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
    mode: 'cors',
  }).catch(() => {})
}

export async function fetchLeaderboard(game, limit = 10) {
  const res = await fetch(`${cpuApiBase()}/v1/leaderboard?game=${encodeURIComponent(game)}&limit=${limit}`, {
    method: 'GET',
    mode: 'cors',
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || `Leaderboard ${res.status}`)
  }
  return data
}

export async function submitLeaderboardScore({ game, name, score }) {
  const res = await fetch(`${cpuApiBase()}/v1/leaderboard`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ game, name, score }),
    mode: 'cors',
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || `Leaderboard ${res.status}`)
  }
  return data
}
