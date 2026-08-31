# Story Cover System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为全部已上线故事提供独立封面插画，在故事列表展示，并让小红书分享首图使用统一的大图极简模板。

**Architecture:** 复用 `scene_images` 表，以 `scene_index = 0` 表示故事级专用封面，避免数据库结构迁移；客户端一次读取封面与第一幕图，专用封面优先、第一幕只作缺图兜底。分享首图继续由 Canvas 动态生成，只参考示例图“栏目名—典籍名—大图—故事名”的信息层级，视觉继续沿用 App 的米纸底、墨黑、朱砂红、细边框与现有字体；封面插画严格保持后续幕次相同的严肃国漫水墨风。固定模板只替换典籍名、故事名、幕数和封面插画，后续幕次分享图保持不变。封面生产使用可恢复清单，每张原图保存到 `.work/story-covers/<story_id>/`，上传到 Supabase Storage 后再 upsert 封面行。

**Tech Stack:** React 19、TypeScript、Capacitor、Canvas 2D、Supabase/PostgREST、Node test runner、OpenAI built-in image generation。

---

### Task 1: 定义故事封面数据契约

**Files:**
- Modify: `types.ts`
- Modify: `services/storyService.ts`
- Create: `services/storyCover.ts`
- Create: `services/storyCover.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
test('专用封面优先，第一幕图片只作兜底', () => {
  assert.equal(resolveStoryCoverImage('cover.jpg', 'scene-1.jpg'), 'cover.jpg');
  assert.equal(resolveStoryCoverImage(null, 'scene-1.jpg'), 'scene-1.jpg');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:share`
Expected: FAIL because `resolveStoryCoverImage` does not exist.

- [ ] **Step 3: Write minimal implementation**

```ts
export const STORY_COVER_SCENE_INDEX = 0;
export const STORY_COVER_FALLBACK_SCENE_INDEX = 1;
export const resolveStoryCoverImage = (
  dedicated?: string | null,
  firstScene?: string | null,
) => dedicated || firstScene || undefined;
```

Add `coverImage?: string` to `IGameStory`. In `getCategories()`, fetch `scene_images` for indexes 0 and 1, build per-story maps, and set `coverImage` with the resolver.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:share`
Expected: PASS.

### Task 2: 改造故事列表卡片

**Files:**
- Modify: `components/StoryCard.tsx`
- Modify: `services/storyShareUi.test.ts`

- [ ] **Step 1: Write the failing test**

Assert that StoryCard renders `story.coverImage`, uses an image `alt` based on story title, keeps `min-w-0 break-words`, and retains no share entry.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:share`
Expected: FAIL because StoryCard does not render a cover image.

- [ ] **Step 3: Write minimal implementation**

Use a two-column card: a 16:9/cropped illustration block on the left and title, clamped synopsis, and “开始闯关” on the right. Keep the entire card as the click target and keep disabled cards visually distinct.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:share`
Expected: PASS.

### Task 3: 新建小红书封面分享模板

**Files:**
- Modify: `services/shareCardPlan.ts`
- Modify: `services/shareCardPlan.test.ts`
- Modify: `services/shareStory.ts`
- Modify: `services/shareFontLoading.test.ts`

- [ ] **Step 1: Write the failing test**

Assert that the cover card receives `story.coverImage`, and the cover template contains only the fixed栏目名、典籍名、故事名、幕数 and image—not `story.description` as visible cover copy.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:share`
Expected: FAIL because the current cover has no image and draws the full opening background.

- [ ] **Step 3: Write minimal implementation**

Pass `coverImage` into the cover card. Replace `drawCover` with a fixed 1080×1440 poster layout inspired by the supplied reference: “中国古典文学” masthead, category plaque, large 16:9 illustration, large calligraphy story title, concise scene-count line, and existing brand footer. Keep all exact text rendered by Canvas rather than baked into AI art.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:share`
Expected: PASS.

### Task 4: 建立可恢复的封面生产清单

**Files:**
- Create: `scripts/sync_story_cover_manifest.mjs`
- Create: `services/storyCoverPrompt.ts`
- Create: `services/storyCoverPrompt.test.ts`
- Create: `.work/story-covers/manifest.json`

- [ ] **Step 1: Write the failing test**

Test that each prompt starts with the project’s fixed Chinese-Manhua prefix, includes title/category/description and representative story beats, requires a single coherent key visual, contains no text, and ends with `no text --ar 16:9`.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:share`
Expected: FAIL because the prompt builder does not exist.

- [ ] **Step 3: Write minimal implementation**

The manifest query must use live Supabase `stories`, `scenes`, and `scene_images`; include only `is_ready = true`; store `story_id`, `category_id`, category title, story title, description, representative scene titles/narratives, prompt, local path, remote path, and status.

- [ ] **Step 4: Refresh and verify the manifest**

Run: `node scripts/sync_story_cover_manifest.mjs`
Expected: 157 ready stories, zero existing dedicated covers at initial inventory, and no missing prompt.

### Task 5: Generate, inspect, upload, and associate dedicated covers

**Files:**
- Create/update: `.work/story-covers/<story_id>/cover-v1.png`
- Update: `.work/story-covers/manifest.json`
- Create: `scripts/upload_story_covers.mjs`

- [ ] **Step 1: Generate one representative cover**

Generate `qianlizoudanqi` first with built-in image generation using its manifest prompt. Inspect subject fidelity, serious Chinese-Manhua style, 16:9 composition, child safety, and absence of text.

- [ ] **Step 2: Repair the representative prompt if needed**

Make one targeted prompt change and regenerate only the failed cover. Do not proceed until it passes visual review.

- [ ] **Step 3: Generate remaining ready-story covers**

Issue one built-in image-generation call per manifest entry. Save every accepted final under `.work/story-covers/<story_id>/cover-v1.png`; do not leave project assets only in the generator cache.

- [ ] **Step 4: Upload and upsert**

Upload to `images/<category_id>/<story_id>/cover-v1.png` and upsert `scene_images` with `{ story_id, scene_index: 0, image_url }`. Resume only missing/failed rows.

- [ ] **Step 5: Verify live coverage**

Query all ready stories and require exactly one non-empty `scene_images` row at scene index 0 per story. A generated file or upload alone is not completion.

### Task 6: End-to-end verification and device delivery

**Files:**
- Verify only; preserve unrelated dirty-worktree changes.

- [ ] **Step 1: Run full automated verification**

Run: `npm run test:share && npm run build`
Expected: zero test failures and Vite exit 0.

- [ ] **Step 2: Verify all live cover URLs**

Check every ready story’s dedicated cover URL with authenticated database reads and anonymous/public HTTP requests; require no missing or non-2xx URL.

- [ ] **Step 3: Export representative share cards**

Export at least one short title and one long title. Inspect that the large image is not stretched, title does not clip, body copy is absent from the cover, and scene 1 remains a separate page.

- [ ] **Step 4: Build and install both native apps**

Sync Capacitor, build iOS with the connected-device destination, build Android with Android Studio JBR, install both artifacts, and launch each bundle.

- [ ] **Step 5: Physical-device acceptance**

On Android and iPhone, inspect one category list card and one successful share export. Report install, launch, foreground, list UI, share output, database coverage, and any manual acceptance gap as separate gates.
