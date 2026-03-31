# CLI Env Unification Design

## Background

`story-manager` 现在已经有两套环境变量使用方式：

- 前端通过 `import.meta.env` 读取 `VITE_*`
- CLI 和 core service 通过 `process.env` 读取运行时变量

但 CLI 目前有两个实际问题：

1. 不会自动加载 worktree 上级的 `.env`
2. Supabase key 只兼容 anon key 命名，不兼容项目当前常用的 `SUPABASE_SERVICE_ROLE_KEY`

与此同时，`story-manager/scripts` 下又各自维护了几份手写 `.env` loader，逻辑重复且不一致。

## Goal

为 `story-manager` 建立一套统一的运行时 env 读取机制，覆盖：

- CLI 入口
- core service 的 env 解析
- `story-manager/scripts` 下直接运行的脚本

让 OpenClaw 或命令行用户在默认情况下可以直接复用 worktree 上级 `.env`，并且让 Supabase service role key 成为一等支持的变量名。

## Non-Goals

- 不修改前端 Vite 侧的 `import.meta.env` 用法
- 不引入新的第三方 env 依赖
- 不改动已有命令的业务行为
- 不改变显式 shell 环境变量优先于 `.env` 的原则

## Problems To Solve

### Problem 1: CLI 不自动读取 `.env`

当前 CLI 启动方式是：

```text
tsx src/cli/main.ts
```

CLI 运行时只读取 `process.env`，不会像 Vite 构建时那样自动加载 `.env`。这意味着：

- `.env` 文件里虽然有 `VITE_SUPABASE_URL`
- 但如果 shell 没有显式导出它，CLI 仍然会认为变量缺失

### Problem 2: Supabase key 命名不统一

项目当前 `.env` 中常见的是：

- `SUPABASE_SERVICE_ROLE_KEY`

而当前 CLI 的 Supabase client 只认：

- `SUPABASE_ANON_KEY`
- `VITE_SUPABASE_ANON_KEY`

这会让 `sync-db`、`import-images` 等写库命令无法直接复用现有 `.env`

### Problem 3: 脚本各自维护零散 loader

当前至少这些脚本都有自己的 env 解析：

- `scripts/migrate_audio.ts`
- `scripts/migrate_images.ts`
- `scripts/list_files.ts`

这会造成：

- 候选路径不一致
- 支持的变量别名不一致
- 维护成本高

## Design Principles

1. 显式 shell 环境变量优先于 `.env`
2. `.env` 只是兜底，不覆盖已有 `process.env`
3. CLI 和脚本共享同一套 env loader
4. 变量别名统一集中管理，不分散在各个命令文件里
5. 优先兼容当前仓库的实际使用方式，而不是要求用户迁移 `.env`

## Approaches Considered

### Approach A: 只扩展变量名兼容

做法：

- 在 `readRequiredEnv` 的调用处把 `SUPABASE_SERVICE_ROLE_KEY` 加入候选列表

优点：

- 改动最小

缺点：

- CLI 仍然不会自动加载 `.env`
- 脚本的重复 loader 仍然保留
- 只解决一半问题

### Approach B: 共享 env loader + 统一别名解析

做法：

- 新增统一的 env loader
- CLI 启动时先加载 env
- 脚本复用同一个 loader
- Supabase 和 Gemini 的变量候选统一在 core 层管理

优点：

- 一次解决 `.env` 自动加载和变量别名兼容
- 清理脚本中的重复逻辑
- 最符合 OpenClaw 的实际使用方式

缺点：

- 改动面略大于 A，但仍然可控

### Approach C: 引入 `dotenv`

做法：

- 新增依赖并在 CLI / 脚本入口统一 `dotenv.config()`

优点：

- 使用标准库

缺点：

- 需要新增依赖
- 对当前问题收益有限
- 仍然需要自己管理变量别名策略

## Recommendation

采用 **Approach B: 共享 env loader + 统一别名解析**。

这是当前最平衡的方案，既能马上让 `sync-db` / `import-images` 对现有 `.env` 直接可用，也能把脚本里的重复 env 逻辑收敛成一套。

## Architecture

### 1. Shared Env Loader

