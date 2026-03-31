import { GoogleGenerativeAI } from '@google/generative-ai'
import {
  GENERATE_IMAGE_PROMPTS_PROMPT,
  GENERATE_STORY_PROMPT,
  REFINE_STORY_PROMPT,
  generatePromptDocument,
  generateStoryDocument,
  refineStoryDocument,
  type GeminiServiceDeps,
} from '../core/gemini-service.js'
import { normalizeStoryDocument } from '../core/story-document.js'
import type { ImagePromptDocument, StoryDocument, StoryScene } from '../core/types.js'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY

if (!apiKey) {
  console.warn('Missing Gemini API Key')
}

const genAI = new GoogleGenerativeAI(apiKey || '')

const storyModel = genAI.getGenerativeModel({
  model: 'gemini-3-pro-preview',
  generationConfig: {
    responseMimeType: 'application/json',
  },
})

const promptModel = genAI.getGenerativeModel({
  model: 'gemini-3-pro-preview',
  generationConfig: {
    responseMimeType: 'application/json',
  },
})

const uiGeminiDeps: GeminiServiceDeps = {
  async generateContent(prompt: string) {
    const model = prompt.includes('scene_id, prompt_en, and prompt_cn') ? promptModel : storyModel
    const result = await model.generateContent(prompt)
    return result.response.text()
  },
}

export { GENERATE_IMAGE_PROMPTS_PROMPT, GENERATE_STORY_PROMPT, REFINE_STORY_PROMPT }

export async function generateContent(prompt: string): Promise<string> {
  return uiGeminiDeps.generateContent(prompt)
}

export async function generateStory(topic: string): Promise<StoryDocument> {
  return generateStoryDocument(topic, uiGeminiDeps)
}

export async function refineStory(story: StoryScene[], instructions: string): Promise<StoryScene[]> {
  const storyDocument = normalizeStoryDocument(story)
  const refined = await refineStoryDocument(storyDocument, instructions, uiGeminiDeps)
  return refined.scenes
}

export async function generateImagePrompts(story: StoryScene[]): Promise<ImagePromptDocument> {
  const storyDocument = normalizeStoryDocument(story)
  return generatePromptDocument(storyDocument, uiGeminiDeps)
}
