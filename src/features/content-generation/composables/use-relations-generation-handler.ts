import type { Ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { Fragment } from '@tiptap/pm/model'
import { useExtractRelations } from './mutations/use-extract-relations'
import { findFirstOccurrenceRange } from '../utils/find-first-occurrence'
import type { ExtractRelationsRelation } from '../types'

function normalizeRelations(raw: readonly unknown[]): ExtractRelationsRelation[] {
  return raw
    .map((r) => {
      const o = r as Record<string, unknown>
      return {
        targetPageId: Number(o.targetPageId ?? o.target_page_id ?? 0),
        mentionText: String(o.mentionText ?? o.mention_text ?? '').trim(),
      }
    })
    .filter((r) => r.targetPageId > 0 && r.mentionText.length > 0)
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
  const normalized = normalizeRelations(relations)
  const candidates: { from: number; to: number; targetPageId: number }[] = []

  for (const item of normalized) {
    const { targetPageId, mentionText } = item
    const range = findFirstOccurrenceRange(editor, mentionText)
    if (range) {
      candidates.push({
        from: range.from,
        to: range.to,
        targetPageId,
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
    const state = editor.state
    const slice = state.doc.slice(r.from, r.to)
    if (slice.content.size === 0) continue
    const pageLinkType = state.schema.nodes.pageLink
    if (!pageLinkType) continue
    const actualText = state.doc.textBetween(r.from, r.to)
    const node = pageLinkType.create(
      {
        targetPageId: r.targetPageId,
        mentionText: actualText,
      },
      slice.content.size > 0
        ? slice.content
        : Fragment.from(state.schema.text(actualText))
    )
    editor.view.dispatch(state.tr.replaceWith(r.from, r.to, node))
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
