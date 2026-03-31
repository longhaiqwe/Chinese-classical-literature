import { createSupabaseStoryRepository } from '../../core/supabase-service.js'
import { syncStoryDocument } from '../../core/sync-service.js'
import type { StoryDocument } from '../../core/types.js'
import {
  hasFlag,
  parseArgs,
  readRequiredValue,
  readStoryDocument,
  writeJsonResult,
  writeUsage,
} from '../io.js'
import type { CliIo, CliResult } from '../main.js'

const USAGE =
  'Usage: story-manager sync-db --input <path> [--story-id <id>] [--category-id <id>] [--title <text>] [--description <text>] [--ending-title <text>] [--ending-description <text>] [--output <path>]'

function applyOverrides(story: StoryDocument, overrides: Partial<StoryDocument>): StoryDocument {
  return {
    ...story,
    ...overrides,
  }
}

export async function runSyncDbCommand(args: string[], io: CliIo): Promise<CliResult> {
  const parsed = parseArgs(args)
  if (hasFlag(parsed, 'help')) {
    return writeUsage(io, USAGE)
  }

  const input = readRequiredValue(parsed, 'input')
  const output = parsed.values.get('output')
  const story = await readStoryDocument(input)

  const resolvedStory = applyOverrides(story, {
    id: parsed.values.get('story-id') ?? story.id,
    category_id: parsed.values.get('category-id') ?? story.category_id,
    title: parsed.values.get('title') ?? story.title,
    description: parsed.values.get('description') ?? story.description,
    ending_title: parsed.values.get('ending-title') ?? story.ending_title,
    ending_description: parsed.values.get('ending-description') ?? story.ending_description,
  })

  const result = await syncStoryDocument(resolvedStory, createSupabaseStoryRepository())
  return writeJsonResult(result, output, io)
}
