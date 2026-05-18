import { describe, it, expect, afterEach } from 'vitest'
import { render, fireEvent, cleanup, within } from '@testing-library/react'
import App, { calculateWinner } from './App'

afterEach(() => cleanup())

describe('calculateWinner', () => {
  it('returns null for an empty board', () => {
    expect(calculateWinner(Array(9).fill(null))).toBeNull()
  })

  it('detects a horizontal X win', () => {
    const board = ['X', 'X', 'X', null, null, null, null, null, null]
    expect(calculateWinner(board)).toEqual({ player: 'X', line: [0, 1, 2] })
  })

  it('detects a horizontal O win in middle row', () => {
    const board = [null, null, null, 'O', 'O', 'O', null, null, null]
    expect(calculateWinner(board)).toEqual({ player: 'O', line: [3, 4, 5] })
  })

  it('detects a vertical X win', () => {
    const board = ['X', null, null, 'X', null, null, 'X', null, null]
    expect(calculateWinner(board)).toEqual({ player: 'X', line: [0, 3, 6] })
  })

  it('detects a vertical O win in middle column', () => {
    const board = [null, 'O', null, null, 'O', null, null, 'O', null]
    expect(calculateWinner(board)).toEqual({ player: 'O', line: [1, 4, 7] })
  })

  it('detects a diagonal O win (top-left to bottom-right)', () => {
    const board = ['O', null, null, null, 'O', null, null, null, 'O']
    expect(calculateWinner(board)).toEqual({ player: 'O', line: [0, 4, 8] })
  })

  it('detects a diagonal X win (top-right to bottom-left)', () => {
    const board = [null, null, 'X', null, 'X', null, 'X', null, null]
    expect(calculateWinner(board)).toEqual({ player: 'X', line: [2, 4, 6] })
  })

  it('returns null for a full draw board with no winning line', () => {
    const board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X']
    expect(calculateWinner(board)).toBeNull()
  })
})

