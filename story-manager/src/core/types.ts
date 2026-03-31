export interface StoryChoice {
  text: string
  next_scene_id: string | null
  is_correct: boolean
  feedback: string
}

export interface StoryScene {
  id: string
  title: string
  narrative: string
  choices: StoryChoice[]
}

export interface StoryDocument {
  id: string
  category_id: string
  title: string
  description: string
  ending_title: string
  ending_description: string
  scenes: StoryScene[]
}

export interface ImagePromptItem {
  scene_id: string
  prompt_en: string
  prompt_cn: string
}

export type ImagePromptDocument = ImagePromptItem[]

export interface StoryDocumentFallback {
  id?: string
  category_id?: string
  title?: string
  description?: string
  ending_title?: string
  ending_description?: string
}

export interface StoryValidationResult {
  ok: boolean
  errors: string[]
  warnings: string[]
}
