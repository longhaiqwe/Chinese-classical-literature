# Story Manager CLI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an agent-friendly `story-manager` CLI with step-by-step JSON-based commands while keeping the existing React workspace functional.

**Architecture:** Extract shared business logic into `src/core`, add a thin `src/cli` layer for argument parsing and JSON/stdout behavior, and migrate the first batch of React screens to call the shared modules. Use TDD for core normalization, CLI execution flow, Gemini-backed document generation, and Supabase sync behavior.

**Tech Stack:** TypeScript, Vite, React, Vitest, tsx, Supabase JS, Google Generative AI

---

### Task 1: Add CLI and Test Tooling

**Files:**
- Modify: `story-manager/package.json`
- Modify: `story-manager/tsconfig.json`
- Modify: `story-manager/tsconfig.node.json`
- Create: `story-manager/tsconfig.cli.json`
- Create: `story-manager/vitest.config.ts`
- Create: `story-manager/src/cli/main.ts`
- Create: `story-manager/src/cli/main.test.ts`

- [ ] **Step 1: Write the failing CLI smoke test**

```ts
import { describe, expect, it } from 'vitest'
import { runCli } from './main'

describe('runCli', () => {
  it('prints help for an unknown subcommand', async () => {
    const result = await runCli(['wat'], {
      stdout: { write: () => undefined },
      stderr: { write: () => undefined },
    })

    expect(result.exitCode).toBe(1)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/cli/main.test.ts`
Expected: FAIL because `runCli` and the Vitest setup do not exist yet.

- [ ] **Step 3: Add test/build/CLI scaffolding**

```json
{
  "scripts": {
    "test": "vitest run",
    "cli": "tsx src/cli/main.ts",
    "build:cli": "tsc -p tsconfig.cli.json"
  },
  "bin": {
    "story-manager": "./dist-cli/cli/main.js"
  },
  "devDependencies": {
    "tsx": "^4.20.0",
    "vitest": "^3.2.0"
  }
}
```

```ts
// story-manager/src/cli/main.ts
export async function runCli(argv: string[], io = defaultIo) {
  const [command] = argv
  if (!command) {
    io.stderr.write('Usage: story-manager <subcommand> [options]\\n')
    return { exitCode: 1 }
  }

  io.stderr.write(`Unknown subcommand: ${command}\\n`)
  return { exitCode: 1 }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/cli/main.test.ts`
Expected: PASS

- [ ] **Step 5: Verify tooling compiles**

Run: `npm run build:cli`
Expected: PASS and `dist-cli/` is generated.

- [ ] **Step 6: Commit**

```bash
git add story-manager/package.json story-manager/package-lock.json story-manager/tsconfig.json story-manager/tsconfig.node.json story-manager/tsconfig.cli.json story-manager/vitest.config.ts story-manager/src/cli/main.ts story-manager/src/cli/main.test.ts
git commit -m "chore: add story-manager cli tooling"
```

### Task 2: Extract Story Document Core and JSON I/O

**Files:**
- Create: `story-manager/src/core/types.ts`
- Create: `story-manager/src/core/json.ts`
- Create: `story-manager/src/core/story-document.ts`
- Create: `story-manager/src/core/story-document.test.ts`

- [ ] **Step 1: Write the failing normalization tests**

```ts
import { describe, expect, it } from 'vitest'
import { normalizeStoryDocument } from './story-document'

describe('normalizeStoryDocument', () => {
  it('accepts legacy scene arrays and injects the title', () => {
    const doc = normalizeStoryDocument(
      [{ id: 'scene_1', title: '第一章 夜议军机', narrative: '...', choices: [] }],
      { title: '草船借箭' },
    )

    expect(doc.title).toBe('草船借箭')
    expect(doc.scenes[0]?.title).toBe('夜议军机')
  })

  it('preserves structured story objects', () => {
    const doc = normalizeStoryDocument({
      id: 'caochuanjiejian',
      category_id: 'sanguoyanyi',
      title: '草船借箭',
      description: '...',
      ending_title: '神机妙算',
      ending_description: '...',
      scenes: [{ id: 'scene_1', title: '夜议军机', narrative: '...', choices: [] }],
    })

    expect(doc.id).toBe('caochuanjiejian')
    expect(doc.scenes).toHaveLength(1)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/core/story-document.test.ts`
Expected: FAIL because the core document module does not exist yet.

- [ ] **Step 3: Implement shared document and JSON helpers**

```ts
// story-manager/src/core/types.ts
export interface StoryChoice {
  text: string
  next_scene_id: string | null
  is_correct: boolean
  feedback: string
}

export interface StoryScene {
  id: string
  title: string
  narrative: string
  choices: StoryChoice[]
}

export interface StoryDocument {
  id: string
  category_id: string
  title: string
  description: string
  ending_title: string
  ending_description: string
  scenes: StoryScene[]
}
```

