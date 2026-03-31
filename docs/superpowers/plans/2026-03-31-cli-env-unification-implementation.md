# CLI Env Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify runtime environment loading for the `story-manager` CLI and local scripts so they can automatically reuse the worktree `.env` and accept `SUPABASE_SERVICE_ROLE_KEY` without manual shell mapping.

**Architecture:** Introduce a shared core env loader that populates `process.env` from nearby `.env` files without overwriting explicit shell variables, then centralize Supabase and Gemini env alias resolution in `src/core/env.ts`. Wire the CLI entrypoint and standalone scripts into that shared layer so command behavior stays the same while runtime env setup becomes consistent.

**Tech Stack:** TypeScript, Node.js fs/path APIs, Vitest, existing `story-manager` CLI and scripts

---

## File Structure

### New files

- `story-manager/src/core/env-loader.ts`
  - Shared `.env` / `.env.local` loader for CLI and scripts
- `story-manager/src/core/env-loader.test.ts`
  - Tests for candidate path loading order and non-overwrite behavior
- `story-manager/src/core/env.test.ts`
  - Tests for Supabase and Gemini env alias resolution

### Modified files

- `story-manager/src/core/env.ts`
  - Keep generic env readers and add typed helpers for Supabase/Gemini names
- `story-manager/src/core/supabase-service.ts`
  - Replace inline env name arrays with shared helpers
- `story-manager/src/core/gemini-service.ts`
  - Replace inline Gemini env name arrays with shared helper
- `story-manager/src/cli/main.ts`
  - Load runtime env once before command dispatch
- `story-manager/src/cli/main.test.ts`
  - Verify CLI boot path triggers env loading
- `story-manager/scripts/migrate_audio.ts`
  - Remove duplicated parser and reuse shared loader/helpers
- `story-manager/scripts/migrate_images.ts`
  - Remove duplicated parser and reuse shared loader/helpers
- `story-manager/scripts/list_files.ts`
  - Remove duplicated parser and reuse shared loader/helpers
- `story-manager/scripts/repair_endings.ts`
  - Reuse shared loader/helpers
- `story-manager/scripts/list-models.ts`
  - Reuse shared loader/helpers

---

### Task 1: Add failing tests for shared env loading

**Files:**
- Create: `story-manager/src/core/env-loader.test.ts`
- Create: `story-manager/src/core/env-loader.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { afterEach, describe, expect, it } from 'vitest'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { loadRuntimeEnv } from './env-loader.js'

const tempDirs: string[] = []

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })))
  delete process.env.FROM_LOCAL
  delete process.env.FROM_PARENT
  delete process.env.EXISTING_ONLY
})

describe('loadRuntimeEnv', () => {
  it('loads nearby env files without overriding explicit process.env values', async () => {
    const root = await mkdtemp(join(tmpdir(), 'story-manager-env-loader-'))
    tempDirs.push(root)

    const cwd = join(root, 'story-manager')
    await mkdir(cwd)
    await writeFile(join(cwd, '.env.local'), 'FROM_LOCAL=local\\nEXISTING_ONLY=file\\n', 'utf8')
    await writeFile(join(root, '.env'), 'FROM_PARENT=parent\\n', 'utf8')
    process.env.EXISTING_ONLY = 'shell'

    const result = loadRuntimeEnv({ cwd })

    expect(result.loadedFiles).toEqual([join(cwd, '.env.local'), join(root, '.env')])
    expect(process.env.FROM_LOCAL).toBe('local')
    expect(process.env.FROM_PARENT).toBe('parent')
    expect(process.env.EXISTING_ONLY).toBe('shell')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/core/env-loader.test.ts`
Expected: FAIL because `env-loader.ts` does not exist yet

- [ ] **Step 3: Write minimal implementation**

```ts
export function loadRuntimeEnv() {
  return { loadedFiles: [] }
}
```

- [ ] **Step 4: Run test to verify it fails for the right reason**

Run: `npm run test -- src/core/env-loader.test.ts`
Expected: FAIL on missing file loading behavior

### Task 2: Implement env loader and alias helpers

**Files:**
- Modify: `story-manager/src/core/env-loader.ts`
- Modify: `story-manager/src/core/env.ts`
- Create: `story-manager/src/core/env.test.ts`
- Test: `story-manager/src/core/env-loader.test.ts`

