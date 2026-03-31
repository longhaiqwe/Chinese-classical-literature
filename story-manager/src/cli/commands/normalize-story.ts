import { normalizeStoryDocument } from '../../core/story-document.js'
import type { StoryDocument } from '../../core/types.js'
import {
  hasFlag,
  parseArgs,
  readJsonInput,
  readRequiredValue,
  writeJsonResult,
  writeUsage,
} from '../io.js'
import type { CliIo, CliResult } from '../main.js'

const USAGE =
  'Usage: story-manager normalize-story --input <path|-> [--story-id <id>] [--category-id <id>] [--title <text>] [--description <text>] [--ending-title <text>] [--ending-description <text>] [--output <path>]'

function applyOverrides(parsed: ReturnType<typeof parseArgs>): Partial<StoryDocument> {
  return {
    id: parsed.values.get('story-id'),
    category_id: parsed.values.get('category-id'),
    title: parsed.values.get('title'),
    description: parsed.values.get('description'),
    ending_title: parsed.values.get('ending-title'),
    ending_description: parsed.values.get('ending-description'),
  }
}

export async function runNormalizeStoryCommand(args: string[], io: CliIo): Promise<CliResult> {
  const parsed = parseArgs(args)
  if (hasFlag(parsed, 'help')) {
    return writeUsage(io, USAGE)
  }

  const input = readRequiredValue(parsed, 'input')
  const rawStory = await readJsonInput(input)
  const normalized = normalizeStoryDocument(rawStory, applyOverrides(parsed))
  return writeJsonResult(normalized, parsed.values.get('output'), io)
}
