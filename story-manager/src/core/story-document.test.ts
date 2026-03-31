import { describe, expect, it } from 'vitest'
import { normalizeSceneTitle, normalizeStoryDocument } from './story-document.js'

describe('normalizeSceneTitle', () => {
  it('removes chapter prefixes and separators', () => {
    expect(normalizeSceneTitle('第一章 夜议军机')).toBe('夜议军机')
    expect(normalizeSceneTitle('Chapter 3 Storm')).toBe('Storm')
    expect(normalizeSceneTitle('1. 草船借箭')).toBe('草船借箭')
  })
})

describe('normalizeStoryDocument', () => {
  it('accepts legacy scene arrays and injects fallback metadata', () => {
    const document = normalizeStoryDocument(
      [
        {
          id: 'scene_1',
          title: '第一章 夜议军机',
          narrative: '诸葛亮端坐帐中。',
          choices: [],
        },
      ],
      {
        title: '草船借箭',
        id: 'caochuanjiejian',
        category_id: 'sanguoyanyi',
      },
    )

    expect(document.title).toBe('草船借箭')
    expect(document.id).toBe('caochuanjiejian')
    expect(document.category_id).toBe('sanguoyanyi')
    expect(document.scenes[0]?.title).toBe('夜议军机')
  })

  it('fills metadata from fallback when input only contains scenes', () => {
    const document = normalizeStoryDocument(
      {
        scenes: [
          {
            id: 'scene_1',
            title: '第一章 夜议军机',
            narrative: '诸葛亮端坐帐中。',
            choices: [],
          },
        ],
      },
      {
        id: 'caochuanjiejian',
        category_id: 'sanguoyanyi',
        title: '草船借箭',
        ending_title: '神机妙算',
        ending_description: '雾夜借箭，千古传诵。',
      },
    )

    expect(document.id).toBe('caochuanjiejian')
    expect(document.title).toBe('草船借箭')
    expect(document.ending_title).toBe('神机妙算')
    expect(document.scenes[0]?.title).toBe('夜议军机')
  })

  it('preserves structured story objects', () => {
    const document = normalizeStoryDocument({
      id: 'caochuanjiejian',
      category_id: 'sanguoyanyi',
      title: '草船借箭',
      description: '周瑜刁难诸葛亮限期造箭。',
      ending_title: '神机妙算',
      ending_description: '诸葛亮借东风前定，雾夜满载而归。',
      scenes: [
        {
          id: 'scene_1',
          title: '夜议军机',
          narrative: '诸葛亮端坐帐中。',
          choices: [],
        },
      ],
    })

    expect(document.description).toBe('周瑜刁难诸葛亮限期造箭。')
    expect(document.ending_title).toBe('神机妙算')
    expect(document.scenes).toHaveLength(1)
  })
})
