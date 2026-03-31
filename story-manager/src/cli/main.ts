#!/usr/bin/env node

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

const defaultIo: CliIo = {
  stdout: process.stdout,
  stderr: process.stderr,
}

export async function runCli(argv: string[], io: CliIo = defaultIo): Promise<CliResult> {
  const [command] = argv

  if (!command) {
    io.stderr.write('Usage: story-manager <subcommand> [options]\n')
    return { exitCode: 1 }
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
