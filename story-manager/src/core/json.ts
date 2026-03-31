export function stripMarkdownCodeFence(value: string): string {
  const trimmed = value.trim()
  return trimmed.replace(/^```(?:json)?\s*|\s*```$/g, '').trim()
}

export function parseJsonDocument<T>(value: string): T {
  return JSON.parse(stripMarkdownCodeFence(value)) as T
}
