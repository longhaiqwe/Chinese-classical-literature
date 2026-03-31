import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { runValidateStoryCommand } from './validate-story.js'

const tempDirs: string[] = []

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })))
})

describe('runValidateStoryCommand', () => {
  it('writes JSON validation output and returns exit code 1 for invalid stories', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'story-manager-validate-'))
    tempDirs.push(dir)

    const inputPath = join(dir, 'story.json')
    await writeFile(
      inputPath,
      JSON.stringify({
        id: '',
        category_id: '',
        title: '',
        description: '',
        ending_title: '',
        ending_description: '',
        scenes: [],
      }),
      'utf8',
    )

    const stdout = { write: vi.fn() }
    const stderr = { write: vi.fn() }

    const result = await runValidateStoryCommand(
      ['--input', inputPath, '--format', 'json'],
      { stdout, stderr },
    )

    expect(result.exitCode).toBe(1)
    expect(stdout.write).toHaveBeenCalled()
    expect(String(stdout.write.mock.calls[0]?.[0])).toContain('"ok": false')
    expect(String(stdout.write.mock.calls[0]?.[0])).toContain('Missing story id')
  })
})