- [ ] **Step 1: Extend tests for alias resolution**

```ts
import { afterEach, describe, expect, it } from 'vitest'
import {
  readGeminiApiKey,
  readRequiredSupabaseKey,
  readRequiredSupabaseUrl,
} from './env.js'

afterEach(() => {
  delete process.env.SUPABASE_SERVICE_ROLE_KEY
  delete process.env.SUPABASE_ANON_KEY
  delete process.env.VITE_SUPABASE_ANON_KEY
  delete process.env.SUPABASE_URL
  delete process.env.VITE_SUPABASE_URL
  delete process.env.GEMINI_API_KEY
  delete process.env.VITE_GEMINI_API_KEY
})

describe('env helpers', () => {
  it('prefers service role key over anon keys', () => {
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role'
    process.env.SUPABASE_ANON_KEY = 'anon'

    expect(readRequiredSupabaseKey()).toBe('service-role')
  })

  it('falls back to vite-prefixed vars for Gemini and URL', () => {
    process.env.VITE_SUPABASE_URL = 'https://example.supabase.co'
    process.env.VITE_GEMINI_API_KEY = 'gemini-key'

    expect(readRequiredSupabaseUrl()).toBe('https://example.supabase.co')
    expect(readGeminiApiKey()).toBe('gemini-key')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- src/core/env-loader.test.ts src/core/env.test.ts`
Expected: FAIL because the helper functions do not exist yet

- [ ] **Step 3: Implement full loader and shared env readers**

```ts
// src/core/env-loader.ts
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
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '')
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
      if (!process.env[key]) {
        process.env[key] = value
      }
    }
    loadedFiles.push(candidate)
  }

  return { loadedFiles }
}
```

```ts
// src/core/env.ts
const SUPABASE_URL_ENV_NAMES = ['SUPABASE_URL', 'VITE_SUPABASE_URL']
const SUPABASE_KEY_ENV_NAMES = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_ANON_KEY',
  'VITE_SUPABASE_ANON_KEY',
]
const GEMINI_KEY_ENV_NAMES = ['GEMINI_API_KEY', 'VITE_GEMINI_API_KEY']

export function readRequiredSupabaseUrl(): string {
  return readRequiredEnv(SUPABASE_URL_ENV_NAMES)
}

export function readRequiredSupabaseKey(): string {
  return readRequiredEnv(SUPABASE_KEY_ENV_NAMES)
}

export function readGeminiApiKey(): string {
  return readRequiredEnv(GEMINI_KEY_ENV_NAMES)
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- src/core/env-loader.test.ts src/core/env.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add story-manager/src/core/env-loader.ts story-manager/src/core/env-loader.test.ts story-manager/src/core/env.ts story-manager/src/core/env.test.ts
git commit -m "feat: add shared runtime env loader"
```

### Task 3: Wire CLI and core services into the shared env layer

**Files:**
- Modify: `story-manager/src/cli/main.ts`
- Modify: `story-manager/src/cli/main.test.ts`
- Modify: `story-manager/src/core/supabase-service.ts`
- Modify: `story-manager/src/core/gemini-service.ts`

- [ ] **Step 1: Write the failing CLI integration test**

```ts
import { describe, expect, it, vi } from 'vitest'

const mockLoadRuntimeEnv = vi.fn()

vi.mock('../core/env-loader.js', () => ({
  loadRuntimeEnv: () => mockLoadRuntimeEnv(),
}))

it('loads runtime env before dispatching commands', async () => {
  const stdout = { write: vi.fn() }
  const stderr = { write: vi.fn() }
  const generateStory = vi.fn().mockResolvedValue({ exitCode: 0 })

  await runCli(['generate-story', '--topic', '草船借箭'], { stdout, stderr }, {
    'generate-story': generateStory,
  })

  expect(mockLoadRuntimeEnv).toHaveBeenCalledTimes(1)
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- src/cli/main.test.ts src/core/gemini-service.test.ts`
Expected: FAIL because `runCli` does not invoke the loader and service files still use inline env arrays

- [ ] **Step 3: Implement CLI bootstrap and helper adoption**

