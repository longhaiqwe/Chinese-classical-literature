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
  it('falls back to the Vite-prefixed URL', () => {
    process.env.VITE_SUPABASE_URL = 'https://vite.supabase.co'

    expect(readRequiredSupabaseUrl()).toBe('https://vite.supabase.co')
  })
})

describe('readRequiredSupabaseKey', () => {
  it('prefers the service role key over anon fallbacks', () => {
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key'
    process.env.SUPABASE_ANON_KEY = 'anon-key'
    process.env.VITE_SUPABASE_ANON_KEY = 'vite-anon-key'

    expect(readRequiredSupabaseKey()).toBe('service-role-key')
  })
})

describe('readGeminiApiKey', () => {
  it('falls back to the Vite-prefixed key', () => {
    process.env.VITE_GEMINI_API_KEY = 'vite-gemini-key'

    expect(readGeminiApiKey()).toBe('vite-gemini-key')
  })
})
