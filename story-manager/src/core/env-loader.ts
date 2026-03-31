import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export interface RuntimeEnvLoadOptions {
  cwd?: string
}

export interface RuntimeEnvLoadResult {
  loadedFiles: string[]
}

function stripTrailingInlineComment(value: string): string {
  let quote: '"' | "'" | undefined

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index]
    if ((character === '"' || character === "'") && value[index - 1] !== '\\') {
      if (!quote) {
        quote = character
      } else if (quote === character) {
        quote = undefined
      }
      continue
    }

    if (character === '#' && !quote && index > 0 && /\s/.test(value[index - 1]!)) {
      return value.slice(0, index).trimEnd()
    }
  }

  return value
}

function parseEnvFile(content: string): Record<string, string> {
  const values: Record<string, string> = {}

  for (const line of content.replace(/^\uFEFF/, '').split(/\r?\n/)) {
    let trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) {
      continue
    }

    if (trimmed.startsWith('export ')) {
      trimmed = trimmed.slice('export '.length).trimStart()
    }

    const separatorIndex = trimmed.indexOf('=')
    if (separatorIndex === -1) {
      continue
    }

    const key = trimmed.slice(0, separatorIndex).trim()
    if (!key) {
      continue
    }

    let value = trimmed.slice(separatorIndex + 1).trim()
    value = stripTrailingInlineComment(value)

    const first = value[0]
    const last = value[value.length - 1]
    if (value.length >= 2 && ((first === '"' && last === '"') || (first === "'" && last === "'"))) {
      value = value.slice(1, -1)
    }

    values[key] = value
  }

  return values
}

export function loadRuntimeEnv(options: RuntimeEnvLoadOptions = {}): RuntimeEnvLoadResult {
  const cwd = options.cwd ?? process.cwd()
  const candidates = [
    resolve(cwd, '.env.local'),
    resolve(cwd, '.env'),
    resolve(cwd, '../.env.local'),
    resolve(cwd, '../.env'),
  ]

  const loadedFiles: string[] = []

  for (const candidate of candidates) {
    if (!existsSync(candidate)) {
      continue
    }

    const parsed = parseEnvFile(readFileSync(candidate, 'utf8'))
    for (const [key, value] of Object.entries(parsed)) {
      if (process.env[key] === undefined) {
        process.env[key] = value
      }
    }

    loadedFiles.push(candidate)
  }

  return { loadedFiles }
}