```ts
// story-manager/src/core/story-document.ts
export function normalizeSceneTitle(title: string): string {
  return title
    .replace(/^第\s*\d+\s*章/, '')
    .replace(/^Chapter\s*\d+/i, '')
    .replace(/^\d+\./, '')
    .replace(/^[·.:]\s*/, '')
    .trim()
}

export function normalizeStoryDocument(input: unknown, fallback: Partial<StoryDocument> = {}): StoryDocument {
  // Accept both object and legacy array inputs and always return a full StoryDocument.
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/core/story-document.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add story-manager/src/core/types.ts story-manager/src/core/json.ts story-manager/src/core/story-document.ts story-manager/src/core/story-document.test.ts
git commit -m "feat: add story document core"
```

### Task 3: Implement Gemini-Backed Story Commands

**Files:**
- Create: `story-manager/src/core/env.ts`
- Create: `story-manager/src/core/gemini-service.ts`
- Create: `story-manager/src/core/gemini-service.test.ts`
- Create: `story-manager/src/cli/io.ts`
- Create: `story-manager/src/cli/commands/generate-story.ts`
- Create: `story-manager/src/cli/commands/refine-story.ts`
- Create: `story-manager/src/cli/commands/generate-image-prompts.ts`
- Modify: `story-manager/src/cli/main.ts`

- [ ] **Step 1: Write the failing command tests**

```ts
import { describe, expect, it, vi } from 'vitest'
import { runCli } from '../main'

describe('story commands', () => {
  it('writes a normalized story document to stdout', async () => {
    const stdout = { write: vi.fn() }
    const stderr = { write: vi.fn() }

    const result = await runCli(['generate-story', '--topic', '草船借箭'], { stdout, stderr })

    expect(result.exitCode).toBe(0)
    expect(stdout.write).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/cli/main.test.ts src/core/gemini-service.test.ts`
Expected: FAIL because the subcommands and service wiring do not exist.

- [ ] **Step 3: Implement environment + Gemini services with dependency injection**

```ts
// story-manager/src/core/env.ts
export function readRequiredEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback
  if (!value) throw new Error(`Missing environment variable: ${name}`)
  return value
}
```

```ts
// story-manager/src/core/gemini-service.ts
export async function generateStoryDocument(topic: string, deps = defaultGeminiDeps) {
  const raw = await deps.generateContent(GENERATE_STORY_PROMPT(topic))
  return normalizeStoryDocument(parseJsonDocument(raw), { title: topic })
}

export async function refineStoryDocument(story: StoryDocument, instructions: string, deps = defaultGeminiDeps) {
  const raw = await deps.generateContent(REFINE_STORY_PROMPT(story, instructions))
  return normalizeStoryDocument(parseJsonDocument(raw), { title: story.title })
}

export async function generatePromptDocument(story: StoryDocument, deps = defaultGeminiDeps) {
  return parseJsonDocument(await deps.generateContent(GENERATE_IMAGE_PROMPTS_PROMPT(story)))
}
```

- [ ] **Step 4: Wire the first batch of subcommands**

```ts
// story-manager/src/cli/main.ts
const commands = {
  'generate-story': runGenerateStoryCommand,
  'refine-story': runRefineStoryCommand,
  'generate-image-prompts': runGenerateImagePromptsCommand,
}
```

```ts
// story-manager/src/cli/commands/generate-story.ts
const topic = readRequiredOption(options, 'topic')
const story = await generateStoryDocument(topic)
return writeJsonResult(story, options.output, io)
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm run test -- src/cli/main.test.ts src/core/gemini-service.test.ts`
Expected: PASS

- [ ] **Step 6: Verify manual CLI flows**

Run: `npm run cli -- generate-story --help`
Expected: prints usage text to `stderr` and exits `0`

Run: `npm run cli -- refine-story --help`
Expected: prints usage text to `stderr` and exits `0`

- [ ] **Step 7: Commit**

```bash
git add story-manager/src/core/env.ts story-manager/src/core/gemini-service.ts story-manager/src/core/gemini-service.test.ts story-manager/src/cli/io.ts story-manager/src/cli/commands/generate-story.ts story-manager/src/cli/commands/refine-story.ts story-manager/src/cli/commands/generate-image-prompts.ts story-manager/src/cli/main.ts
git commit -m "feat: add gemini-backed story cli commands"
```

### Task 4: Implement Supabase Sync Core and `sync-db`

**Files:**
- Create: `story-manager/src/core/supabase-service.ts`
- Create: `story-manager/src/core/sync-service.ts`
- Create: `story-manager/src/core/sync-service.test.ts`
- Create: `story-manager/src/cli/commands/sync-db.ts`
- Modify: `story-manager/src/cli/main.ts`

- [ ] **Step 1: Write the failing sync tests**

```ts
import { describe, expect, it, vi } from 'vitest'
import { syncStoryDocument } from './sync-service'

describe('syncStoryDocument', () => {
  it('upserts the story, scenes, and options in order', async () => {
    const repo = createMockRepo()

    const result = await syncStoryDocument(exampleStoryDocument(), repo)

    expect(result.status).toBe('success')
    expect(repo.upsertStory).toHaveBeenCalledTimes(1)
    expect(repo.upsertScene).toHaveBeenCalledTimes(exampleStoryDocument().scenes.length)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/core/sync-service.test.ts`
