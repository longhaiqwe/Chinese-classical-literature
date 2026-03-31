import type { StoryChoice, StoryDocument, StoryScene } from './types.js'

export interface SavedSceneRef {
  id: string
}

export interface StoryRepository {
  upsertStory: (story: {
    id: string
    title: string
    description: string
    category_id: string
    ending_title: string
    ending_description: string
  }) => Promise<void>
  upsertScene: (storyId: string, sceneIndex: number, scene: StoryScene) => Promise<SavedSceneRef>
  replaceSceneOptions: (sceneId: string, choices: StoryChoice[]) => Promise<void>
}

export interface SyncResult {
  story_id: string
  status: 'success'
  synced_scenes: number
  synced_options: number
}

function validateStoryDocument(story: StoryDocument) {
  if (!story.id) {
    throw new Error('Story document requires a non-empty id before sync')
  }
  if (!story.category_id) {
    throw new Error('Story document requires a non-empty category_id before sync')
  }
  if (!story.title) {
    throw new Error('Story document requires a non-empty title before sync')
  }
}

export async function syncStoryDocument(
  story: StoryDocument,
  repo: StoryRepository,
): Promise<SyncResult> {
  validateStoryDocument(story)

  await repo.upsertStory({
    id: story.id,
    title: story.title,
    description: story.description,
    category_id: story.category_id,
    ending_title: story.ending_title,
    ending_description: story.ending_description,
  })

  let syncedOptions = 0

  for (const [index, scene] of story.scenes.entries()) {
    const savedScene = await repo.upsertScene(story.id, index + 1, scene)
    await repo.replaceSceneOptions(savedScene.id, scene.choices)
    syncedOptions += scene.choices.length
  }

  return {
    story_id: story.id,
    status: 'success',
    synced_scenes: story.scenes.length,
    synced_options: syncedOptions,
  }
}
