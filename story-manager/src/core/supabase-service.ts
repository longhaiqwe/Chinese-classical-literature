import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { readRequiredEnv } from './env.js'
import type { Database } from '../database.types.js'
import type { StoryRepository } from './sync-service.js'
import type { StoryChoice, StoryScene } from './types.js'

type SupabaseStoryInsert = Database['public']['Tables']['stories']['Insert']
type SupabaseSceneInsert = Database['public']['Tables']['scenes']['Insert']
type SupabaseSceneOptionInsert = Database['public']['Tables']['scene_options']['Insert']

function buildSupabaseClient() {
  return createClient<Database>(
    readRequiredEnv(['SUPABASE_URL', 'VITE_SUPABASE_URL']),
    readRequiredEnv(['SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY']),
  )
}

function buildStoryInsert(story: {
  id: string
  title: string
  description: string
  category_id: string
  ending_title: string
  ending_description: string
}): SupabaseStoryInsert {
  return {
    id: story.id,
    title: story.title,
    description: story.description,
    category_id: story.category_id,
    ending_title: story.ending_title,
    ending_description: story.ending_description,
    created_at: new Date().toISOString(),
  }
}

function buildSceneInsert(storyId: string, sceneIndex: number, scene: StoryScene): SupabaseSceneInsert {
  return {
    story_id: storyId,
    title: scene.title,
    narrative: scene.narrative,
    scene_index: sceneIndex,
    character_state: '',
    environment_description: '',
  }
}

function buildSceneOptionInserts(sceneId: string, choices: StoryChoice[]): SupabaseSceneOptionInsert[] {
  return choices.map((choice, index) => ({
    scene_id: sceneId,
    text: choice.text,
    is_correct: choice.is_correct,
    feedback: choice.feedback,
    sort_order: index + 1,
  }))
}

export function createStoryRepository(supabase: SupabaseClient<Database>): StoryRepository {
  return {
    async upsertStory(story) {
      const { error } = await supabase.from('stories').upsert(buildStoryInsert(story))
      if (error) {
        throw error
      }
    },
    async upsertScene(storyId, sceneIndex, scene) {
      const { data, error } = await supabase
        .from('scenes')
        .upsert(buildSceneInsert(storyId, sceneIndex, scene), {
          onConflict: 'story_id, scene_index',
        })
        .select('id')
        .single()

      if (error) {
        throw error
      }

      if (!data?.id) {
        throw new Error(`Failed to upsert scene ${sceneIndex}`)
      }

      return { id: data.id }
    },
    async replaceSceneOptions(sceneId, choices) {
      const { error: deleteError } = await supabase.from('scene_options').delete().eq('scene_id', sceneId)
      if (deleteError) {
        throw deleteError
      }

      if (choices.length === 0) {
        return
      }

      const { error: insertError } = await supabase
        .from('scene_options')
        .insert(buildSceneOptionInserts(sceneId, choices))

      if (insertError) {
        throw insertError
      }
    },
  }
}

export function createSupabaseStoryRepository(): StoryRepository {
  return createStoryRepository(buildSupabaseClient())
}