Expected: FAIL because the sync service and repository adapter do not exist.

- [ ] **Step 3: Implement repository-backed sync logic**

```ts
// story-manager/src/core/sync-service.ts
export async function syncStoryDocument(story: StoryDocument, repo: StoryRepository): Promise<SyncResult> {
  await repo.upsertStory({
    id: story.id,
    title: story.title,
    description: story.description,
    category_id: story.category_id,
    ending_title: story.ending_title,
    ending_description: story.ending_description,
  })

  for (const [index, scene] of story.scenes.entries()) {
    const savedScene = await repo.upsertScene(story.id, index + 1, scene)
    await repo.replaceSceneOptions(savedScene.id, scene.choices)
  }

  return { story_id: story.id, status: 'success', synced_scenes: story.scenes.length }
}
```

- [ ] **Step 4: Add the CLI command**

```ts
// story-manager/src/cli/commands/sync-db.ts
const story = await readStoryDocument(options.input)
const result = await syncStoryDocument(story, createSupabaseStoryRepository())
return writeJsonResult(result, options.output, io)
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm run test -- src/core/sync-service.test.ts src/cli/main.test.ts`
Expected: PASS

- [ ] **Step 6: Verify CLI build still passes**

Run: `npm run build:cli`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add story-manager/src/core/supabase-service.ts story-manager/src/core/sync-service.ts story-manager/src/core/sync-service.test.ts story-manager/src/cli/commands/sync-db.ts story-manager/src/cli/main.ts
git commit -m "feat: add story sync cli command"
```

### Task 5: Reuse Shared Core in React and Run End-to-End Verification

**Files:**
- Modify: `story-manager/src/lib/gemini.ts`
- Modify: `story-manager/src/lib/supabase.ts`
- Modify: `story-manager/src/components/StoryGenerator.tsx`
- Modify: `story-manager/src/components/StoryReview.tsx`
- Modify: `story-manager/src/components/ImagePromptGenerator.tsx`
- Modify: `story-manager/src/components/DatabaseSync.tsx`

- [ ] **Step 1: Write the failing regression tests for the shared adapters**

```ts
import { describe, expect, it } from 'vitest'
import { normalizeStoryDocument } from '../core/story-document'

describe('react adapter compatibility', () => {
  it('returns scene arrays for existing React screens when needed', () => {
    const doc = normalizeStoryDocument(exampleStoryDocument())
    expect(doc.scenes[0]?.choices).toBeDefined()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/core/story-document.test.ts src/core/gemini-service.test.ts`
Expected: FAIL because the current React-facing adapters still point at the old inline logic.

- [ ] **Step 3: Replace inline React business logic with shared core calls**

```ts
// story-manager/src/lib/gemini.ts
export {
  generateStoryDocument,
  refineStoryDocument,
  generatePromptDocument,
} from '../core/gemini-service'
```

```ts
// story-manager/src/components/StoryGenerator.tsx
const storyDocument = await generateStoryDocument(topic)
onStoryGenerated(storyDocument.scenes, topic, {
  id: storyDocument.id,
  categoryId: storyDocument.category_id,
  description: storyDocument.description,
  endingTitle: storyDocument.ending_title,
  endingDescription: storyDocument.ending_description,
})
```

```ts
// story-manager/src/components/DatabaseSync.tsx
const result = await syncStoryDocument(toStoryDocumentFromProps(...), createSupabaseStoryRepository())
onSyncComplete(result.story_id)
```

- [ ] **Step 4: Run verification**

Run: `npm run test`
Expected: PASS

Run: `npm run build`
Expected: PASS

Run: `npx eslint src/core src/cli src/lib/gemini.ts src/lib/supabase.ts src/components/StoryGenerator.tsx src/components/StoryReview.tsx src/components/ImagePromptGenerator.tsx src/components/DatabaseSync.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add story-manager/src/lib/gemini.ts story-manager/src/lib/supabase.ts story-manager/src/components/StoryGenerator.tsx story-manager/src/components/StoryReview.tsx story-manager/src/components/ImagePromptGenerator.tsx story-manager/src/components/DatabaseSync.tsx
git commit -m "refactor: share story-manager core across cli and react"
```

## Self-Review

- Spec coverage:
  - Step-based CLI commands: covered by Tasks 3 and 4
  - Shared core extraction: covered by Tasks 2 through 5
  - JSON/stdout conventions: covered by Tasks 1 and 3
  - React compatibility: covered by Task 5
  - First-phase command scope: covered by `generate-story`, `refine-story`, `generate-image-prompts`, and `sync-db`
- Placeholder scan:
  - No `TODO`/`TBD` placeholders remain
  - Each task names exact files and exact verification commands
- Type consistency:
  - `StoryDocument`, `StoryScene`, and `StoryChoice` are introduced once in Task 2 and reused consistently afterward
  - Command names match the accepted spec
