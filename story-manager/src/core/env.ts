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

export function readRequiredSupabaseUrl(): string {
  return readRequiredEnv(['SUPABASE_URL', 'VITE_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL'])
}

export function readRequiredSupabaseKey(): string {
  return readRequiredEnv([
    'SUPABASE_SERVICE_ROLE_KEY',
    'SUPABASE_ANON_KEY',
    'VITE_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY',
  ])
}

export function readGeminiApiKey(): string {
  return readRequiredEnv(['GEMINI_API_KEY', 'VITE_GEMINI_API_KEY'])
}
