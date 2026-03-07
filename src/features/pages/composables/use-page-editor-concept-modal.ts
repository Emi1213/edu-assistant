import type { Ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useCreateConcept } from './mutations/use-create-concept'
import { findFirstOccurrenceRange } from '@/features/content-generation/utils/find-first-occurrence'

export function usePageEditorConceptModal(pageId: number, editor: Ref<Editor | undefined>) {
  const toast = useToast()
  const showConceptModal = ref(false)
  const conceptForm = ref({ term: '', definition: '' })
  const conceptSelectionRange = ref<{ from: number; to: number } | null>(null)
  const { mutateAsync: createConceptApi, isPending: isCreatingConcept } = useCreateConcept(pageId)

  function openConceptModal() {
    const sel = editor.value?.state.selection
    const selectedText =
      sel && sel.from !== sel.to
        ? editor.value?.state.doc.textBetween(sel.from, sel.to) ?? ''
        : ''
    conceptForm.value = { term: selectedText.trim(), definition: '' }
    conceptSelectionRange.value =
      sel && sel.from !== sel.to ? { from: sel.from, to: sel.to } : null
    showConceptModal.value = true
  }

  function closeConceptModal() {
    showConceptModal.value = false
    conceptForm.value = { term: '', definition: '' }
    conceptSelectionRange.value = null
  }

  async function submitConcept() {
    if (!conceptForm.value.term.trim() || !editor.value) return
    try {
      const data = await createConceptApi({
        term: conceptForm.value.term.trim(),
        definition: conceptForm.value.definition.trim(),
      })
      if (!data) return
      const conceptNode = {
        type: 'concept' as const,
        attrs: {
          conceptId: data.id,
          term: data.term,
          definition: data.definition,
        },
      }
      const savedRange = conceptSelectionRange.value
      if (savedRange) {
        editor.value
          .chain()
          .focus()
          .deleteRange({ from: savedRange.from, to: savedRange.to })
          .insertContentAt(savedRange.from, conceptNode)
          .run()
        toast.success('Concepto creado sobre el texto seleccionado. Guarda la página para persistir.')
      } else {
        const range = findFirstOccurrenceRange(editor.value, data.term)
        if (range) {
          editor.value
            .chain()
            .focus()
            .deleteRange({ from: range.from, to: range.to })
            .insertContentAt(range.from, conceptNode)
            .run()
          toast.success('Concepto creado y enlazado al texto existente. Guarda la página para persistir.')
        } else {
          const sel = editor.value.state.selection
          const from = sel.from
          const to = sel.to
          if (from !== to) {
            editor.value.chain().focus().deleteRange({ from, to }).run()
          }
          editor.value.chain().focus().insertContentAt(from, conceptNode).run()
          toast.success('Concepto creado. Guarda la página para persistir.')
        }
      }
      closeConceptModal()
    } catch (err: unknown) {
      toast.error((err as Error)?.message ?? 'Error al crear el concepto')
    }
  }

  return {
    showConceptModal,
    conceptForm,
    openConceptModal,
    closeConceptModal,
    submitConcept,
    isCreatingConcept,
  }
}
