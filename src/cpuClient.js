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
  const body = JSON.stringify({
    ...payload,
    session_id: payload.session_id || ensureSessionId(payload.game),
  })
  const url = `${cpuApiBase()}/v1/match-event`
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' })
      if (navigator.sendBeacon(url, blob)) return Promise.resolve()
    }
  } catch {
    // fall through to fetch
  }
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {})
}
