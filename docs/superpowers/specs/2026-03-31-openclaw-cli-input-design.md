# OpenClaw CLI Input Design

## Summary

让 `story-manager` 的 `generate-story` 和 `refine-story` 更适合在 OpenClaw 这类 Agent 中调用，重点解决长文本输入、标准输入管道和稳定错误输出。

## Goals

1. `generate-story` 同时支持 `--topic` 和 `--topic-file`
2. `--topic-file -` 支持从 `stdin` 读取主题或较长任务描述
3. `refine-story` 明确把 `--instructions-file -` 作为一等用法支持
4. CLI 顶层捕获异常，输出简短稳定的 Agent 友好错误
5. 不破坏现有 `--topic`、`--instructions`、`--output` 用法

## Non-Goals

- 本次不新增音频或图片相关 CLI 命令
- 本次不改故事 JSON 数据结构
- 本次不引入复杂 CLI 框架

## Design

### Input Strategy

`generate-story`:

```bash
story-manager generate-story --topic "草船借箭"
story-manager generate-story --topic-file topic.txt
story-manager generate-story --topic-file -
```

`refine-story`:

```bash
story-manager refine-story --input story.json --instructions "让语气更紧张"
story-manager refine-story --input story.json --instructions-file notes.txt
story-manager refine-story --input story.json --instructions-file -
```

约束：

- `generate-story` 必须提供 `--topic` 或 `--topic-file` 之一
- 若两者同时提供，优先使用直接参数 `--topic`
- `refine-story` 继续要求 `--instructions` 或 `--instructions-file` 之一
- `--input -` 继续可用于从 `stdin` 读取故事 JSON，但和 `--instructions-file -` 同时使用时不建议，避免两个输入都抢占同一个 `stdin`

### Error Format

顶层 CLI 捕获未处理异常，统一输出：

```text
CLI_ERROR: <message>
```

并以 exit code `1` 返回。

这样 Agent 既能读到稳定错误前缀，也不会被一大段 stack trace 干扰。

## Acceptance Criteria

1. `generate-story --topic-file <path>` 可成功读取主题
2. `generate-story --topic-file -` 可成功从 `stdin` 读取主题
3. `refine-story --instructions-file -` 在 help 与用法说明中是明确支持的
4. 缺参数或运行时错误时，CLI 输出稳定前缀 `CLI_ERROR:`
5. 现有测试、CLI 构建、Web 构建继续通过
