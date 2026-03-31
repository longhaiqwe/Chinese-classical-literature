import { describe, expect, it } from 'vitest'
import { runCli } from './main.js'

describe('runCli', () => {
  it('prints help for an unknown subcommand', async () => {
    const result = await runCli(['wat'], {
      stdout: { write: () => undefined },
      stderr: { write: () => undefined },
    })

    expect(result.exitCode).toBe(1)
  })
})
