import type { Ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { ref } from 'vue'
import { useGenerateImage } from '@/features/content-generation/composables/mutations/use-generate-image'
import { useToast } from '@/shared/composables/use-toast'

export function useLearningObjectEditorImageModal(editor: Ref<Editor | undefined>) {
  const toast = useToast()
  const showImagePromptModal = ref(false)
  const imagePrompt = ref('')
  const { mutateAsync: generateImageApi, isPending: isGeneratingImage } = useGenerateImage()

  const openImagePromptModal = () => {
    imagePrompt.value = ''
    showImagePromptModal.value = true
  }

  const closeImagePromptModal = () => {
    showImagePromptModal.value = false
    imagePrompt.value = ''
  }

  const handleGenerateImageFromPrompt = async () => {
    if (!editor.value || !imagePrompt.value.trim()) return

    try {
      const data = await generateImageApi({
        prompt: imagePrompt.value.trim(),
      })

      if (data) {
        editor.value
          .chain()
          .focus()
          .setImage({ src: data, alt: imagePrompt.value.trim() })
          .run()
        toast.success('Imagen generada e insertada')
        closeImagePromptModal()
      }
    } catch (err: unknown) {
      toast.error((err as Error)?.message ?? 'Error al generar la imagen')
    }
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
