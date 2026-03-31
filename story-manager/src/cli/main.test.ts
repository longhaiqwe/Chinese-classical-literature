import { describe, expect, it, vi } from 'vitest'
import { runCli } from './main.js'

describe('runCli', () => {
  it('prints help for an unknown subcommand', async () => {
    const result = await runCli(['wat'], {
      stdout: { write: () => undefined },
      stderr: { write: () => undefined },
    })

    expect(result.exitCode).toBe(1)
  })

  it('routes generate-story to the command handler', async () => {
    const stdout = { write: vi.fn() }
    const stderr = { write: vi.fn() }
    const generateStory = vi.fn().mockResolvedValue({ exitCode: 0 })

    const result = await runCli(
      ['generate-story', '--topic', '草船借箭'],
      { stdout, stderr },
      {
        'generate-story': generateStory,
      },
    )

    expect(result.exitCode).toBe(0)
    expect(generateStory).toHaveBeenCalledWith(['--topic', '草船借箭'], { stdout, stderr })
  })

  it('routes sync-db to the command handler', async () => {
    const stdout = { write: vi.fn() }
    const stderr = { write: vi.fn() }
    const syncDb = vi.fn().mockResolvedValue({ exitCode: 0 })

    const result = await runCli(
      ['sync-db', '--input', 'story.json'],
      { stdout, stderr },
      {
        'sync-db': syncDb,
      },
    )

    expect(result.exitCode).toBe(0)
    expect(syncDb).toHaveBeenCalledWith(['--input', 'story.json'], { stdout, stderr })
  })
})
