import { describe, it, expect } from 'vitest'
import { applyCpuRound, createArcadeRun } from './ArcadeRun'

describe('applyCpuRound', () => {
  it('increments streak on human win and tracks best', () => {
    let run = createArcadeRun()
    run = applyCpuRound(run, 'x')
    run = applyCpuRound(run, 'x')
    expect(run.streak).toBe(2)
    expect(run.bestStreak).toBe(2)
    expect(run.lives).toBe(3)
    expect(run.gameOver).toBe(false)
  })

  it('costs a life on cpu win and ends after three losses', () => {
    let run = createArcadeRun()
    run = applyCpuRound(run, 'x')
    run = applyCpuRound(run, 'cpu')
    expect(run.lives).toBe(2)
    expect(run.streak).toBe(0)
    expect(run.bestStreak).toBe(1)

    run = applyCpuRound(run, 'cpu')
    run = applyCpuRound(run, 'cpu')
    expect(run.lives).toBe(0)
    expect(run.gameOver).toBe(true)
  })

  it('breaks streak on draw without costing a life', () => {
    let run = createArcadeRun()
    run = applyCpuRound(run, 'x')
    run = applyCpuRound(run, 'draw')
    expect(run.streak).toBe(0)
    expect(run.lives).toBe(3)
    expect(run.bestStreak).toBe(1)
  })
})
