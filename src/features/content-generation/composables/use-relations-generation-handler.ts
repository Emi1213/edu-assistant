import type { Ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { useExtractRelations } from './mutations/use-extract-relations'
import { findFirstOccurrenceRange } from '../utils/find-first-occurrence'
import type { ExtractRelationsRelation } from '../types'

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

  const generateRelations = (
    onSuccess?: () => void,
    onError?: (message: string) => void,
    options?: { relations?: ExtractRelationsRelation[] }
  ) => {
    if (!editor.value) {
      onError?.('Editor no disponible')
      return
    }

    if (options?.relations?.length) {
      applyRelationsToEditor(editor.value, options.relations)
      onSuccess?.()
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
