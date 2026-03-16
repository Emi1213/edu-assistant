import type { Ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { ref } from 'vue'
import { useToast } from '@/shared/composables/use-toast'
import { toImageDataUrl } from '@/shared/utils/image.utils'
import { useGenerateImage } from '@/features/content-generation/composables/mutations/use-generate-image'

export function usePageEditorImageModal(editor: Ref<Editor | undefined>) {
  const toast = useToast()
  const showImagePromptModal = ref(false)
  const imagePrompt = ref('')
  const imageSelectionRange = ref<{ from: number; to: number } | null>(null)
  const { mutate: generateImageFromPrompt, isPending: isGeneratingImage } = useGenerateImage()

  function openImagePromptModal() {
    const sel = editor.value?.state.selection
    const selectedText =
      sel && sel.from !== sel.to
        ? editor.value?.state.doc.textBetween(sel.from, sel.to) ?? ''
        : ''
    imagePrompt.value = selectedText.trim()
    imageSelectionRange.value =
      sel && sel.from !== sel.to ? { from: sel.from, to: sel.to } : null
    showImagePromptModal.value = true
  }

  function closeImagePromptModal() {
    showImagePromptModal.value = false
    imagePrompt.value = ''
    imageSelectionRange.value = null
  }

  function handleGenerateImageFromPrompt() {
    const prompt = imagePrompt.value?.trim()
    if (!prompt || !editor.value) return
    const savedRange = imageSelectionRange.value
    generateImageFromPrompt(
      { prompt },
      {
        onSuccess: (base64Image) => {
          if (base64Image == null || !editor.value) return
          const src = toImageDataUrl(base64Image)
          const chain = editor.value.chain().focus()
          if (savedRange && savedRange.from !== savedRange.to) {
            chain.deleteRange({ from: savedRange.from, to: savedRange.to })
            chain.insertContentAt(savedRange.from, {
              type: 'image',
              attrs: { src, alt: prompt, title: prompt },
            })
          } else {
            chain.insertContent({ type: 'image', attrs: { src, alt: prompt, title: prompt } })
          }
          chain.run()
          closeImagePromptModal()
          toast.success('Imagen generada e insertada')
        },
        onError: (err: Error) => {
          toast.error(err.message || 'Error al generar la imagen')
        },
      }
    )
  }

  return {
    showImagePromptModal,
    imagePrompt,
    openImagePromptModal,
    closeImagePromptModal,
    handleGenerateImageFromPrompt,
    isGeneratingImage,
  }
}
