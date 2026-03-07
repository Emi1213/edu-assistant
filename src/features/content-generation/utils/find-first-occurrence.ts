import type { Editor } from '@tiptap/vue-3'

interface Segment {
  from: number
  to: number
  text: string
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function findFirstOccurrenceRange(
  editor: Editor,
  searchText: string
): { from: number; to: number } | null {
  const trimmed = searchText.trim()
  if (!trimmed) return null

  const segments: Segment[] = []
  const doc = editor.state.doc

  doc.descendants((node, pos) => {
    if (node.isText) {
      const text = node.text ?? ''
      if (text.length > 0) {
        segments.push({
          from: pos + 1,
          to: pos + node.nodeSize,
          text,
        })
      }
    }
  })

  const fullText = segments.map((s) => s.text).join('')
  const pattern = new RegExp(`\\b${escapeRegex(trimmed)}\\b`, 'i')
  const match = fullText.match(pattern)
  if (!match || match.index === undefined) return null

  const startChar = match.index
  const endChar = startChar + match[0].length
  let acc = 0
  let from = 0
  let to = 0
  for (const seg of segments) {
    const segEnd = acc + seg.text.length
    if (acc <= startChar && startChar < segEnd) {
      from = seg.from + (startChar - acc)
    }
    if (acc < endChar && endChar <= segEnd) {
      to = seg.from + (endChar - acc)
      break
    }
    acc = segEnd
  }
  return { from, to }
}
