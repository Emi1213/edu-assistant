import type { Ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { useExtractRelations } from './mutations/use-extract-relations'
import type { ExtractRelationsRelation } from '../types/content-generation.types'

interface Segment {
  from: number
  to: number
  text: string
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function findFirstOccurrenceRange(
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
          to: pos + node.nodeSize - 1,
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

function rangesOverlap(
  a: { from: number; to: number },
  b: { from: number; to: number }
): boolean {
  return a.from < b.to && b.from < a.to
}

function applyRelationsToEditor(
  editor: Editor,
  relations: ExtractRelationsRelation[]
): void {
  const candidates: { from: number; to: number; targetPageId: number; mentionText: string }[] = []

  for (const item of relations) {
    const { targetPageId, mentionText } = item
    const range = findFirstOccurrenceRange(editor, mentionText)
    if (range) {
      candidates.push({
        from: range.from,
        to: range.to,
        targetPageId,
        mentionText,
      })
    }
  }

  candidates.sort((a, b) => (b.to - b.from) - (a.to - a.from))
  const replacements: typeof candidates = []
  for (const r of candidates) {
    const overlaps = replacements.some((added) => rangesOverlap(r, added))
    if (!overlaps) replacements.push(r)
  }

  replacements.sort((a, b) => b.from - a.from)

  for (const r of replacements) {
    editor
      .chain()
      .focus()
      .deleteRange({ from: r.from, to: r.to })
      .insertContentAt(r.from, {
        type: 'pageLink',
        attrs: {
          targetPageId: r.targetPageId,
          mentionText: r.mentionText,
        },
      })
      .run()
  }
}

export function useRelationsGenerationHandler(
  pageId: number,
  editor: Ref<Editor | undefined>
) {
  const { mutate: extractRelations, isPending: isExtracting } = useExtractRelations()

  const generateRelations = (onSuccess?: () => void, onError?: (message: string) => void) => {
    if (!editor.value) {
      onError?.('Editor no disponible')
      return
    }

    extractRelations(
      { pageId },
      {
        onSuccess: (data) => {
          if (!data?.relations?.length) {
            onSuccess?.()
            return
          }
          applyRelationsToEditor(editor.value!, data.relations)
          onSuccess?.()
        },
        onError: (error: Error) => {
          onError?.(error.message ?? 'Error al extraer relaciones')
        },
      }
    )
  }

  return {
    generateRelations,
    isExtracting,
  }
}