describe('App', () => {
  it('renders initial status and updates when clicking squares', () => {
    const { container } = render(<App />)

    expect(within(container).getByText('Next player: X')).toBeTruthy()

    const squares = within(container).getAllByRole('button', { name: /Square/ })
    fireEvent.click(squares[0])
    expect(within(container).getByText('Next player: O')).toBeTruthy()

    fireEvent.click(squares[1])
    expect(within(container).getByText('Next player: X')).toBeTruthy()
  })

  it('shows a winner message when a line is completed', () => {
    const { container } = render(<App />)
    const squares = within(container).getAllByRole('button', { name: /Square/ })

    fireEvent.click(squares[0])
    fireEvent.click(squares[3])
    fireEvent.click(squares[1])
    fireEvent.click(squares[4])
    fireEvent.click(squares[2])

    expect(within(container).getByText('Winner: X')).toBeTruthy()
  })

  it('allows reset to clear the board', () => {
    const { container } = render(<App />)
    const squares = within(container).getAllByRole('button', { name: /Square/ })
    fireEvent.click(squares[0])

    fireEvent.click(within(container).getByRole('button', { name: /reset/i }))
    expect(within(container).getByText('Next player: X')).toBeTruthy()
  })

  it('prevents clicking on already-filled squares', () => {
    const { container } = render(<App />)
    const squares = within(container).getAllByRole('button', { name: /Square/ })

    fireEvent.click(squares[0])
    expect(squares[0].textContent).toBe('X')

    fireEvent.click(squares[0])
    expect(squares[0].textContent).toBe('X')
    expect(within(container).getByText('Next player: O')).toBeTruthy()
  })

  it('prevents clicking after a winner is declared', () => {
    const { container } = render(<App />)
    const squares = within(container).getAllByRole('button', { name: /Square/ })

    fireEvent.click(squares[0])
    fireEvent.click(squares[3])
    fireEvent.click(squares[1])
    fireEvent.click(squares[4])
    fireEvent.click(squares[2])

    expect(within(container).getByText('Winner: X')).toBeTruthy()

    const emptySquare = squares.find((sq) => sq.textContent === '')
    fireEvent.click(emptySquare)
    expect(emptySquare.textContent).toBe('')
  })

  it('displays draw message when board is full with no winner', () => {
    const { container } = render(<App />)
    const squares = within(container).getAllByRole('button', { name: /Square/ })

    // Create a draw board: X O X / X O O / O X X
    const moveSequence = [0, 1, 2, 4, 3, 5, 8, 6, 7]
    moveSequence.forEach((index) => fireEvent.click(squares[index]))

    expect(within(container).getByText('Draw')).toBeTruthy()
  })

  it('highlights winning squares with CSS class', () => {
    const { container } = render(<App />)
    const squares = within(container).getAllByRole('button', { name: /Square/ })

    fireEvent.click(squares[0])
    fireEvent.click(squares[3])
    fireEvent.click(squares[1])
    fireEvent.click(squares[4])
    fireEvent.click(squares[2])

    expect(squares[0].classList.contains('square--winning')).toBe(true)
    expect(squares[1].classList.contains('square--winning')).toBe(true)
    expect(squares[2].classList.contains('square--winning')).toBe(true)
    expect(squares[5].classList.contains('square--winning')).toBe(false)
  })

  it('resets highlighting when reset button is clicked', () => {
    const { container } = render(<App />)
    const squares = within(container).getAllByRole('button', { name: /Square/ })

    fireEvent.click(squares[0])
    fireEvent.click(squares[3])
    fireEvent.click(squares[1])
    fireEvent.click(squares[4])
    fireEvent.click(squares[2])

    expect(squares[0].classList.contains('square--winning')).toBe(true)

    fireEvent.click(within(container).getByRole('button', { name: /reset/i }))
    expect(squares[0].classList.contains('square--winning')).toBe(false)
  })

  it('disables squares when they are already filled', () => {
    const { container } = render(<App />)
    const squares = within(container).getAllByRole('button', { name: /Square/ })

    fireEvent.click(squares[0])
    expect(squares[0]).toBeDisabled()
  })

  it('disables all squares when a winner is declared', () => {
    const { container } = render(<App />)
    const squares = within(container).getAllByRole('button', { name: /Square/ })

    fireEvent.click(squares[0])
    fireEvent.click(squares[3])
    fireEvent.click(squares[1])
    fireEvent.click(squares[4])
    fireEvent.click(squares[2])

    expect(within(container).getByText('Winner: X')).toBeTruthy()
    const emptySquares = squares.filter((sq) => sq.textContent === '')
    emptySquares.forEach((sq) => expect(sq).toBeDisabled())
  })

  it('supports keyboard navigation with Enter key', () => {
    const { container } = render(<App />)
    const squares = within(container).getAllByRole('button', { name: /Square/ })

    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' })
    squares[0].dispatchEvent(enterEvent)
    fireEvent.keyDown(squares[0], { key: 'Enter' })

    expect(within(container).getByText('Next player: O')).toBeTruthy()
  })

  it('supports keyboard navigation with Space key', () => {
    const { container } = render(<App />)
    const squares = within(container).getAllByRole('button', { name: /Square/ })

    fireEvent.keyDown(squares[0], { key: ' ' })
    expect(within(container).getByText('Next player: O')).toBeTruthy()
  })

  it('provides accessible aria-labels for each square', () => {
    const { container } = render(<App />)
    const squares = within(container).getAllByRole('button', { name: /Square/ })

    expect(squares[0]).toHaveAttribute('aria-label', 'Square 1')
    expect(squares[4]).toHaveAttribute('aria-label', 'Square 5')
    expect(squares[8]).toHaveAttribute('aria-label', 'Square 9')
  })

  it('updates aria-label when square is filled', () => {
    const { container } = render(<App />)
    const squares = within(container).getAllByRole('button', { name: /Square/ })

    fireEvent.click(squares[0])
    expect(squares[0]).toHaveAttribute('aria-label', 'Square 1: X')
  })
})
