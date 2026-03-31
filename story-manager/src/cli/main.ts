#!/usr/bin/env node

import { runGenerateImagePromptsCommand } from './commands/generate-image-prompts.js'
import { runGenerateStoryCommand } from './commands/generate-story.js'
import { runNormalizeStoryCommand } from './commands/normalize-story.js'
import { runRefineStoryCommand } from './commands/refine-story.js'
import { runSyncDbCommand } from './commands/sync-db.js'
import { runValidateStoryCommand } from './commands/validate-story.js'

type OutputWriter = {
  write: (chunk: string) => void
}

export interface CliIo {
  stdout: OutputWriter
  stderr: OutputWriter
}

export interface CliResult {
  exitCode: number
}

export type CommandHandler = (args: string[], io: CliIo) => Promise<CliResult>

export type CommandRegistry = Record<string, CommandHandler>

const defaultIo: CliIo = {
  stdout: process.stdout,
  stderr: process.stderr,
}

const defaultCommands: CommandRegistry = {
  'generate-image-prompts': runGenerateImagePromptsCommand,
  'generate-story': runGenerateStoryCommand,
  'normalize-story': runNormalizeStoryCommand,
  'refine-story': runRefineStoryCommand,
  'sync-db': runSyncDbCommand,
  'validate-story': runValidateStoryCommand,
}

export async function runCli(
  argv: string[],
  io: CliIo = defaultIo,
  commands: CommandRegistry = defaultCommands,
): Promise<CliResult> {
  try {
    return await runCliWithCommands(argv, io, {
      ...commands,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    io.stderr.write(`CLI_ERROR: ${message}\n`)
    return { exitCode: 1 }
  }
}

export async function runCliWithCommands(
  argv: string[],
  io: CliIo,
  commands: CommandRegistry,
): Promise<CliResult> {
  const [command, ...args] = argv

  if (!command) {
    io.stderr.write('Usage: story-manager <subcommand> [options]\n')
    return { exitCode: 1 }
  }

  const handler = commands[command]
  if (handler) {
    return handler(args, io)
  }

  io.stderr.write(`Unknown subcommand: ${command}\n`)
  return { exitCode: 1 }
}

async function main() {
  const result = await runCli(process.argv.slice(2))
  process.exitCode = result.exitCode
}

const isDirectRun = process.argv[1] !== undefined && import.meta.url === new URL(`file://${process.argv[1]}`).href

if (isDirectRun) {
  void main()
}
