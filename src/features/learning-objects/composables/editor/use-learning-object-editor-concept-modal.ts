import type { MaybeRefOrGetter, Ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { Fragment } from '@tiptap/pm/model'
import { computed, ref, toValue } from 'vue'
import { useToast } from '@/shared/composables/use-toast'
import { useCreateConcept } from '../mutations/use-create-concept'
import { useGenerateConceptDefinition } from '@/features/content-generation/composables/mutations/use-generate-concept-definition'
import { findFirstOccurrenceRange } from '@/features/content-generation/utils/find-first-occurrence'
import type { LearningObject } from '../../types'
import { findBlockIdForEditorPosition } from '../../utils/find-block-id-for-editor-position'

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
  editor: Ref<Editor | undefined>,
  learningObject: MaybeRefOrGetter<LearningObject | null | undefined>
) {
  const toast = useToast()
  const showConceptModal = ref(false)
  const conceptForm = ref({ term: '', definition: '' })
  const conceptSelectionRange = ref<{ from: number; to: number } | null>(null)
  const conceptEditingState = ref<{ from: number; to: number; conceptId: number } | null>(null)
  const { mutateAsync: createConceptApi, isPending: isCreatingConcept } = useCreateConcept(learningObjectId)
  const { mutateAsync: requestConceptDefinition, isPending: isGeneratingConceptDefinition } =
    useGenerateConceptDefinition()

  function openConceptModal() {
    const sel = editor.value?.state.selection
    const selectedText =
      sel && sel.from !== sel.to
        ? editor.value?.state.doc.textBetween(sel.from, sel.to) ?? ''
        : ''
    conceptForm.value = { term: selectedText.trim(), definition: '' }
    conceptSelectionRange.value =
      sel && sel.from !== sel.to ? { from: sel.from, to: sel.to } : null
    conceptEditingState.value = null
    showConceptModal.value = true
  }

  function openConceptModalForEditAtPos(pos: number) {
    if (!editor.value) return
    const state = editor.value.state
    const conceptType = state.schema.nodes.concept
    if (!conceptType) return
    const directNode = state.doc.nodeAt(pos)
    const nodeAtPos = directNode?.type === conceptType ? directNode : state.doc.nodeAt(pos - 1)
    const from = directNode?.type === conceptType ? pos : pos - 1
    if (!nodeAtPos || nodeAtPos.type !== conceptType) return

    conceptForm.value = {
      term: String(nodeAtPos.attrs?.term ?? nodeAtPos.textContent ?? '').trim(),
      definition: String(nodeAtPos.attrs?.definition ?? '').trim(),
    }
    conceptSelectionRange.value = null
    conceptEditingState.value = {
      from,
      to: from + nodeAtPos.nodeSize,
      conceptId: Number(nodeAtPos.attrs?.conceptId ?? 0) || 0,
    }
    showConceptModal.value = true
  }

  function closeConceptModal() {
    showConceptModal.value = false
    conceptForm.value = { term: '', definition: '' }
    conceptSelectionRange.value = null
    conceptEditingState.value = null
  }

  async function generateConceptDefinitionWithAi(language = 'es') {
    const term = conceptForm.value.term.trim()
    if (!term) {
      toast.error('Escribe un término para generar la definición.')
      return
    }
    if (!editor.value) return

    const lo = toValue(learningObject) ?? undefined
    const pos = editor.value.state.selection.from
    const blockId = findBlockIdForEditorPosition(editor.value, lo, pos)
    if (blockId == null) {
      toast.error('No se pudo determinar el bloque. Guarda el objeto de aprendizaje e inténtalo de nuevo.')
      return
    }

    try {
      const data = await requestConceptDefinition({
        selectedText: term,
        blockId,
        language,
      })
      if (data?.definition) {
        conceptForm.value.definition = data.definition.trim()
        if (data.term?.trim()) {
          conceptForm.value.term = data.term.trim()
        }
        toast.success('Definición generada')
      }
    } catch (err: unknown) {
      toast.error((err as Error)?.message ?? 'Error al generar la definición')
    }
  }

  async function submitConcept() {
    if (!conceptForm.value.term.trim() || !editor.value) return
    const editing = conceptEditingState.value
    if (editing) {
      const conceptType = editor.value.state.schema.nodes.concept
      if (!conceptType) return
      const attrs = {
        conceptId: editing.conceptId,
        term: conceptForm.value.term.trim(),
        definition: conceptForm.value.definition.trim(),
      }
      const node = conceptType.create(attrs, Fragment.from(editor.value.state.schema.text(attrs.term)))
      editor.value.view.dispatch(editor.value.state.tr.replaceWith(editing.from, editing.to, node))
      toast.success('Concepto actualizado. Guarda el objeto de aprendizaje para persistir.')
      closeConceptModal()
      return
    }
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
    openConceptModalForEditAtPos,
    closeConceptModal,
    submitConcept,
    isCreatingConcept,
    generateConceptDefinitionWithAi,
    isGeneratingConceptDefinition,
    isEditingConcept: computed(() => conceptEditingState.value != null),
    conceptEditingState,
  }
}
