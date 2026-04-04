import type { Ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { useExtractConcepts } from './mutations/use-extract-concepts'
import { findFirstOccurrenceRange } from '../utils/find-first-occurrence'
import type { ExtractConceptsTerm } from '../types'

function rangesOverlap(
  a: { from: number; to: number },
  b: { from: number; to: number }
): boolean {
  return a.from < b.to && b.from < a.to
}

function applyConceptsToEditor(
  editor: Editor,
  terms: ExtractConceptsTerm[],
  startConceptId: number = 1
): void {
  const candidates: { from: number; to: number; conceptId: number; term: string; definition: string }[] = []

  for (let i = 0; i < terms.length; i++) {
    const item = terms[i]
    if (!item) continue
    const { term, definition } = item
    const conceptId = startConceptId + i
    const range = findFirstOccurrenceRange(editor, term)
    if (range) {
      candidates.push({
        from: range.from,
        to: range.to,
        conceptId,
        term,
        definition,
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
    const conceptType = state.schema.nodes.concept
    if (!conceptType) continue
    const actualTerm = state.doc.textBetween(r.from, r.to)
    const conceptNode = conceptType.create(
      {
        conceptId: r.conceptId,
        definition: r.definition,
        term: actualTerm || r.term,
      },
      slice.content
    )
    editor.view.dispatch(state.tr.replaceWith(r.from, r.to, conceptNode))
  }
}

export function useConceptsGenerationHandler(
  learningObjectId: number,
  editor: Ref<Editor | undefined>
) {
  const { mutate: extractConcepts, isPending: isExtracting } = useExtractConcepts()

  const generateConcepts = (onSuccess?: () => void, onError?: (message: string) => void) => {
    if (!editor.value) {
      onError?.('Editor no disponible')
      return
    }

    extractConcepts(
      { learningObjectId },
      {
        onSuccess: (data) => {
          if (!data?.terms?.length) {
            onSuccess?.()
            return
          }
          applyConceptsToEditor(editor.value!, data.terms)
          onSuccess?.()
        },
        onError: (error: Error) => {
          onError?.(error.message ?? 'Error al extraer conceptos')
        },
      }
    )
  }

  return {
    generateConcepts,
    isExtracting,
  }
}
