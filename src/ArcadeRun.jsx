import { useEffect, useState } from 'react'
import { fetchLeaderboard, submitLeaderboardScore } from './cpuClient'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const START_LIVES = 3

export function createArcadeRun() {
  return {
    lives: START_LIVES,
    streak: 0,
    bestStreak: 0,
    gameOver: false,
  }
}

/** Apply a finished CPU-match result to arcade-run state. */
export function applyCpuRound(run, result) {
  if (run.gameOver) return run
  if (result === 'player1' || result === 'x') {
    const streak = run.streak + 1
    return {
      ...run,
      streak,
      bestStreak: Math.max(run.bestStreak, streak),
    }
  }
  if (result === 'cpu') {
    const lives = run.lives - 1
    return {
      ...run,
      lives,
      streak: 0,
      gameOver: lives <= 0,
    }
  }
  // draws break the streak but do not cost a life
  return { ...run, streak: 0 }
}

function nudgeChar(ch, dir) {
  const idx = LETTERS.indexOf(ch)
  const i = idx < 0 ? 0 : idx
  const next = (i + dir + LETTERS.length) % LETTERS.length
  return LETTERS[next]
}

export function ArcadeHud({ run }) {
  if (!run) return null
  return (
    <div className="arcade-hud" aria-live="polite">
      <span className="arcade-lives">
        LIVES{' '}
        {Array.from({ length: START_LIVES }, (_, i) => (
          <span key={i} className={i < run.lives ? 'life on' : 'life off'}>
            ♥
          </span>
        ))}
      </span>
      <span className="arcade-streak">STREAK {run.streak}</span>
      <span className="arcade-best">BEST {run.bestStreak}</span>
    </div>
  )
}

export function LeaderboardPanel({ game, refreshKey = 0 }) {
  const [entries, setEntries] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    fetchLeaderboard(game)
      .then((data) => {
        if (!cancelled) {
          setEntries(Array.isArray(data.entries) ? data.entries : [])
          setError('')
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Leaderboard offline')
      })
    return () => {
      cancelled = true
    }
  }, [game, refreshKey])

  return (
    <div className="leaderboard">
      <div className="leaderboard-title">HI-SCORES</div>
      <div className="leaderboard-note">clears on CPU restart</div>
      {error ? (
        <div className="leaderboard-error">{error}</div>
      ) : entries.length === 0 ? (
        <div className="leaderboard-empty">NO SCORES YET</div>
      ) : (
        <ol className="leaderboard-list">
          {entries.map((e) => (
            <li key={`${e.rank}-${e.name}-${e.score}-${e.at}`}>
              <span className="lb-rank">{String(e.rank).padStart(2, '0')}</span>
              <span className="lb-name">{e.name}</span>
              <span className="lb-score">{e.score}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

export function NameEntry({ score, game, onDone }) {
  const [chars, setChars] = useState(['A', 'A', 'A'])
  const [active, setActive] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  function bump(slot, dir) {
    setChars((prev) => prev.map((c, i) => (i === slot ? nudgeChar(c, dir) : c)))
  }

  async function submit() {
    if (busy) return
    setBusy(true)
    setError('')
    try {
      const name = chars.join('')
      await submitLeaderboardScore({ game, name, score })
      onDone?.({ name, score })
    } catch (err) {
      setError(err.message || 'Submit failed')
      setBusy(false)
    }
  }

  return (
    <div className="name-entry" role="dialog" aria-label="Enter initials">
      <div className="name-entry-title">GAME OVER</div>
      <div className="name-entry-score">BEST STREAK {score}</div>
      <div className="name-entry-prompt">ENTER NAME</div>
      <div className="name-wheels">
        {chars.map((ch, i) => (
          <div key={i} className={`name-wheel${active === i ? ' active' : ''}`}>
            <button type="button" aria-label={`Letter ${i + 1} up`} onClick={() => { setActive(i); bump(i, 1) }}>
              ▲
            </button>
            <button type="button" className="name-char" onClick={() => setActive(i)}>
              {ch}
            </button>
            <button type="button" aria-label={`Letter ${i + 1} down`} onClick={() => { setActive(i); bump(i, -1) }}>
              ▼
            </button>
          </div>
        ))}
      </div>
      {error && <div className="name-entry-error">{error}</div>}
      <button type="button" className="name-submit" disabled={busy} onClick={submit}>
        {busy ? 'SAVING…' : 'SAVE SCORE'}
      </button>
    </div>
  )
}

export { START_LIVES }
