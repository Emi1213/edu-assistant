import type { Ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { ref, computed, watch, unref } from 'vue'
import { useToast } from 'vue-toastification'
import { usePages } from './queries/use-pages'
import type { MaybeRef } from 'vue'

export function usePageEditorPageLinkModal(
  editor: Ref<Editor | undefined>,
  pageId: MaybeRef<number>,
  moduleId: MaybeRef<number>
) {
  const toast = useToast()
  const showPageLinkModal = ref(false)
  const pageLinkForm = ref<{ targetPageId: number | null; mentionText: string }>({
    targetPageId: null,
    mentionText: '',
  })
  const pageLinkSelectionRange = ref<{ from: number; to: number } | null>(null)

  const pagesQueryParams = computed(() => ({
    moduleId: unref(moduleId),
    page: 1,
    limit: 100,
  }))
  const { data: pagesResponse } = usePages(pagesQueryParams)
  const modulePages = computed(
    () =>
      pagesResponse.value?.records?.filter((p: { id: number }) => p.id !== unref(pageId)) ?? []
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
    if (from !== to) {
      editor.value.chain().focus().deleteRange({ from, to }).run()
    }
    editor.value
      .chain()
      .focus()
      .insertContentAt(from, {
        type: 'pageLink',
        attrs: {
          targetPageId: pageLinkForm.value.targetPageId,
          mentionText: pageLinkForm.value.mentionText.trim(),
        },
      })
      .run()
    closePageLinkModal()
    toast.success('Enlace insertado. Guarda la página para persistir.')
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
