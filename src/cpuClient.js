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
