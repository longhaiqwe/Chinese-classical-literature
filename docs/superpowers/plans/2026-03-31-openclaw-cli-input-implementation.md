# OpenClaw CLI Input Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve `generate-story` and `refine-story` so OpenClaw can reliably drive story generation and rewrite flows with direct args, files, or `stdin`.

**Architecture:** Add shared CLI input helpers for “inline or file” text resolution, update command usage strings, and move error normalization to the top-level CLI runner.

**Tech Stack:** TypeScript, Vitest, tsx

---

### Task 1: Add failing tests for OpenClaw-oriented inputs and stable CLI errors

**Files:**
- Modify: `story-manager/src/cli/main.test.ts`
- Create: `story-manager/src/cli/io.test.ts`

- [ ] **Step 1: Write failing tests**
- [ ] **Step 2: Run `npm run test -- src/cli/main.test.ts src/cli/io.test.ts` and confirm failure**
- [ ] **Step 3: Commit after green**

### Task 2: Implement shared CLI text-input resolution

**Files:**
- Modify: `story-manager/src/cli/io.ts`
- Modify: `story-manager/src/cli/commands/generate-story.ts`
- Modify: `story-manager/src/cli/commands/refine-story.ts`

- [ ] **Step 1: Add helper that resolves `--value` or `--value-file`**
- [ ] **Step 2: Update `generate-story` to support `--topic-file`**
- [ ] **Step 3: Update `refine-story` usage and instruction resolution to use shared helper**
- [ ] **Step 4: Run tests and confirm green**

### Task 3: Add stable top-level error formatting and verify builds

**Files:**
- Modify: `story-manager/src/cli/main.ts`

- [ ] **Step 1: Catch thrown errors at CLI boundary**
- [ ] **Step 2: Emit `CLI_ERROR: <message>` to stderr**
- [ ] **Step 3: Run `npm run test`, `npm run build:cli`, and `npm run build`**
- [ ] **Step 4: Commit after verification**
