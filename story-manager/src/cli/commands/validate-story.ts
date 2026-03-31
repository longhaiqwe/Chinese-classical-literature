import { validateStoryDocument } from '../../core/story-validation.js'
import { hasFlag, parseArgs, readRequiredValue, readStoryDocument, writeJsonResult, writeTextResult, writeUsage } from '../io.js'
import type { CliIo, CliResult } from '../main.js'

const USAGE =
  'Usage: story-manager validate-story --input <path|-> [--format json]'

export async function runValidateStoryCommand(args: string[], io: CliIo): Promise<CliResult> {
  const parsed = parseArgs(args)
  if (hasFlag(parsed, 'help')) {
    return writeUsage(io, USAGE)
  }

  const input = readRequiredValue(parsed, 'input')
  const story = await readStoryDocument(input)
  const result = validateStoryDocument(story)
  const exitCode = result.ok ? 0 : 1

  if (parsed.values.get('format') === 'json') {
    return writeJsonResult(result, undefined, io, exitCode)
  }

  if (result.ok) {
    return writeTextResult('VALID\n', io, exitCode)
  }

  const lines = ['INVALID', ...result.errors]
  if (result.warnings.length > 0) {
    lines.push(...result.warnings.map((warning) => `WARNING: ${warning}`))
  }
  return writeTextResult(`${lines.join('\n')}\n`, io, exitCode)
}
