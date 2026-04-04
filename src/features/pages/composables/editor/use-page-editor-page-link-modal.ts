import type { Ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { Fragment } from '@tiptap/pm/model'
import { ref, computed, watch, unref } from 'vue'
import { useToast } from '@/shared/composables/use-toast'
import { useLearningObjects } from '../queries/use-pages'
import type { MaybeRef } from 'vue'

function replaceRangeWithPageLink(
  editor: Editor,
  from: number,
  to: number,
  attrs: { targetPageId: number; mentionText: string }
) {
  const state = editor.state
  const pageLinkType = state.schema.nodes.pageLink
  if (!pageLinkType) return
  const slice = state.doc.slice(from, to)
  const actualText = state.doc.textBetween(from, to)
  const inner =
    slice.content.size > 0
      ? slice.content
      : Fragment.from(state.schema.text(attrs.mentionText))
  const node = pageLinkType.create(
    {
      targetPageId: attrs.targetPageId,
      mentionText: actualText || attrs.mentionText,
    },
    inner
  )
  editor.view.dispatch(state.tr.replaceWith(from, to, node))
}

export function usePageEditorPageLinkModal(
  editor: Ref<Editor | undefined>,
  learningObjectId: MaybeRef<number>,
  moduleId: MaybeRef<number>
) {
  const toast = useToast()
  const showPageLinkModal = ref(false)
  const pageLinkForm = ref<{ targetPageId: number | null; mentionText: string }>({
    targetPageId: null,
    mentionText: '',
  })
  const pageLinkSelectionRange = ref<{ from: number; to: number } | null>(null)

  const learningObjectsQueryParams = computed(() => ({
    moduleId: unref(moduleId),
    page: 1,
    limit: 100,
  }))
  const { data: learningObjectsResponse } = useLearningObjects(learningObjectsQueryParams)
  const modulePages = computed(
    () =>
      learningObjectsResponse.value?.records?.filter((p: { id: number }) => p.id !== unref(learningObjectId)) ?? []
  )

  watch(
    () => pageLinkForm.value.targetPageId,
    (newId) => {
      if (newId == null) return
      const page = modulePages.value.find((p: { id: number }) => p.id === newId)
      if (page?.title) {
        pageLinkForm.value.mentionText = page.title
      }
    }
  )

  function openPageLinkModal() {
    const sel = editor.value?.state.selection
    const selectedText =
      sel && sel.from !== sel.to
        ? editor.value?.state.doc.textBetween(sel.from, sel.to) ?? ''
        : ''
    pageLinkForm.value = { targetPageId: null, mentionText: selectedText.trim() }
    pageLinkSelectionRange.value =
      sel && sel.from !== sel.to ? { from: sel.from, to: sel.to } : null
    showPageLinkModal.value = true
  }

  function closePageLinkModal() {
    showPageLinkModal.value = false
    pageLinkForm.value = { targetPageId: null, mentionText: '' }
    pageLinkSelectionRange.value = null
  }

  function submitPageLink() {
    if (
      pageLinkForm.value.targetPageId == null ||
      !pageLinkForm.value.mentionText.trim() ||
      !editor.value
    )
      return
    const savedRange = pageLinkSelectionRange.value
    const from = savedRange ? savedRange.from : editor.value.state.selection.from
    const to = savedRange ? savedRange.to : editor.value.state.selection.to
    const attrs = {
      targetPageId: pageLinkForm.value.targetPageId,
      mentionText: pageLinkForm.value.mentionText.trim(),
    }
    editor.value.chain().focus().run()
    if (from !== to) {
      replaceRangeWithPageLink(editor.value, from, to, attrs)
    } else {
      editor.value
        .chain()
        .focus()
        .insertContentAt(from, {
          type: 'pageLink',
          attrs,
          content: [{ type: 'text', text: attrs.mentionText }],
        })
        .run()
    }
    closePageLinkModal()
    toast.success('Enlace insertado. Guarda el objeto de aprendizaje para persistir.')
  }

  return {
    showPageLinkModal,
    pageLinkForm,
    modulePages,
    openPageLinkModal,
    closePageLinkModal,
    submitPageLink,
  }
}
