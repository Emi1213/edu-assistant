import type { Ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { Fragment } from '@tiptap/pm/model'
import { useExtractRelations } from './mutations/use-extract-relations'
import { findFirstOccurrenceRange } from '../utils/find-first-occurrence'
import type { ExtractRelationsRelation } from '../types'

function normalizeRelations(raw: readonly unknown[]): ExtractRelationsRelation[] {
  return raw
    .map((rawRelation) => {
      const relationData = rawRelation as Record<string, unknown>
      return {
        targetPageId: Number(relationData.targetPageId ?? relationData.target_page_id ?? 0),
        mentionText: String(relationData.mentionText ?? relationData.mention_text ?? '').trim(),
      }
    })
    .filter((relation) => relation.targetPageId > 0 && relation.mentionText.length > 0)
}

function rangesOverlap(
  rangeA: { from: number; to: number },
  rangeB: { from: number; to: number }
): boolean {
  return rangeA.from < rangeB.to && rangeB.from < rangeA.to
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
  for (const candidate of candidates) {
    const overlaps = replacements.some((added) => rangesOverlap(candidate, added))
    if (!overlaps) replacements.push(candidate)
  }

  replacements.sort((a, b) => b.from - a.from)

  for (const replacement of replacements) {
    const state = editor.state
    const slice = state.doc.slice(replacement.from, replacement.to)
    if (slice.content.size === 0) continue
    const pageLinkType = state.schema.nodes.pageLink
    if (!pageLinkType) continue
    const actualText = state.doc.textBetween(replacement.from, replacement.to)
    const node = pageLinkType.create(
      {
        targetPageId: replacement.targetPageId,
        mentionText: actualText,
      },
      slice.content.size > 0
        ? slice.content
        : Fragment.from(state.schema.text(actualText))
    )
    editor.view.dispatch(state.tr.replaceWith(replacement.from, replacement.to, node))
  }
}

export function useRelationsGenerationHandler(
  learningObjectId: number,
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
      { learningObjectId },
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
