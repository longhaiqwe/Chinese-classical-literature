import { GoogleGenerativeAI } from '@google/generative-ai'
import { parseJsonDocument } from './json.js'
import { normalizeStoryDocument } from './story-document.js'
import { readRequiredEnv } from './env.js'
import type { ImagePromptDocument, StoryDocument } from './types.js'

export interface GeminiServiceDeps {
  generateContent: (prompt: string) => Promise<string>
}

const STORY_MODEL_NAME = 'gemini-3-pro-preview'

export const GENERATE_STORY_PROMPT = (topic: string) => `
You are a Master Storyteller of Chinese History (演义宗师), specializing in the "Romance of the Three Kingdoms" style.
Your words carry the weight of history and the vividness of a painting. You are weaving a tapestry of destiny based on: "${topic}".

Requirements:
1. Language: Chinese (Simplified) only.
2. Perspective: Strict third-person historical narration. Never use second-person.
3. Structure: At least 5 scenes. Each scene must contain exactly 3 choices.
4. Scene titles: Use concise four-character idioms when possible.
5. Choices: Chinese only, natural and immersive, under 12 characters, no bracketed game labels.
6. Feedback: Every choice must include feedback.
7. Ending: ending_description must include historical resonance and a reflective closing.

Output JSON only, matching the schema.
`

export const REFINE_STORY_PROMPT = (story: StoryDocument, instructions: string) => `
You are a creative editor for a Chinese Classical Literature interactive story game.
Refine the following story according to the user's instructions.

Story JSON:
${JSON.stringify(story, null, 2)}

Instructions:
${instructions}

Requirements:
1. Return the full updated JSON document only.
2. Keep Chinese (Simplified).
3. Keep third-person historical narration.
4. Keep choice texts concise.
`

export const GENERATE_IMAGE_PROMPTS_PROMPT = (story: StoryDocument) => `
You are an expert art director for a Chinese Classical Literature graphic novel.
Generate English image prompts for each scene in the story below.

Story JSON:
${JSON.stringify(story, null, 2)}

Requirements:
1. Return a JSON array.
2. Each object must include scene_id, prompt_en, and prompt_cn.
3. prompt_en must start with "Gritty Chinese Manhua style. " and end with " no text --ar 16:9".
4. Keep the visuals safe for children and students.
`

let defaultDeps: GeminiServiceDeps | undefined

function createDefaultGeminiDeps(): GeminiServiceDeps {
  const apiKey = readRequiredEnv(['GEMINI_API_KEY', 'VITE_GEMINI_API_KEY'])
  const genAI = new GoogleGenerativeAI(apiKey)
  const storyModel = genAI.getGenerativeModel({
    model: STORY_MODEL_NAME,
    generationConfig: {
      responseMimeType: 'application/json',
    },
  })
  const promptModel = genAI.getGenerativeModel({
    model: STORY_MODEL_NAME,
    generationConfig: {
      responseMimeType: 'application/json',
    },
  })

  return {
    async generateContent(prompt: string) {
      const model = prompt.includes('scene_id, prompt_en, and prompt_cn') ? promptModel : storyModel
      const result = await model.generateContent(prompt)
      return result.response.text()
    },
  }
}

function getDefaultGeminiDeps(): GeminiServiceDeps {
  defaultDeps ??= createDefaultGeminiDeps()
  return defaultDeps
}

function normalizePromptDocument(input: unknown): ImagePromptDocument {
  if (!Array.isArray(input)) {
    throw new Error('Image prompt response must be an array')
  }

  return input.map((item) => {
    if (typeof item !== 'object' || item === null) {
      throw new Error('Invalid image prompt entry')
    }

    const record = item as Record<string, unknown>
    return {
      scene_id: typeof record.scene_id === 'string' ? record.scene_id : '',
      prompt_en: typeof record.prompt_en === 'string' ? record.prompt_en : '',
      prompt_cn: typeof record.prompt_cn === 'string' ? record.prompt_cn : '',
    }
  })
}

export async function generateStoryDocument(
  topic: string,
  deps: GeminiServiceDeps = getDefaultGeminiDeps(),
): Promise<StoryDocument> {
  const raw = await deps.generateContent(GENERATE_STORY_PROMPT(topic))
  return normalizeStoryDocument(parseJsonDocument(raw), { title: topic })
}

export async function refineStoryDocument(
  story: StoryDocument,
  instructions: string,
  deps: GeminiServiceDeps = getDefaultGeminiDeps(),
): Promise<StoryDocument> {
  const raw = await deps.generateContent(REFINE_STORY_PROMPT(story, instructions))
  return normalizeStoryDocument(parseJsonDocument(raw), {
    title: story.title,
    id: story.id,
    category_id: story.category_id,
    description: story.description,
    ending_title: story.ending_title,
    ending_description: story.ending_description,
  })
}

export async function generatePromptDocument(
  story: StoryDocument,
  deps: GeminiServiceDeps = getDefaultGeminiDeps(),
): Promise<ImagePromptDocument> {
  const raw = await deps.generateContent(GENERATE_IMAGE_PROMPTS_PROMPT(story))
  return normalizePromptDocument(parseJsonDocument(raw))
}