新增一个 core 级 env loader，例如：

```text
src/core/env-loader.ts
```

职责：

- 在固定候选路径中查找 `.env` / `.env.local`
- 解析 `KEY=value`
- 只给当前尚未存在的 `process.env[key]` 赋值
- 返回加载结果，便于测试

候选路径按“离执行入口近到远”的顺序：

- `story-manager/.env.local`
- `story-manager/.env`
- `story-manager/../.env.local`
- `story-manager/../.env`

说明：

- 这正好覆盖当前 worktree 结构下上级 `.env`
- 不继续向更高层递归，避免引入不透明的父目录污染

### 2. Centralized Env Name Resolution

保留现有：

```text
src/core/env.ts
```

但补充统一的候选命名策略。

#### Supabase URL

候选顺序：

1. `SUPABASE_URL`
2. `VITE_SUPABASE_URL`

#### Supabase Key

候选顺序：

1. `SUPABASE_SERVICE_ROLE_KEY`
2. `SUPABASE_ANON_KEY`
3. `VITE_SUPABASE_ANON_KEY`

理由：

- 对 CLI / scripts 来说，service role key 更符合写库、迁移、管理操作的权限需求
- 同时仍保留 anon key 兼容性

#### Gemini Key

保持现有策略：

1. `GEMINI_API_KEY`
2. `VITE_GEMINI_API_KEY`

### 3. CLI Integration

在 CLI 入口：

```text
src/cli/main.ts
```

启动时先调用共享 env loader，再继续执行命令解析。

效果：

- `generate-story`
- `refine-story`
- `generate-image-prompts`
- `sync-db`
- `import-images`

都会自动受益，无需每个子命令单独处理。

### 4. Script Integration

将以下脚本改为复用共享 env loader，而不是各自内联一份 parser：

- `scripts/migrate_audio.ts`
- `scripts/migrate_images.ts`
- `scripts/list_files.ts`
- `scripts/repair_endings.ts`
- `scripts/list-models.ts`

其中：

- 仍然允许脚本保留自己的额外提示或权限警告
- 但 env 加载和变量候选解析必须走统一入口

### 5. API Shape

共享 env loader 建议暴露两类能力：

#### `loadRuntimeEnv(...)`

用于执行一次 `.env` 文件加载

#### `readEnvValue(...)` / `readRequiredEnv(...)`

继续负责从 `process.env` 中读取候选变量

必要时可再新增一层专用 helper，例如：

- `readSupabaseUrl()`
- `readSupabaseKey()`
- `readGeminiApiKey()`

这样可以把“候选列表”从调用点收走，避免每个文件自己写一份数组。

## Error Handling

- 找不到 `.env` 文件时不报错，只继续使用现有 `process.env`
- 只有真正读取必需变量时，才抛出缺失错误
- 错误文案继续保持清晰，例如：
  - `Missing environment variable: SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY or VITE_SUPABASE_ANON_KEY`

## Compatibility Rules

1. 现有显式导出的环境变量保持最高优先级
2. 现有 `.env` 文件无需改名即可继续使用
3. 前端不受影响
4. OpenClaw 以后默认不需要手动 `source ../.env`

## Testing

需要新增测试覆盖：

### Env Loader

- 加载候选路径中的 `.env`
- `.env.local` 优先于 `.env`
- 不覆盖已存在的 `process.env`
- 多个候选文件可按顺序补齐变量

### Env Resolution

- Supabase key 优先使用 `SUPABASE_SERVICE_ROLE_KEY`
- 若无 service role，则退回 anon key
- Gemini 仍按当前顺序解析

### CLI Integration

- CLI 启动时会先加载 env，再执行命令

### Script Integration

- 至少让一个脚本测试或可验证结构证明其已复用共享 loader

## Success Criteria

- `sync-db` 和 `import-images` 能直接复用当前 worktree 上级 `.env`
- `.env` 中只有 `SUPABASE_SERVICE_ROLE_KEY` 时，CLI 仍能正常创建 Supabase client
- `story-manager/scripts` 不再保留多份手写 env parser
- 不破坏现有测试、CLI 构建和前端构建
