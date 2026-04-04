
export function stripImageSuggestionsFromDoc(doc: unknown): unknown {
  if (doc == null || doc === '') return doc
  if (typeof doc === 'string') return doc
  if (typeof doc !== 'object' || doc === null) return doc
  const d = doc as Record<string, unknown>
  if (d.type === 'doc' && Array.isArray(d.content)) {
    return {
      ...d,
      content: d.content
        .map((n) => stripNode(n))
        .filter((n): n is NonNullable<typeof n> => n != null),
    }
  }
  return doc
}

function stripNode(node: unknown): unknown {
  if (node == null || typeof node !== 'object') return node
  const n = node as Record<string, unknown>
  if (n.type === 'imageSuggestion') return null
  const out = { ...n }
  if (Array.isArray(n.content)) {
    out.content = (n.content as unknown[])
      .map((c) => stripNode(c))
      .filter((c) => c != null)
  }
  return out
}
