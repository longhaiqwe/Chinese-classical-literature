# OpenClaw Story Normalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `normalize-story` and `validate-story` so OpenClaw can generate or rewrite story JSON itself while `story-manager` CLI standardizes, validates, and hands off the result to later steps.

**Architecture:** Keep the existing Gemini-backed `generate-story` and `refine-story` commands intact. Add a small validation core that works on `StoryDocument`, then expose two thin CLI commands: one for normalization plus metadata overrides, and one for validation with text or JSON output and meaningful exit codes.

**Tech Stack:** TypeScript, Vitest, tsx

---

### Task 1: Add failing tests for OpenClaw-first commands

**Files:**
- Modify: `story-manager/src/cli/main.test.ts`
- Modify: `story-manager/src/core/story-document.test.ts`
- Create: `story-manager/src/core/story-validation.test.ts`

- [ ] **Step 1: Write the failing CLI routing and validation tests**

```ts
it('routes normalize-story to the command handler', async () => {
  const normalizeStory = vi.fn().mockResolvedValue({ exitCode: 0 })
  const result = await runCli(['normalize-story', '--input', 'story.json'], io, {
    'normalize-story': normalizeStory,
  })

  expect(result.exitCode).toBe(0)
})

it('returns JSON validation output for invalid story documents', () => {
  const result = validateStoryDocument({
    id: '',
    category_id: '',
    title: '',
    description: '',
    ending_title: '',
    ending_description: '',
    scenes: [],
  })

  expect(result.ok).toBe(false)
  expect(result.errors).toContain('Missing story id')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/cli/main.test.ts src/core/story-document.test.ts src/core/story-validation.test.ts`
Expected: FAIL because `normalize-story`, `validate-story`, and the validation core do not exist yet.

- [ ] **Step 3: Commit after green**

```bash
git add story-manager/src/cli/main.test.ts story-manager/src/core/story-document.test.ts story-manager/src/core/story-validation.test.ts
git commit -m "test: cover openclaw story normalization flow"
```

### Task 2: Implement story validation core and improved normalization entry points

**Files:**
- Modify: `story-manager/src/core/types.ts`
- Modify: `story-manager/src/core/story-document.ts`
- Create: `story-manager/src/core/story-validation.ts`
- Create: `story-manager/src/core/story-validation.test.ts`

- [ ] **Step 1: Add the failing validation tests first**

```ts
describe('validateStoryDocument', () => {
  it('reports missing metadata and empty scenes', () => {
    const result = validateStoryDocument(emptyStory)

    expect(result.ok).toBe(false)
    expect(result.errors).toContain('Missing story id')
    expect(result.errors).toContain('Story must contain at least one scene')
  })
})
```

- [ ] **Step 2: Run the focused tests and verify they fail**

Run: `npm run test -- src/core/story-document.test.ts src/core/story-validation.test.ts`
Expected: FAIL with missing module/function errors.

- [ ] **Step 3: Implement the minimal normalization and validation core**

```ts
export interface StoryValidationResult {
  ok: boolean
  errors: string[]
  warnings: string[]
}

export function validateStoryDocument(story: StoryDocument): StoryValidationResult {
  const errors: string[] = []
  if (!story.id) errors.push('Missing story id')
  if (!story.category_id) errors.push('Missing category_id')
  if (!story.title) errors.push('Missing story title')
  if (!story.ending_title) errors.push('Missing ending_title')
  if (!story.ending_description) errors.push('Missing ending_description')
  if (story.scenes.length === 0) errors.push('Story must contain at least one scene')
  return { ok: errors.length === 0, errors, warnings: [] }
}
```

```ts
export function normalizeStoryInput(input: unknown, fallback: StoryDocumentFallback = {}): StoryDocument {
  if (isRecord(input) && Array.isArray(input.scenes)) {
    return normalizeStoryDocument(input, fallback)
  }
  return normalizeStoryDocument(input, fallback)
}
```

- [ ] **Step 4: Run the focused tests and verify they pass**

Run: `npm run test -- src/core/story-document.test.ts src/core/story-validation.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add story-manager/src/core/types.ts story-manager/src/core/story-document.ts story-manager/src/core/story-validation.ts story-manager/src/core/story-validation.test.ts
git commit -m "feat: add story validation core"
```

### Task 3: Implement `normalize-story` and `validate-story` CLI commands

