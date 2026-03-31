export function readEnvValue(names: string[]): string | undefined {
  for (const name of names) {
    const value = process.env[name]
    if (value) {
      return value
    }
  }

  return undefined
}

export function readRequiredEnv(names: string[]): string {
  const value = readEnvValue(names)
  if (!value) {
    throw new Error(`Missing environment variable: ${names.join(' or ')}`)
  }

  return value
}
