# Story Manager CLI Design

## Summary

将 `story-manager` 从“仅能在浏览器里手工推进的 React 工作台”改造成“可被 Agent 分步骤调用的 CLI 工具”，优先服务 OpenClaw 这类需要查看中间结果、插入人工或模型修订、再继续下一步的工作流。

第一阶段不替换现有 Web UI，而是把 UI 里的核心业务逻辑抽离成可复用的 TypeScript 模块，再由 CLI 和 React 组件共同调用。

## Current State

`story-manager` 当前是一个独立的 Vite/React 子项目，主流程分为 6 步：

1. 生成故事结构
2. 审阅与优化故事
3. 同步数据库
4. 生成音频
5. 生成图片提示词
6. 生成图片并发布

当前问题：

- 业务逻辑散落在 React 组件中，无法稳定地被外部 Agent 直接调用。
- 中间状态依赖前端内存和 `localStorage`，不适合多轮 Agent 编排。
- UI 中的“继续下一步”是隐式状态迁移，不是显式的数据契约。
- `story-manager` 当前构建可通过，但 lint 基线不干净，不能把“lint 全绿”当成第一阶段改造前提。

## Goals

1. 提供分步骤 CLI 子命令，允许 Agent 显式读取和写入每一步的中间结果。
2. 保持每个步骤的输入输出稳定、可机读、默认适合 JSON 管道调用。
3. 把现有 UI 的核心逻辑抽到共享模块，避免 CLI 和 React 双份实现。
4. 保留现有 React 工作台，使人工编辑和 CLI 编排可以并存。
5. 为后续补充“一键串行 pipeline 命令”预留基础，但第一阶段不以它为重点。

## Non-Goals

- 第一阶段不重做 `story-manager` 的界面。
- 第一阶段不强行修复整个子项目历史遗留的所有 lint 问题。
- 第一阶段不改变 Supabase 数据模型。
- 第一阶段不引入复杂任务编排框架或消息队列。

## User and Agent Workflow

### Target Workflow

Agent 或人工可按如下方式逐步推进：

1. `generate-story` 生成故事 JSON
2. 人工或 Agent 修改输出文件
3. `refine-story` 基于修改意见继续优化
4. `sync-db` 将确认后的故事写入 Supabase
5. `generate-image-prompts` 为场景生成图片提示词
6. 人工或 Agent 修改提示词文件
7. `generate-audio` 和 `generate-images` 按需执行

### Why Step-Based Commands Win

- Agent 可以在每一步读取完整 JSON，再决定是否继续。
- 中间文件可被人工直接编辑，不需要依赖浏览器状态。
- 某一步失败时可以局部重试，而不是整条流水线重来。
- OpenClaw 之类系统更容易围绕确定的 JSON 契约做自动化。

## CLI Design

### Command Shape

命令入口统一为：

```bash
story-manager <subcommand> [options]
```

第一阶段提供以下子命令：

```bash
story-manager generate-story
story-manager refine-story
story-manager sync-db
story-manager generate-image-prompts
story-manager generate-audio
story-manager generate-images
```

后续可补：

```bash
story-manager run-all
```

### Shared Conventions

所有子命令遵循以下约定：

- 结构化结果默认输出到 `stdout`
- 运行日志、进度、告警输出到 `stderr`
- 成功返回 exit code `0`
- 失败返回非 `0`
- 支持 `--output <path>` 将结构化结果写入文件
- 支持 `--input <path>` 从 JSON 文件读取输入
- 当命令天然以 JSON 为输入时，也支持 `--input -` 从 `stdin` 读取
- 结果 JSON 字段命名尽量复用现有前端与数据库语义，避免二次翻译

### Output Formats

第一阶段推荐显式中间产物：

- `story.json`
- `story.reviewed.json`
- `image-prompts.json`
- `audio-result.json`
- `image-result.json`

这些文件名不是硬编码要求，只是推荐产物命名。

## Data Contracts

### Story Document

故事文档采用统一对象结构，而不是裸数组：

```json
{
  "id": "caochuanjiejian",
  "category_id": "sanguoyanyi",
  "title": "草船借箭",
  "description": "...",
  "ending_title": "神机妙算",
  "ending_description": "...",
  "scenes": [
    {
      "id": "scene_1",
      "title": "夜议军机",
      "narrative": "...",
      "choices": [
        {
          "text": "借雾出江",
          "next_scene_id": "scene_2",
          "is_correct": true,
          "feedback": "..."
        }
      ]
    }
  ]
}
```

