import { generateStoryDocument } from '../../core/gemini-service.js'
import { hasFlag, parseArgs, readRequiredValue, writeJsonResult, writeUsage } from '../io.js'
import type { CliIo, CliResult } from '../main.js'

const USAGE = 'Usage: story-manager generate-story --topic <text> [--output <path>]'

export async function runGenerateStoryCommand(args: string[], io: CliIo): Promise<CliResult> {
  const parsed = parseArgs(args)
  if (hasFlag(parsed, 'help')) {
    return writeUsage(io, USAGE)
  }

  const topic = readRequiredValue(parsed, 'topic')
  const output = parsed.values.get('output')
  const story = await generateStoryDocument(topic)
  return writeJsonResult(story, output, io)
}
