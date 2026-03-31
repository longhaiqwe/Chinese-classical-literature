import { describe, expect, it, vi } from 'vitest'
import type { StoryDocument } from './types.js'
import {
  generatePromptDocument,
  generateStoryDocument,
  refineStoryDocument,
} from './gemini-service.js'

describe('generateStoryDocument', () => {
  it('normalizes fenced JSON responses into a story document', async () => {
    const document = await generateStoryDocument('草船借箭', {
      generateContent: vi.fn().mockResolvedValue(`\`\`\`json
{
  "id": "caochuanjiejian",
  "category_id": "sanguoyanyi",
  "description": "周瑜刁难诸葛亮限期造箭。",
  "ending_title": "神机妙算",
  "ending_description": "雾夜借箭，千古传诵。",
  "scenes": [
    {
      "id": "scene_1",
      "title": "第一章 夜议军机",
      "narrative": "诸葛亮端坐帐中。",
      "choices": []
    }
  ]
}
\`\`\``),
    })

    expect(document.title).toBe('草船借箭')
    expect(document.scenes[0]?.title).toBe('夜议军机')
  })
})

describe('refineStoryDocument', () => {
  it('returns a normalized replacement story document', async () => {
    const current: StoryDocument = {
      id: 'caochuanjiejian',
      category_id: 'sanguoyanyi',
      title: '草船借箭',
      description: '周瑜刁难诸葛亮限期造箭。',
      ending_title: '神机妙算',
      ending_description: '雾夜借箭，千古传诵。',
      scenes: [{ id: 'scene_1', title: '夜议军机', narrative: '...', choices: [] }],
    }

    const refined = await refineStoryDocument(current, '把对话写得更紧张', {
      generateContent: vi.fn().mockResolvedValue(JSON.stringify(current)),
    })

    expect(refined.id).toBe(current.id)
    expect(refined.title).toBe(current.title)
  })
})

describe('generatePromptDocument', () => {
  it('parses prompt arrays from JSON responses', async () => {
    const prompts = await generatePromptDocument(
      {
        id: 'caochuanjiejian',
        category_id: 'sanguoyanyi',
        title: '草船借箭',
        description: '周瑜刁难诸葛亮限期造箭。',
        ending_title: '神机妙算',
        ending_description: '雾夜借箭，千古传诵。',
        scenes: [{ id: 'scene_1', title: '夜议军机', narrative: '...', choices: [] }],
      },
      {
        generateContent: vi.fn().mockResolvedValue(
          JSON.stringify([
            {
              scene_id: 'scene_1',
              prompt_en: 'Gritty Chinese Manhua style. Zhuge Liang in camp no text --ar 16:9',
              prompt_cn: '粗粝中国漫画风。营帐中的诸葛亮，无文字，16:9。',
            },
          ]),
        ),
      },
    )

    expect(prompts).toHaveLength(1)
    expect(prompts[0]?.scene_id).toBe('scene_1')
  })
})
