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
          from: pos,
          to: pos + node.nodeSize,
          text,
        })
      }
    }
  })

  const fullText = segments.map((s) => s.text).join('')

  const findMatchRange = (): { start: number; end: number } | null => {
    const asciiWord = new RegExp(`\\b${escapeRegex(trimmed)}\\b`, 'i')
    let m = fullText.match(asciiWord)
    if (m?.index !== undefined) {
      return { start: m.index, end: m.index + m[0].length }
    }
    try {
      const unicodeWord = new RegExp(
        `(?<![\\p{L}\\p{N}])${escapeRegex(trimmed)}(?![\\p{L}\\p{N}])`,
        'iu'
      )
      m = fullText.match(unicodeWord)
      if (m?.index !== undefined) {
        return { start: m.index, end: m.index + m[0].length }
      }
    } catch {
      // engines sin flag u
    }
    const lower = fullText.toLowerCase()
    const q = trimmed.toLowerCase()
    let fromIdx = 0
    while (fromIdx < fullText.length) {
      const i = lower.indexOf(q, fromIdx)
      if (i === -1) return null
      const before = i === 0 ? '\u0000' : fullText[i - 1]!
      const after = i + q.length >= fullText.length ? '\u0000' : fullText[i + q.length]!
      const isWordChar = (c: string) => /[\p{L}\p{N}]/u.test(c)
      if (!isWordChar(before) && !isWordChar(after)) {
        return { start: i, end: i + q.length }
      }
      fromIdx = i + 1
    }
    return null
  }

  const range = findMatchRange()
  if (!range) return null

  const startChar = range.start
  const endChar = range.end
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
