import type { StoryChoice, StoryDocument, StoryDocumentFallback, StoryScene } from './types.js'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function asNullableString(value: unknown): string | null {
  return typeof value === 'string' ? value : null
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback
}

export function normalizeSceneTitle(title: string): string {
  return title
    .replace(/^第\s*[\d一二三四五六七八九十百千零两]+\s*章/, '')
    .replace(/^Chapter\s*\d+/i, '')
    .replace(/^\d+\./, '')
    .replace(/^[·.:]\s*/, '')
    .trim()
}

function normalizeChoice(input: unknown): StoryChoice {
  if (!isRecord(input)) {
    throw new Error('Invalid story choice')
  }

  return {
    text: asString(input.text),
    next_scene_id: asNullableString(input.next_scene_id),
    is_correct: asBoolean(input.is_correct),
    feedback: asString(input.feedback),
  }
}

function normalizeScene(input: unknown, index: number): StoryScene {
  if (!isRecord(input)) {
    throw new Error('Invalid story scene')
  }

  const choices = Array.isArray(input.choices) ? input.choices.map(normalizeChoice) : []

  return {
    id: asString(input.id, `scene_${index + 1}`),
    title: normalizeSceneTitle(asString(input.title)),
    narrative: asString(input.narrative),
    choices,
  }
}

function normalizeScenes(input: unknown): StoryScene[] {
  if (!Array.isArray(input)) {
    throw new Error('Story document must contain scenes')
  }

  return input.map(normalizeScene)
}

export function normalizeStoryDocument(
  input: unknown,
  fallback: StoryDocumentFallback = {},
): StoryDocument {
  if (Array.isArray(input)) {
    return {
      id: fallback.id ?? '',
      category_id: fallback.category_id ?? '',
      title: fallback.title ?? '',
      description: fallback.description ?? '',
      ending_title: fallback.ending_title ?? '',
      ending_description: fallback.ending_description ?? '',
      scenes: normalizeScenes(input),
    }
  }

  if (!isRecord(input)) {
    throw new Error('Story document must be an object or scene array')
  }

  return {
    id: asString(input.id, fallback.id ?? ''),
    category_id: asString(input.category_id, fallback.category_id ?? ''),
    title: asString(input.title, fallback.title ?? ''),
    description: asString(input.description, fallback.description ?? ''),
    ending_title: asString(input.ending_title, fallback.ending_title ?? ''),
    ending_description: asString(input.ending_description, fallback.ending_description ?? ''),
    scenes: normalizeScenes(input.scenes),
  }
}
