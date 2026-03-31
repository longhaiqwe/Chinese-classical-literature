import { describe, expect, it } from 'vitest'
import { validateStoryDocument } from './story-validation.js'

describe('validateStoryDocument', () => {
  it('reports missing metadata and empty scenes', () => {
    const result = validateStoryDocument({
      id: '',
      category_id: '',
      title: '',
      description: '',
      ending_title: '',
      ending_description: '',
      scenes: [],
    })

    expect(result.ok).toBe(false)
    expect(result.errors).toContain('Missing story id')
    expect(result.errors).toContain('Missing category_id')
    expect(result.errors).toContain('Story must contain at least one scene')
  })

  it('reports missing scene and choice fields', () => {
    const result = validateStoryDocument({
      id: 'caochuanjiejian',
      category_id: 'sanguoyanyi',
      title: '草船借箭',
      description: '周瑜刁难诸葛亮限期造箭。',
      ending_title: '神机妙算',
      ending_description: '雾夜借箭，千古传诵。',
      scenes: [
        {
          id: '',
          title: '',
          narrative: '',
          choices: [{ text: '', next_scene_id: null, is_correct: true, feedback: '' }],
        },
      ],
    })

    expect(result.ok).toBe(false)
    expect(result.errors).toContain('Scene 1 is missing id')
    expect(result.errors).toContain('Scene 1 is missing title')
    expect(result.errors).toContain('Scene 1 is missing narrative')
    expect(result.errors).toContain('Scene 1 choice 1 is missing text')
    expect(result.errors).toContain('Scene 1 choice 1 is missing feedback')
  })
})
