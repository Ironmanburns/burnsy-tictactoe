import { useState, useMemo, useCallback } from 'react'

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

  const result = useMemo(() => calculateWinner(board), [board])
  const winner = result?.player
  const winningLine = result?.line ?? []
  const status = useMemo(
    () =>
      winner
        ? `Winner: ${winner}`
        : board.every(Boolean)
          ? 'Draw'
          : `Next player: ${xIsNext ? 'X' : 'O'}`,
    [winner, board, xIsNext]
  )

  const handleClick = useCallback(
    (index) => {
      if (board[index] || winner) return
      const nextBoard = board.slice()
      nextBoard[index] = xIsNext ? 'X' : 'O'
      setBoard(nextBoard)
      setXIsNext(!xIsNext)
    },
    [board, winner, xIsNext]
  )

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
  }, [])

  return (
    <div className="app-shell">
      <div className="title-bar">
        <h1>JB Tic Tac Toe</h1>
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
            disabled={!!winner || !!board[index]}
            aria-label={`Square ${index + 1}${board[index] ? ': ' + board[index] : ''}`}
            aria-pressed={!!board[index]}
          >
            {value}
          </button>
        ))}
      </div>
      <p className="instructions">Click a square to play. First player is X.</p>
    </div>
  )
}

export { calculateWinner }
export default App
