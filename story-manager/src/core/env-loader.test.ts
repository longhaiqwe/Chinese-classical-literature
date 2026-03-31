import { afterEach, describe, expect, it } from 'vitest'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { loadRuntimeEnv } from './env-loader.js'

const tempDirs: string[] = []

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })))
  delete process.env.FROM_LOCAL
  delete process.env.FROM_CWD_ENV
  delete process.env.FROM_PARENT_LOCAL
  delete process.env.FROM_PARENT_ENV
  delete process.env.FROM_EXPORT
  delete process.env.FROM_INLINE_COMMENT
  delete process.env.FROM_QUOTED_DOUBLE
  delete process.env.FROM_QUOTED_SINGLE
  delete process.env.FROM_QUOTED_WITH_COMMENT
  delete process.env.QUOTED_VALUE
  delete process.env.SAME_KEY
  delete process.env.PRESET
})

describe('loadRuntimeEnv', () => {
  it('loads nearby env files in order, parses values, and preserves existing process.env entries', async () => {
    const root = await mkdtemp(join(tmpdir(), 'story-manager-env-loader-'))
    tempDirs.push(root)

    const cwd = join(root, 'story-manager')
    await mkdir(cwd)
    await writeFile(
      join(cwd, '.env.local'),
      ['# comment', 'FROM_LOCAL=local', 'QUOTED_VALUE="hello world"', 'SAME_KEY=from-local', 'PRESET=file'].join('\n'),
      'utf8',
    )
    await writeFile(
      join(cwd, '.env'),
      ['FROM_CWD_ENV=cwd', 'SAME_KEY=from-cwd-env'].join('\n'),
      'utf8',
    )
    await writeFile(
      join(root, '.env.local'),
      ['FROM_PARENT_LOCAL=parent-local', 'SAME_KEY=from-parent-local'].join('\n'),
      'utf8',
    )
    await writeFile(
      join(root, '.env'),
      ['FROM_PARENT_ENV=parent-env', 'SAME_KEY=from-parent-env'].join('\n'),
      'utf8',
    )
    process.env.PRESET = 'shell'

    const result = loadRuntimeEnv({ cwd })

    expect(result.loadedFiles).toEqual([
      join(cwd, '.env.local'),
      join(cwd, '.env'),
      join(root, '.env.local'),
      join(root, '.env'),
    ])
    expect(process.env.FROM_LOCAL).toBe('local')
    expect(process.env.FROM_CWD_ENV).toBe('cwd')
    expect(process.env.FROM_PARENT_LOCAL).toBe('parent-local')
    expect(process.env.FROM_PARENT_ENV).toBe('parent-env')
    expect(process.env.QUOTED_VALUE).toBe('hello world')
    expect(process.env.SAME_KEY).toBe('from-local')
    expect(process.env.PRESET).toBe('shell')
  })

  it('supports export prefixes, inline comments, and quoted values', async () => {
    const root = await mkdtemp(join(tmpdir(), 'story-manager-env-loader-'))
    tempDirs.push(root)

    const cwd = join(root, 'story-manager')
    await mkdir(cwd)
    await writeFile(
      join(cwd, '.env'),
      [
        'export FROM_EXPORT=exported',
        'FROM_INLINE_COMMENT=plain value # note',
        'FROM_QUOTED_DOUBLE="quoted # still value"',
        "FROM_QUOTED_SINGLE='single # still value'",
      ].join('\n'),
      'utf8',
    )

    loadRuntimeEnv({ cwd })

    expect(process.env.FROM_EXPORT).toBe('exported')
    expect(process.env.FROM_INLINE_COMMENT).toBe('plain value')
    expect(process.env.FROM_QUOTED_DOUBLE).toBe('quoted # still value')
    expect(process.env.FROM_QUOTED_SINGLE).toBe('single # still value')
  })

  it('strips surrounding quotes before dropping a trailing inline comment', async () => {
    const root = await mkdtemp(join(tmpdir(), 'story-manager-env-loader-'))
    tempDirs.push(root)

    const cwd = join(root, 'story-manager')
    await mkdir(cwd)
    await writeFile(
      join(cwd, '.env'),
      ['FROM_QUOTED_WITH_COMMENT="https://example" # note'].join('\n'),
      'utf8',
    )

    loadRuntimeEnv({ cwd })

    expect(process.env.FROM_QUOTED_WITH_COMMENT).toBe('https://example')
  })
})