说明：

- CLI 内部统一以对象格式工作。
- 如果上游仍给出旧版“裸数组场景”结构，CLI 在读取层做兼容转换。
- `title` 为 CLI 文档层新增字段，便于脱离“生成主题”上下文独立流转。

### Prompt Document

图片提示词文件格式保持与现有 UI 接近：

```json
[
  {
    "scene_id": "scene_1",
    "prompt_en": "...",
    "prompt_cn": "..."
  }
]
```

### Operation Result

涉及外部副作用的命令返回明确结果对象，例如：

```json
{
  "story_id": "caochuanjiejian",
  "status": "success",
  "synced_scenes": 5
}
```

或：

```json
{
  "story_id": "caochuanjiejian",
  "status": "partial",
  "results": [
    {
      "scene_index": 1,
      "status": "success",
      "audio_url": "..."
    }
  ]
}
```

## Subcommand Details

### `generate-story`

用途：根据主题生成完整故事文档。

输入：

- `--topic <text>` 必填
- `--output <path>` 可选

输出：

- 标准化故事文档 JSON

行为：

- 调用 Gemini 生成结果
- 清理 Markdown 代码块
- 解析并标准化为统一故事对象
- 清洗场景标题前缀

### `refine-story`

用途：基于既有故事和修订指令生成更新后的故事文档。

输入：

- `--input <path>` 必填，指向故事 JSON
- `--instructions <text>` 或 `--instructions-file <path>` 二选一
- `--output <path>` 可选

输出：

- 完整的新故事文档 JSON，而不是 patch

行为：

- 读取既有故事
- 调用 Gemini refine prompt
- 兼容对象格式和旧数组格式返回值
- 重新标准化结果

### `sync-db`

用途：将确认后的故事写入 Supabase。

输入：

- `--input <path>` 必填，指向故事 JSON
- `--story-id <id>` 可选，默认取故事文档中的 `id`
- `--category-id <id>` 可选，默认取故事文档中的 `category_id`
- `--title <text>` 可选，默认取故事文档中的 `title`
- `--output <path>` 可选

输出：

- 同步结果 JSON，包括 `story_id`、同步的场景数、选项数、是否成功

行为：

- upsert `stories`
- 按顺序 upsert `scenes`
- 刷新并重建 `scene_options`
- 明确报告已同步数量

### `generate-image-prompts`

用途：根据故事文档生成所有场景的图片提示词。

输入：

- `--input <path>` 必填，指向故事 JSON
- `--output <path>` 可选

输出：

- 提示词 JSON 数组

行为：

- 调用 Gemini prompt model
- 清理代码块
- 校验返回值必须为数组

### `generate-audio`

用途：为故事所有场景和结局申请或轮询旁白音频。

输入：

- `--input <path>` 可选，故事 JSON
- `--story-id <id>` 必填或可从输入推导
- `--include-ending` 默认开启
- `--poll` 默认开启
- `--output <path>` 可选

输出：

- 每个场景音频状态的结果 JSON

行为：

- 优先从输入故事文件读取场景列表
- 若未提供 `--input`，则按 `story_id` 从 Supabase 读取已同步场景
- 查询既有 `scene_narrations`
- 对缺失项调用 `request-narration`
- 按限流规则批量发送
- 可选轮询到稳定状态

### `generate-images`

用途：为故事所有场景生成图片并在完成后可选发布。

输入：

- `--story-input <path>` 必填
- `--prompts-input <path>` 必填
- `--story-id <id>` 可选
- `--publish` 可选
- `--output <path>` 可选

输出：

- 每个场景的图片生成结果 JSON

行为：

- 查询既有 `scene_images`
- 为缺失项逐张请求 `generate-image`
- 允许读取人工修改后的 prompt 文件
- 如果指定 `--publish`，则在全成功后更新 `stories.is_ready`

## Architecture

### Core Refactor

将 React 组件里的业务逻辑抽出为以下层级：

- `src/core/types.ts`
  - 定义统一故事文档、场景、选项、提示词、结果类型
