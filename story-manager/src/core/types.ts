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

export interface StoryDocumentFallback {
  id?: string
  category_id?: string
  title?: string
  description?: string
  ending_title?: string
  ending_description?: string
}