```ts
// src/cli/main.ts
import { loadRuntimeEnv } from '../core/env-loader.js'

export async function runCli(...) {
  try {
    loadRuntimeEnv()
    return await runCliWithCommands(...)
  } catch (error) {
    ...
  }
}
```

```ts
// src/core/supabase-service.ts
import { readRequiredSupabaseKey, readRequiredSupabaseUrl } from './env.js'

function buildSupabaseClient() {
  return createClient<Database>(
    readRequiredSupabaseUrl(),
    readRequiredSupabaseKey(),
  )
}
```

```ts
// src/core/gemini-service.ts
import { readGeminiApiKey } from './env.js'

const apiKey = readGeminiApiKey()
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- src/cli/main.test.ts src/core/gemini-service.test.ts src/core/env.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add story-manager/src/cli/main.ts story-manager/src/cli/main.test.ts story-manager/src/core/supabase-service.ts story-manager/src/core/gemini-service.ts
git commit -m "feat: load runtime env before cli commands"
```

### Task 4: Migrate standalone scripts to the shared env layer

**Files:**
- Modify: `story-manager/scripts/migrate_audio.ts`
- Modify: `story-manager/scripts/migrate_images.ts`
- Modify: `story-manager/scripts/list_files.ts`
- Modify: `story-manager/scripts/repair_endings.ts`
- Modify: `story-manager/scripts/list-models.ts`

- [ ] **Step 1: Write a focused regression test for script-friendly helpers**

```ts
it('preserves explicit shell values when runtime env files are loaded', () => {
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'shell-key'
  const result = loadRuntimeEnv({ cwd })
  expect(process.env.SUPABASE_SERVICE_ROLE_KEY).toBe('shell-key')
  expect(result.loadedFiles.length).toBeGreaterThan(0)
})
```

- [ ] **Step 2: Run the focused tests**

Run: `npm run test -- src/core/env-loader.test.ts src/core/env.test.ts`
Expected: PASS and still cover the script assumptions

- [ ] **Step 3: Replace inline loaders in scripts with shared helpers**

```ts
// scripts/list_files.ts
import { loadRuntimeEnv } from '../src/core/env-loader.js'
import { readRequiredSupabaseKey, readRequiredSupabaseUrl } from '../src/core/env.js'

loadRuntimeEnv({ cwd: new URL('..', import.meta.url).pathname })

const supabase = createClient(
  readRequiredSupabaseUrl(),
  readRequiredSupabaseKey(),
)
```

```ts
// scripts/list-models.ts
import { loadRuntimeEnv } from '../src/core/env-loader.js'
import { readGeminiApiKey } from '../src/core/env.js'

loadRuntimeEnv({ cwd: new URL('..', import.meta.url).pathname })
const apiKey = readGeminiApiKey()
```

- [ ] **Step 4: Run full verification**

Run: `npm run test`
Expected: PASS

Run: `npm run build:cli`
Expected: PASS

Run: `npm run build`
Expected: PASS

Run: `npx eslint src/core src/cli scripts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add story-manager/scripts/migrate_audio.ts story-manager/scripts/migrate_images.ts story-manager/scripts/list_files.ts story-manager/scripts/repair_endings.ts story-manager/scripts/list-models.ts
git commit -m "refactor: unify runtime env loading"
```

### Task 5: Final documentation and branch handoff

**Files:**
- Modify: `docs/superpowers/specs/2026-03-31-cli-env-unification-design.md`
- Modify: `docs/superpowers/plans/2026-03-31-cli-env-unification-implementation.md`

- [ ] **Step 1: Re-read the spec and implementation diff**

Run: `git diff --stat HEAD~3..HEAD`
Expected: Shows env loader, CLI integration, and script cleanup only

- [ ] **Step 2: Re-run the exact verification commands fresh**

Run: `npm run test`
Expected: PASS

Run: `npm run build:cli`
Expected: PASS

Run: `npm run build`
Expected: PASS

Run: `npx eslint src/core src/cli scripts`
Expected: PASS

- [ ] **Step 3: Commit any doc touch-ups if needed**

```bash
git add docs/superpowers/specs/2026-03-31-cli-env-unification-design.md docs/superpowers/plans/2026-03-31-cli-env-unification-implementation.md
git commit -m "docs: finalize env unification notes"
```