**Files:**
- Modify: `story-manager/src/cli/io.ts`
- Modify: `story-manager/src/cli/main.ts`
- Modify: `story-manager/src/cli/main.test.ts`
- Create: `story-manager/src/cli/commands/normalize-story.ts`
- Create: `story-manager/src/cli/commands/validate-story.ts`

- [ ] **Step 1: Add failing command tests**

```ts
it('routes validate-story to the command handler', async () => {
  const validateStory = vi.fn().mockResolvedValue({ exitCode: 1 })
  const result = await runCli(['validate-story', '--input', 'story.json'], io, {
    'validate-story': validateStory,
  })

  expect(result.exitCode).toBe(1)
})
```

- [ ] **Step 2: Run the focused tests and verify they fail**

Run: `npm run test -- src/cli/main.test.ts src/core/story-validation.test.ts`
Expected: FAIL because the new commands and output helpers do not exist yet.

- [ ] **Step 3: Implement the CLI commands with minimal output helpers**

```ts
export async function runNormalizeStoryCommand(args: string[], io: CliIo): Promise<CliResult> {
  const parsed = parseArgs(args)
  const story = await readJsonInput(readRequiredValue(parsed, 'input'))
  const normalized = normalizeStoryDocument(story, {
    id: parsed.values.get('story-id'),
    category_id: parsed.values.get('category-id'),
    title: parsed.values.get('title'),
  })
  return writeJsonResult(normalized, parsed.values.get('output'), io)
}
```

```ts
export async function runValidateStoryCommand(args: string[], io: CliIo): Promise<CliResult> {
  const parsed = parseArgs(args)
  const story = await readStoryDocument(readRequiredValue(parsed, 'input'))
  const result = validateStoryDocument(story)
  if (parsed.values.get('format') === 'json') {
    return writeJsonResult(result, undefined, io, result.ok ? 0 : 1)
  }
  return writeTextResult(result.ok ? 'VALID\n' : `INVALID\n${result.errors.join('\n')}\n`, io, result.ok ? 0 : 1)
}
```

- [ ] **Step 4: Run the focused tests and verify they pass**

Run: `npm run test -- src/cli/main.test.ts src/core/story-validation.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add story-manager/src/cli/io.ts story-manager/src/cli/main.ts story-manager/src/cli/main.test.ts story-manager/src/cli/commands/normalize-story.ts story-manager/src/cli/commands/validate-story.ts
git commit -m "feat: add openclaw story cli commands"
```

### Task 4: Verify end-to-end CLI behavior and preserve existing flows

**Files:**
- Modify: `story-manager/src/cli/main.ts`
- Modify: `story-manager/src/cli/commands/generate-image-prompts.ts`
- Modify: `story-manager/src/cli/commands/sync-db.ts`

- [ ] **Step 1: Write the smallest failing regression tests if command integration needs changes**

```ts
it('keeps generate-image-prompts compatible with normalized story input', async () => {
  expect(normalizeStoryDocument(storyFixture).scenes).toHaveLength(1)
})
```

- [ ] **Step 2: Run the full suite and inspect for regressions**

Run: `npm run test`
Expected: PASS or expose the exact integration breakage that still needs fixing.

- [ ] **Step 3: Make the minimal integration fixes only if the full suite exposes them**

```ts
const defaultCommands: CommandRegistry = {
  'generate-image-prompts': runGenerateImagePromptsCommand,
  'generate-story': runGenerateStoryCommand,
  'normalize-story': runNormalizeStoryCommand,
  'refine-story': runRefineStoryCommand,
  'sync-db': runSyncDbCommand,
  'validate-story': runValidateStoryCommand,
}
```

- [ ] **Step 4: Run full verification**

Run: `npm run test`
Expected: PASS

Run: `npm run build:cli`
Expected: PASS

Run: `npm run build`
Expected: PASS

Run: `npx eslint src/core src/cli`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add story-manager/src/cli/main.ts story-manager/src/cli/commands/generate-image-prompts.ts story-manager/src/cli/commands/sync-db.ts
git commit -m "refactor: finalize openclaw story normalization flow"
```

## Self-Review

- Spec coverage:
  - New `normalize-story` command: Task 3
  - New `validate-story` command: Tasks 2 and 3
  - Validation result format: Task 2
  - Continued compatibility for later commands: Task 4
  - Existing Gemini commands preserved: Task 4 verification
- Placeholder scan:
  - No `TODO` or `TBD` placeholders remain
  - Every task includes explicit file paths and verification commands
- Type consistency:
  - `StoryDocument` remains the shared currency
  - `StoryValidationResult` is introduced once and reused consistently
