import { refineStoryDocument } from '../../core/gemini-service.js'
import {
  hasFlag,
  parseArgs,
  readRequiredValue,
  readStoryDocument,
  readTextInput,
  writeJsonResult,
  writeUsage,
} from '../io.js'
import type { CliIo, CliResult } from '../main.js'

const USAGE =
  'Usage: story-manager refine-story --input <path> (--instructions <text> | --instructions-file <path>) [--output <path>]'

export async function runRefineStoryCommand(args: string[], io: CliIo): Promise<CliResult> {
  const parsed = parseArgs(args)
  if (hasFlag(parsed, 'help')) {
    return writeUsage(io, USAGE)
  }

  const input = readRequiredValue(parsed, 'input')
  const instructions = parsed.values.get('instructions')
  const instructionsFile = parsed.values.get('instructions-file')
  if (!instructions && !instructionsFile) {
    throw new Error('Missing required option: --instructions or --instructions-file')
  }

  const story = await readStoryDocument(input)
  const resolvedInstructions = instructions ?? (await readTextInput(instructionsFile!))
  const output = parsed.values.get('output')
  const refined = await refineStoryDocument(story, resolvedInstructions)
  return writeJsonResult(refined, output, io)
}
