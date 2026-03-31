# OpenClaw Story Normalization CLI Design

## Summary

当前 `story-manager` 的 `generate-story` 和 `refine-story` 仍然是“CLI 调 Gemini”。但用户的真实目标是：

- 让 OpenClaw 自己生成故事 JSON
- 让 OpenClaw 自己按要求重写和优化 JSON
- `story-manager` CLI 负责把这些 JSON 标准化、校验、落盘，并继续衔接后续的图片提示词和数据库同步步骤

因此，本次改造不替换现有 Gemini 命令，而是在其旁边补一组 OpenClaw-first 命令。

## Goals

1. 保留现有 `generate-story` / `refine-story` 的 Gemini 工作流
2. 新增一组适合 OpenClaw 自产出 JSON 的 CLI 命令
3. 让 OpenClaw 可以通过文件或 `stdin` 把原始故事 JSON 交给 CLI
4. 让 CLI 能输出稳定、可机读的校验结果，方便 Agent 判断是否需要修正
5. 让后续 `generate-image-prompts` 和 `sync-db` 继续使用统一的 `StoryDocument`

## Non-Goals

- 本次不删除现有 Gemini 命令
- 本次不扩展音频和图片生成命令
- 本次不改变既有 `StoryDocument` 结构

## Approaches

### Approach 1: 直接把 `generate-story` / `refine-story` 改成“不再调用 Gemini”

优点：

- 命令名看起来最直观

缺点：

- 会破坏当前已经可用的 Gemini 模式
- 用户之后如果仍想保留“CLI 直接调用 Gemini”的能力，会被迫重新找替代方案

### Approach 2: 保留 Gemini 命令，新增 OpenClaw-first 命令

优点：

- 兼容现有能力
- OpenClaw 和 Gemini 两种模式可以并存
- 风险最小，最适合渐进迁移

缺点：

- 命令数量会增加

### Approach 3: 新增一个泛化的 `process-story-json` 命令，把标准化、校验、修复都塞进去

优点：

- 命令数量最少

缺点：

- 职责太混
- OpenClaw 很难明确知道当前是在“标准化”还是“校验”
- 出错后修复路径不清楚

## Recommendation

采用 **Approach 2**。

保留：

- `generate-story`
- `refine-story`

新增：

- `normalize-story`
- `validate-story`

这样 OpenClaw 自己负责“创作”和“改写”，CLI 负责“把结果收口成规范数据”和“检查是否可进入下一步”。

## Command Design

### `normalize-story`

用途：

- 接收 OpenClaw 产出的原始故事 JSON
- 转换为标准 `StoryDocument`
- 对标题、场景结构、选项结构做统一清洗
- 根据命令行参数补齐元数据覆盖项

输入：

```bash
story-manager normalize-story --input <path|->
```

可选覆盖项：

```bash
--story-id <id>
--category-id <id>
--title <title>
--description <desc>
--ending-title <title>
--ending-description <desc>
--output <path>
```

支持的输入形态：

1. 完整 `StoryDocument`
2. 仅有 `scenes` 的对象
3. 旧版裸场景数组

输出：

- 标准化后的 `StoryDocument`

### `validate-story`

用途：

- 检查故事 JSON 是否已经满足后续流程要求
- 让 OpenClaw 在调用 `generate-image-prompts` 或 `sync-db` 前先知道哪里不合法

输入：

```bash
story-manager validate-story --input <path|->
```

可选项：

```bash
--format json
```

默认输出：

- 简短文本结果，适合人读

`--format json` 时输出：

```json
{
  "ok": false,
  "errors": [
    "Missing story id",
    "Scene 2 has no choices"
  ],
  "warnings": [
    "Scene 1 title was auto-normalized"
  ]
}
```

## Validation Rules

第一阶段的校验规则：

1. `id` 非空
2. `category_id` 非空
3. `title` 非空
4. `ending_title` 非空
5. `ending_description` 非空
6. 至少有一个 scene
7. 每个 scene 必须有：
   - `id`
   - `title`
   - `narrative`
   - `choices`
8. 每个 choice 必须有：
   - `text`
   - `is_correct`
   - `feedback`

说明：

- `normalize-story` 负责“尽量修正和补齐”
- `validate-story` 负责“明确告诉 OpenClaw 还有哪些地方没达标”

## OpenClaw Workflow

推荐流程：

1. OpenClaw 自己生成故事 JSON
2. 调 `normalize-story` 得到标准化文档
3. 调 `validate-story --format json`
4. 如果校验失败，OpenClaw 自己修正 JSON 后再重复 2-3
5. 校验通过后，再调用：
   - `generate-image-prompts`
   - `sync-db`

优化故事时：

1. OpenClaw 读取当前 `story.json`
2. OpenClaw 自己按用户要求重写 JSON
3. 把重写结果再次送入 `normalize-story`
4. 再跑一次 `validate-story`

## Why This Fits OpenClaw Better

- OpenClaw 不必把“生成能力”委托给 Gemini
- CLI 保持为“严格输入输出边界”和“标准化器”
- 出错时是结构性错误，不是黑盒模型调用错误
- 更适合 Agent 循环修正

## File and Module Changes

新增核心模块：

- `story-manager/src/core/story-validation.ts`
  - 定义校验规则和返回结果

新增 CLI 命令：

- `story-manager/src/cli/commands/normalize-story.ts`
- `story-manager/src/cli/commands/validate-story.ts`

可能扩展现有模块：

- `story-manager/src/cli/io.ts`
  - 读取原始 JSON
  - 输出文本或 JSON 结果
- `story-manager/src/core/story-document.ts`
  - 补一个更适合“对象里有 scenes”场景的标准化入口

## Acceptance Criteria

1. OpenClaw 可以把自己生成的故事 JSON 通过 `stdin` 或文件交给 `normalize-story`
2. `normalize-story` 输出标准 `StoryDocument`
3. `validate-story --format json` 能给出稳定的 `ok/errors/warnings` 结果
4. `generate-image-prompts` 和 `sync-db` 继续可以消费 `normalize-story` 的输出
5. 现有 `generate-story` / `refine-story` 仍然保持可用
