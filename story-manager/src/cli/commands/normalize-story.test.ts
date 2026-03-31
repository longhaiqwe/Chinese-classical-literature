import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { afterEach, describe, expect, it } from 'vitest'
import { runNormalizeStoryCommand } from './normalize-story.js'

const tempDirs: string[] = []

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })))
})

describe('runNormalizeStoryCommand', () => {
  it('normalizes raw story input and applies metadata overrides', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'story-manager-normalize-'))
    tempDirs.push(dir)

    const inputPath = join(dir, 'input.json')
    const outputPath = join(dir, 'story.json')

    await writeFile(
      inputPath,
      JSON.stringify({
        scenes: [
          {
            id: 'scene_1',
            title: '第一章 夜议军机',
            narrative: '诸葛亮端坐帐中。',
            choices: [],
          },
        ],
      }),
      'utf8',
    )

    const result = await runNormalizeStoryCommand(
      [
        '--input',
        inputPath,
        '--story-id',
        'caochuanjiejian',
        '--category-id',
        'sanguoyanyi',
        '--title',
        '草船借箭',
        '--ending-title',
        '神机妙算',
        '--ending-description',
        '雾夜借箭，千古传诵。',
        '--output',
        outputPath,
      ],
      {
        stdout: { write: () => undefined },
        stderr: { write: () => undefined },
      },
    )

    expect(result.exitCode).toBe(0)

    const output = JSON.parse(await readFile(outputPath, 'utf8')) as {
      id: string
      category_id: string
      title: string
      scenes: Array<{ title: string }>
    }

    expect(output.id).toBe('caochuanjiejian')
    expect(output.category_id).toBe('sanguoyanyi')
    expect(output.title).toBe('草船借箭')
    expect(output.scenes[0]?.title).toBe('夜议军机')
  })
})
