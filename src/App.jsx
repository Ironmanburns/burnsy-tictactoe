import { useState, useMemo, useCallback, useEffect } from 'react'
import { requestCpuMove } from './cpuClient'

const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

const CPU_PLAYER = 'O'

function calculateWinner(board) {
  for (const line of lines) {
    const [a, b, c] = line
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { player: board[a], line }
    }
  }
  return null
}

function App() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)
  const [vsCpu, setVsCpu] = useState(false)
  const [cpuThinking, setCpuThinking] = useState(false)
  const [cpuStatus, setCpuStatus] = useState('')

  const result = useMemo(() => calculateWinner(board), [board])
  const winner = result?.player
  const winningLine = result?.line ?? []
  const draw = !winner && board.every(Boolean)
  const status = useMemo(() => {
    if (winner) {
      if (vsCpu && winner === CPU_PLAYER) return 'Winner: CPU'
      return `Winner: ${winner}`
    }
    if (draw) return 'Draw'
    if (vsCpu && !xIsNext) return cpuThinking ? 'CPU thinking…' : "CPU's turn"
    return `Next player: ${xIsNext ? 'X' : 'O'}`
  }, [winner, draw, xIsNext, vsCpu, cpuThinking])

  const handleClick = useCallback(
    (index) => {
      if (board[index] || winner || cpuThinking) return
      if (vsCpu && !xIsNext) return
      const nextBoard = board.slice()
      nextBoard[index] = xIsNext ? 'X' : 'O'
      setBoard(nextBoard)
      setXIsNext(!xIsNext)
    },
    [board, winner, xIsNext, vsCpu, cpuThinking]
  )

  useEffect(() => {
    if (!vsCpu || winner || draw || xIsNext) return undefined

    const controller = new AbortController()
    setCpuThinking(true)
    setCpuStatus('CPU thinking…')

    const timer = setTimeout(async () => {
      try {
        const data = await requestCpuMove(
          { game: 'tictactoe', player: CPU_PLAYER, board },
          { signal: controller.signal },
        )
        const cell = data?.move?.cell
        if (typeof cell !== 'number' || board[cell]) {
          throw new Error('CPU returned an illegal cell')
        }
        setCpuStatus(`${data.source}${data.reason ? `: ${data.reason}` : ''}`)
        const nextBoard = board.slice()
        nextBoard[cell] = CPU_PLAYER
        setBoard(nextBoard)
        setXIsNext(true)
        setCpuThinking(false)
      } catch (err) {
        if (controller.signal.aborted) return
        setCpuStatus(err.message || 'CPU move failed')
        setCpuThinking(false)
      }
    }, 250)

    return () => {
      controller.abort()
      clearTimeout(timer)
    }
  }, [vsCpu, winner, draw, xIsNext, board])

  const handleKeyDown = useCallback(
    (e, index) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleClick(index)
      }
    },
    [handleClick]
  )

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null))
    setXIsNext(true)
    setCpuThinking(false)
    setCpuStatus('')
  }, [])

  const humanCanPlay = !winner && !draw && !cpuThinking && (!vsCpu || xIsNext)

  return (
    <div className="app-shell">
      <div className="title-bar">
        <h1>JB Tic Tac Toe</h1>
        <label className="cpu-toggle">
          <input
            type="checkbox"
            checked={vsCpu}
            onChange={(e) => {
              setVsCpu(e.target.checked)
              resetGame()
            }}
          />
          Play vs CPU
        </label>
        <button onClick={resetGame}>Reset</button>
      </div>
      <p className="status">{status}</p>
      <div className="board" role="presentation">
        {board.map((value, index) => (
          <button
            key={`square-${index}`}
            className={`square${winningLine.includes(index) ? ' square--winning' : ''}`}
            onClick={() => handleClick(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            disabled={!humanCanPlay || !!board[index]}
            aria-label={`Square ${index + 1}${board[index] ? ': ' + board[index] : ''}`}
            aria-pressed={!!board[index]}
          >
            {value}
          </button>
        ))}
      </div>
      <p className="instructions">
        {vsCpu
          ? 'You are X. CPU plays O via the shared games-cpu System One service.'
          : 'Click a square to play. First player is X.'}
      </p>
      {cpuStatus && <p className="cpu-status">{cpuStatus}</p>}
    </div>
  )
}

export { calculateWinner }
export default App
