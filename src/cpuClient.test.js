import { describe, expect, it } from 'vitest'
import { cpuApiBase } from './cpuClient.js'

describe('cpuApiBase', () => {
  it('defaults to the burnsy.me games-cpu host', () => {
    expect(cpuApiBase()).toBe('https://games-cpu.burnsy.me')
  })
})
