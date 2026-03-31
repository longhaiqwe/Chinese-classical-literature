import { describe, expect, it, vi } from 'vitest'
import { parseArgs, readRequiredInlineOrFileValue } from './io.js'

describe('readRequiredInlineOrFileValue', () => {
  it('prefers inline values when both inline and file inputs are present', async () => {
    const parsed = parseArgs(['--topic', '草船借箭', '--topic-file', 'topic.txt'])
    const reader = vi.fn().mockResolvedValue('ignored')

    const value = await readRequiredInlineOrFileValue(parsed, 'topic', 'topic-file', reader)

    expect(value).toBe('草船借箭')
    expect(reader).not.toHaveBeenCalled()
  })

  it('loads the value from a file-style argument when inline is absent', async () => {
    const parsed = parseArgs(['--topic-file', 'topic.txt'])
    const reader = vi.fn().mockResolvedValue('火烧赤壁')

    const value = await readRequiredInlineOrFileValue(parsed, 'topic', 'topic-file', reader)

    expect(value).toBe('火烧赤壁')
    expect(reader).toHaveBeenCalledWith('topic.txt')
  })

  it('throws a stable error when neither inline nor file inputs are provided', async () => {
    const parsed = parseArgs([])

    await expect(readRequiredInlineOrFileValue(parsed, 'topic', 'topic-file')).rejects.toThrow(
      'Missing required option: --topic or --topic-file',
    )
  })
})
