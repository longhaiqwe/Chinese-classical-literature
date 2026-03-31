import { readFile, writeFile } from 'node:fs/promises'
import { parseJsonDocument } from '../core/json.js'
import { normalizeStoryDocument } from '../core/story-document.js'
import type { CliIo, CliResult } from './main.js'
import type { StoryDocument } from '../core/types.js'

export type ParsedArgs = {
  flags: Set<string>
  values: Map<string, string>
}

export function parseArgs(args: string[]): ParsedArgs {
  const flags = new Set<string>()
  const values = new Map<string, string>()

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]
    if (!arg?.startsWith('--')) {
      continue
    }

    const key = arg.slice(2)
    const next = args[index + 1]
    if (next && !next.startsWith('--')) {
      values.set(key, next)
      index += 1
    } else {
      flags.add(key)
    }
  }

  return { flags, values }
}

export function hasFlag(parsed: ParsedArgs, name: string): boolean {
  return parsed.flags.has(name)
}

export function readRequiredValue(parsed: ParsedArgs, name: string): string {
  const value = parsed.values.get(name)
  if (!value) {
    throw new Error(`Missing required option: --${name}`)
  }

  return value
}

export async function readRequiredInlineOrFileValue(
  parsed: ParsedArgs,
  inlineName: string,
  fileName: string,
  fileReader: (path: string) => Promise<string> = readTextInput,
): Promise<string> {
  const inlineValue = parsed.values.get(inlineName)
  if (inlineValue) {
    return inlineValue
  }

  const filePath = parsed.values.get(fileName)
  if (filePath) {
    return fileReader(filePath)
  }

  throw new Error(`Missing required option: --${inlineName} or --${fileName}`)
}

export async function readTextInput(path: string): Promise<string> {
  if (path === '-') {
    const chunks: Buffer[] = []
    for await (const chunk of process.stdin) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)))
    }
    return Buffer.concat(chunks).toString('utf8')
  }

  return readFile(path, 'utf8')
}

export async function readStoryDocument(path: string): Promise<StoryDocument> {
  const text = await readTextInput(path)
  return normalizeStoryDocument(parseJsonDocument(text))
}

export async function readJsonInput<T = unknown>(path: string): Promise<T> {
  const text = await readTextInput(path)
  return parseJsonDocument<T>(text)
}

export async function writeJsonResult(
  result: unknown,
  outputPath: string | undefined,
  io: CliIo,
  exitCode = 0,
): Promise<CliResult> {
  const payload = `${JSON.stringify(result, null, 2)}\n`
  if (outputPath) {
    await writeFile(outputPath, payload, 'utf8')
  } else {
    io.stdout.write(payload)
  }

  return { exitCode }
}

export function writeTextResult(
  text: string,
  io: CliIo,
  exitCode = 0,
): CliResult {
  io.stdout.write(text)
  return { exitCode }
}

export function writeUsage(io: CliIo, usage: string): CliResult {
  io.stderr.write(`${usage}\n`)
  return { exitCode: 0 }
}
