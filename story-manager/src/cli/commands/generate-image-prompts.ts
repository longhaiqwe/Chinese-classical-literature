import { generatePromptDocument } from '../../core/gemini-service.js'
import { hasFlag, parseArgs, readRequiredValue, readStoryDocument, writeJsonResult, writeUsage } from '../io.js'
import type { CliIo, CliResult } from '../main.js'

const USAGE =
  'Usage: story-manager generate-image-prompts --input <path> [--output <path>]'

export async function runGenerateImagePromptsCommand(args: string[], io: CliIo): Promise<CliResult> {
  const parsed = parseArgs(args)
  if (hasFlag(parsed, 'help')) {
    return writeUsage(io, USAGE)
  }

  const input = readRequiredValue(parsed, 'input')
  const output = parsed.values.get('output')
  const story = await readStoryDocument(input)
  const prompts = await generatePromptDocument(story)
  return writeJsonResult(prompts, output, io)
}
