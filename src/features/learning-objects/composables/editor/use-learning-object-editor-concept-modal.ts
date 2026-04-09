import type { MaybeRefOrGetter, Ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { Fragment } from '@tiptap/pm/model'
import { ref } from 'vue'
import { useToast } from '@/shared/composables/use-toast'
import { useCreateConcept } from '../mutations/use-create-concept'
import { findFirstOccurrenceRange } from '@/features/content-generation/utils/find-first-occurrence'

function replaceRangeWithConceptNode(
  editor: Editor,
  from: number,
  to: number,
  attrs: { conceptId: number; term: string; definition: string }
) {
  const state = editor.state
  const conceptType = state.schema.nodes.concept
  if (!conceptType) return
  const slice = state.doc.slice(from, to)
  const inner =
    slice.content.size > 0
      ? slice.content
      : Fragment.from(state.schema.text(attrs.term))
  const node = conceptType.create(attrs, inner)
  editor.view.dispatch(state.tr.replaceWith(from, to, node))
}

export function useLearningObjectEditorConceptModal(
  learningObjectId: MaybeRefOrGetter<number>,
  editor: Ref<Editor | undefined>
) {
  const toast = useToast()
  const showConceptModal = ref(false)
  const conceptForm = ref({ term: '', definition: '' })
  const conceptSelectionRange = ref<{ from: number; to: number } | null>(null)
  const { mutateAsync: createConceptApi, isPending: isCreatingConcept } = useCreateConcept(learningObjectId)

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
      const attrs = {
        conceptId: data.id,
        term: data.term,
        definition: data.definition,
      }
      const savedRange = conceptSelectionRange.value
      if (savedRange) {
        editor.value.chain().focus().run()
        replaceRangeWithConceptNode(editor.value, savedRange.from, savedRange.to, attrs)
        toast.success('Concepto creado sobre el texto seleccionado. Guarda el objeto de aprendizaje para persistir.')
      } else {
        const range = findFirstOccurrenceRange(editor.value, data.term)
        if (range) {
          editor.value.chain().focus().run()
          replaceRangeWithConceptNode(editor.value, range.from, range.to, attrs)
          toast.success('Concepto creado y enlazado al texto existente. Guarda el objeto de aprendizaje para persistir.')
        } else {
          const sel = editor.value.state.selection
          const from = sel.from
          const to = sel.to
          editor.value.chain().focus().run()
          if (from !== to) {
            replaceRangeWithConceptNode(editor.value, from, to, attrs)
          } else {
            editor.value
              .chain()
              .focus()
              .insertContentAt(from, {
                type: 'concept',
                attrs,
                content: [{ type: 'text', text: data.term }],
              })
              .run()
          }
          toast.success('Concepto creado. Guarda el objeto de aprendizaje para persistir.')
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
