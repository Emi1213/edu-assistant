import type { Ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { ref, computed } from 'vue'
import { useLearningObjects } from '../queries/use-learning-objects'
import type { LearningObjectsQueryParams } from '../../types'

export function useLearningObjectEditorLinkModal(
  editor: Ref<Editor | undefined>,
   
  _learningObjectId: Ref<number>,
  moduleId: Ref<number>
) {
  const showPageLinkModal = ref(false)
  const pageLinkForm = ref<{ targetLearningObjectId: number | null; mentionText: string }>({
    targetLearningObjectId: null,
    mentionText: '',
  })

  const params = computed<LearningObjectsQueryParams>(() => ({
    moduleId: moduleId.value
  }))

  const { data: moduleLearningObjects } = useLearningObjects(params)

  const openPageLinkModal = () => {
    const sel = editor.value?.state.selection
    const selectedText = sel && sel.from !== sel.to
      ? editor.value?.state.doc.textBetween(sel.from, sel.to) ?? ''
      : ''

    pageLinkForm.value = {
      targetLearningObjectId: null,
      mentionText: selectedText.trim()
    }
    showPageLinkModal.value = true
  }

  const closePageLinkModal = () => {
    showPageLinkModal.value = false
    pageLinkForm.value = { targetLearningObjectId: null, mentionText: '' }
  }

  const submitPageLink = () => {
    if (!editor.value || !pageLinkForm.value.targetLearningObjectId || !pageLinkForm.value.mentionText) return

    editor.value
      .chain()
      .focus()
      .setLearningObjectLink(pageLinkForm.value.targetLearningObjectId, pageLinkForm.value.mentionText)
      .run()

    closePageLinkModal()
  }

  return {
    showPageLinkModal,
    pageLinkForm,
    modulePages: computed(() => moduleLearningObjects.value?.records ?? []),
    openPageLinkModal,
    closePageLinkModal,
    submitPageLink,
  }
}
