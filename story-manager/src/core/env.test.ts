import { afterEach, describe, expect, it } from 'vitest'
import {
  readGeminiApiKey,
  readRequiredSupabaseKey,
  readRequiredSupabaseUrl,
} from './env.js'

afterEach(() => {
  delete process.env.SUPABASE_URL
  delete process.env.VITE_SUPABASE_URL
  delete process.env.SUPABASE_SERVICE_ROLE_KEY
  delete process.env.SUPABASE_ANON_KEY
  delete process.env.VITE_SUPABASE_ANON_KEY
  delete process.env.GEMINI_API_KEY
  delete process.env.VITE_GEMINI_API_KEY
})

describe('readRequiredSupabaseUrl', () => {
  it('prefers the primary Supabase URL over the Vite alias', () => {
    process.env.SUPABASE_URL = 'https://primary.supabase.co'
    process.env.VITE_SUPABASE_URL = 'https://vite.supabase.co'

    expect(readRequiredSupabaseUrl()).toBe('https://primary.supabase.co')
  })

  it('falls back to the Vite-prefixed URL', () => {
    process.env.VITE_SUPABASE_URL = 'https://vite.supabase.co'

    expect(readRequiredSupabaseUrl()).toBe('https://vite.supabase.co')
  })

  it('throws when the Supabase URL is missing', () => {
    expect(() => readRequiredSupabaseUrl()).toThrow(
      'Missing environment variable: SUPABASE_URL or VITE_SUPABASE_URL',
    )
  })
})

describe('readRequiredSupabaseKey', () => {
  it('prefers the service role key over anon fallbacks', () => {
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key'
    process.env.SUPABASE_ANON_KEY = 'anon-key'
    process.env.VITE_SUPABASE_ANON_KEY = 'vite-anon-key'

    expect(readRequiredSupabaseKey()).toBe('service-role-key')
  })

  it('falls back to anon aliases when the service role key is missing', () => {
    process.env.SUPABASE_ANON_KEY = 'anon-key'
    process.env.VITE_SUPABASE_ANON_KEY = 'vite-anon-key'

    expect(readRequiredSupabaseKey()).toBe('anon-key')
  })

  it('throws when the Supabase key is missing', () => {
    expect(() => readRequiredSupabaseKey()).toThrow(
      'Missing environment variable: SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY or VITE_SUPABASE_ANON_KEY',
    )
  })
})

describe('readGeminiApiKey', () => {
  it('prefers the primary Gemini key over the Vite alias', () => {
    process.env.GEMINI_API_KEY = 'primary-gemini-key'
    process.env.VITE_GEMINI_API_KEY = 'vite-gemini-key'

    expect(readGeminiApiKey()).toBe('primary-gemini-key')
  })

  it('falls back to the Vite-prefixed key', () => {
    process.env.VITE_GEMINI_API_KEY = 'vite-gemini-key'

    expect(readGeminiApiKey()).toBe('vite-gemini-key')
  })

  it('throws when the Gemini key is missing', () => {
    expect(() => readGeminiApiKey()).toThrow(
      'Missing environment variable: GEMINI_API_KEY or VITE_GEMINI_API_KEY',
    )
  })
})
