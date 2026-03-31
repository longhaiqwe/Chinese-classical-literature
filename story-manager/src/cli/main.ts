#!/usr/bin/env node

import { runGenerateImagePromptsCommand } from './commands/generate-image-prompts.js'
import { runGenerateStoryCommand } from './commands/generate-story.js'
import { runRefineStoryCommand } from './commands/refine-story.js'

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
  'refine-story': runRefineStoryCommand,
}

export async function runCli(
  argv: string[],
  io: CliIo = defaultIo,
  commands: CommandRegistry = defaultCommands,
): Promise<CliResult> {
  return runCliWithCommands(argv, io, {
    ...commands,
  })
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
