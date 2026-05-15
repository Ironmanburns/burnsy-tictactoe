import { useState } from 'react'

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
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]
    }
  }
  return null
}

function App() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)

  const winner = calculateWinner(board)
  const status = winner
    ? `Winner: ${winner}`
    : board.every(Boolean)
    ? 'Draw'
    : `Next player: ${xIsNext ? 'X' : 'O'}`

  function handleClick(index) {
    if (board[index] || winner) return
    const nextBoard = board.slice()
    nextBoard[index] = xIsNext ? 'X' : 'O'
    setBoard(nextBoard)
    setXIsNext(!xIsNext)
  }

  function resetGame() {
    setBoard(Array(9).fill(null))
    setXIsNext(true)
  }

  return (
    <div className="app-shell">
      <div className="title-bar">
        <h1>JB Tic Tac Toe</h1>
        <button onClick={resetGame}>Reset</button>
      </div>
      <p className="status">{status}</p>
      <div className="board">
        {board.map((value, index) => (
          <button key={index} className="square" onClick={() => handleClick(index)}>
            {value}
          </button>
        ))}
      </div>
      <p className="instructions">Click a square to play. First player is X.</p>
    </div>
  )
}

export default App
