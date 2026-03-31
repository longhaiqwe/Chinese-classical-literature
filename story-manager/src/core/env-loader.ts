import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export interface RuntimeEnvLoadOptions {
  cwd?: string
}

export interface RuntimeEnvLoadResult {
  loadedFiles: string[]
}

function parseEnvFile(content: string): Record<string, string> {
  const values: Record<string, string> = {}

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) {
      continue
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
    if (value.length >= 2) {
      const first = value[0]
      const last = value[value.length - 1]
      if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
        value = value.slice(1, -1)
      }
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
