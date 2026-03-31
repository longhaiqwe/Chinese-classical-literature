import { describe, expect, it, vi } from 'vitest'
import type { StoryDocument } from './types.js'
import { syncStoryDocument } from './sync-service.js'

function exampleStoryDocument(): StoryDocument {
  return {
    id: 'caochuanjiejian',
    category_id: 'sanguoyanyi',
    title: '草船借箭',
    description: '周瑜刁难诸葛亮限期造箭。',
    ending_title: '神机妙算',
    ending_description: '雾夜借箭，千古传诵。',
    scenes: [
      {
        id: 'scene_1',
        title: '夜议军机',
        narrative: '诸葛亮端坐帐中。',
        choices: [
          {
            text: '借雾出江',
            next_scene_id: 'scene_2',
            is_correct: true,
            feedback: '诸葛亮胸有成竹。',
          },
        ],
      },
    ],
  }
}

function createMockRepo() {
  return {
    upsertStory: vi.fn().mockResolvedValue(undefined),
    upsertScene: vi.fn().mockResolvedValue({ id: 'scene-row-1' }),
    replaceSceneOptions: vi.fn().mockResolvedValue(undefined),
  }
}

describe('syncStoryDocument', () => {
  it('upserts the story, scenes, and options in order', async () => {
    const repo = createMockRepo()

    const result = await syncStoryDocument(exampleStoryDocument(), repo)

    expect(result.status).toBe('success')
    expect(result.story_id).toBe('caochuanjiejian')
    expect(repo.upsertStory).toHaveBeenCalledTimes(1)
    expect(repo.upsertScene).toHaveBeenCalledTimes(1)
    expect(repo.replaceSceneOptions).toHaveBeenCalledWith(
      'scene-row-1',
      exampleStoryDocument().scenes[0]?.choices ?? [],
    )
  })
})