- `src/core/env.ts`
  - 统一读取 Gemini 和 Supabase 所需环境变量
- `src/core/story.ts`
  - 负责标准化、解析、兼容旧格式、标题清洗
- `src/core/gemini.ts`
  - 负责 `generateStory`、`refineStoryDocument`、`generateScenePrompts`
- `src/core/supabase.ts`
  - 负责创建服务客户端及复用查询逻辑
- `src/core/sync.ts`
  - 负责数据库同步
- `src/core/audio.ts`
  - 负责音频请求与轮询
- `src/core/images.ts`
  - 负责图片请求与发布
- `src/cli/*.ts`
  - 负责参数解析、调用核心模块、写 `stdout/stderr`

### Why Shared Core Matters

- CLI 和 React 共用一套数据模型与副作用逻辑
- 后续 UI 重构时不需要再次搬运逻辑
- 更容易为核心层补单元测试

## Environment Strategy

CLI 不再依赖 `import.meta.env`，而改为在共享核心层中优先读取 `process.env`。

需要的环境变量包括：

- `GEMINI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

为兼容现有 Vite UI，读取策略为：

1. CLI 与共享核心优先读无前缀变量
2. 如存在 `VITE_*` 变量，也兼容读取
3. React 组件继续通过共享层访问，而不是直接访问 `import.meta.env`

## Packaging Strategy

第一阶段在 `story-manager/package.json` 中新增 CLI 入口：

- 新增 `bin` 字段，导出 `story-manager`
- 新增脚本：
  - `npm run cli -- <args>`
  - `npm run build:cli`

实现方式优先选择不新增大型依赖的轻量方案：

- 先用原生 `process.argv` 实现小型参数解析器
- 如实现复杂度明显上升，再考虑 `commander`

当前推荐先不引入额外 CLI 框架，保持体积和迁移成本可控。

## Compatibility with Existing UI

现有 React 组件在第一阶段保留，但逐步改为：

- 组件只负责表单状态和展示
- 业务逻辑改为调用共享核心函数
- 历史上直接在组件内写的 JSON 清洗、Supabase upsert、外部请求逻辑迁到核心层

这意味着 CLI 改造不是旁路项目，而是一次顺带完成的业务逻辑解耦。

## Risks and Mitigations

### Risk: Existing Dirty UI Logic Makes Extraction Hard

缓解：

- 第一阶段优先抽出最独立、最稳定的逻辑
- 允许 UI 先通过适配层过渡，不强求一次性彻底重写

### Risk: Story Shape Is Inconsistent Between Steps

缓解：

- 统一定义故事文档格式
- 在读取层兼容旧数组格式
- 所有 CLI 输出都强制落为统一对象格式

### Risk: Lint Baseline Is Already Red

缓解：

- 本次改造以“新增文件和变更文件保持干净”为目标
- 不承诺一次性修复既有全部 lint 历史债务

### Risk: Audio/Image Commands Depend on Remote Services

缓解：

- 为副作用命令定义明确结果对象
- 支持局部重试
- 将“查询已有记录”与“触发新任务”分离成可测试函数

## Phase Plan

### Phase 1

优先落地：

- 统一类型与故事标准化逻辑
- `generate-story`
- `refine-story`
- `sync-db`
- `generate-image-prompts`

### Phase 2

随后接入：

- `generate-audio`
- `generate-images`
- 可选 `run-all`

## Acceptance Criteria

当以下条件成立时，认为第一阶段完成：

1. 在命令行中可以独立运行 `generate-story`、`refine-story`、`sync-db`、`generate-image-prompts`
2. 每个命令都能稳定输出机器可读 JSON
3. 现有 React 工作台仍可构建
4. CLI 与 React 共享核心业务模块，而不是两套重复逻辑
5. 中间产物可被人工修改后再继续下一步

## Open Questions Resolved

### Why Not Lead with `run-all`

因为用户明确希望 Agent 能查看中间结果并在 OpenClaw 中调整，所以第一阶段应优先优化“可暂停、可编辑、可恢复”的分步骤命令，而不是把 UI 流程重新封装成黑盒流水线。

### Why Not Delete the React App

因为当前 Web 工作台仍然是人工审阅与手工修订的高效入口。CLI 需要与它互补，而不是替代它。
