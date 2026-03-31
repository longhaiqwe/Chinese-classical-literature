import { describe, expect, it, vi } from 'vitest'

const mockLoadRuntimeEnv = vi.fn()

vi.mock('../core/env-loader.js', () => ({
  loadRuntimeEnv: (...args: unknown[]) => mockLoadRuntimeEnv(...args),
}))

import { runCli } from './main.js'

describe('runCli', () => {
  it('loads runtime env before dispatching commands', async () => {
    const events: string[] = []
    const stdout = { write: vi.fn() }
    const stderr = { write: vi.fn() }
    const generateStory = vi.fn().mockImplementation(async () => {
      events.push('command')
      return { exitCode: 0 }
    })

    mockLoadRuntimeEnv.mockReset()
    mockLoadRuntimeEnv.mockImplementation(() => {
      events.push('env')
      return { loadedFiles: [] }
    })

    const result = await runCli(
      ['generate-story', '--topic', '草船借箭'],
      { stdout, stderr },
      {
        'generate-story': generateStory,
      },
    )

    expect(result.exitCode).toBe(0)
    expect(mockLoadRuntimeEnv).toHaveBeenCalledTimes(1)
    expect(events).toEqual(['env', 'command'])
  })

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

  it('routes normalize-story to the command handler', async () => {
    const stdout = { write: vi.fn() }
    const stderr = { write: vi.fn() }
    const normalizeStory = vi.fn().mockResolvedValue({ exitCode: 0 })

    const result = await runCli(
      ['normalize-story', '--input', 'story.json'],
      { stdout, stderr },
      {
        'normalize-story': normalizeStory,
      },
    )

    expect(result.exitCode).toBe(0)
    expect(normalizeStory).toHaveBeenCalledWith(['--input', 'story.json'], { stdout, stderr })
  })

  it('routes validate-story to the command handler', async () => {
    const stdout = { write: vi.fn() }
    const stderr = { write: vi.fn() }
    const validateStory = vi.fn().mockResolvedValue({ exitCode: 1 })

    const result = await runCli(
      ['validate-story', '--input', 'story.json'],
      { stdout, stderr },
      {
        'validate-story': validateStory,
      },
    )

    expect(result.exitCode).toBe(1)
    expect(validateStory).toHaveBeenCalledWith(['--input', 'story.json'], { stdout, stderr })
  })

  it('formats thrown command errors with a stable CLI_ERROR prefix', async () => {
    const stdout = { write: vi.fn() }
    const stderr = { write: vi.fn() }

    const result = await runCli(
      ['generate-story'],
      { stdout, stderr },
      {
        'generate-story': vi.fn().mockRejectedValue(new Error('Missing required option: --topic or --topic-file')),
      },
    )

    expect(result.exitCode).toBe(1)
    expect(stderr.write).toHaveBeenCalledWith(
      'CLI_ERROR: Missing required option: --topic or --topic-file\n',
    )
  })
})
