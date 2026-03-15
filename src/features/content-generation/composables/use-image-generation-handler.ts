import { onMounted, onBeforeUnmount, type Ref } from 'vue'
import { useGenerateImage } from './mutations/use-generate-image'
import { useToast } from '@/shared/composables/use-toast'
import { toImageDataUrl } from '@/shared/utils/image.utils'
import type { Editor } from '@tiptap/vue-3'

export function useImageGenerationHandler(editor: Ref<Editor | undefined>) {
  const { mutate: generateImage, isPending: isGenerating } = useGenerateImage()
  const toast = useToast()

  const handleGenerateImage = (event: Event) => {
    const button = event.target as HTMLElement
    if (!button.classList.contains('generate-image-btn')) return

    const prompt = button.getAttribute('data-prompt')
    if (!prompt || !editor.value) return

    const suggestionBlock = button.closest('[data-type="image-suggestion"]')
    if (!suggestionBlock) return

    button.textContent = '⏳ Generando...'
    button.setAttribute('disabled', 'true')

    generateImage(
      { prompt },
      {
        onSuccess: (base64Image) => {
          toast.success('Imagen generada exitosamente')

          if (editor.value) {
            let suggestionPos: number | null = null
            let suggestionSize = 0

            editor.value.state.doc.descendants((node, pos) => {
              if (node.type.name === 'imageSuggestion' && node.attrs.prompt === prompt) {
                suggestionPos = pos
                suggestionSize = node.nodeSize
                return false
              }
            })

            if (suggestionPos !== null && base64Image != null) {
              const src = toImageDataUrl(base64Image)
              editor.value
                .chain()
                .focus()
                .deleteRange({ from: suggestionPos, to: suggestionPos + suggestionSize })
                .insertContentAt(suggestionPos, {
                  type: 'image',
                  attrs: { src, alt: prompt, title: prompt },
                })
                .run()
            }
          }
        },
        onError: (error: any) => {
          toast.error(error.message || 'Error al generar la imagen')
          button.textContent = '🎨 Generar Imagen'
          button.removeAttribute('disabled')
        },
      }
    )
  }

  const handleRemoveSuggestion = (event: Event) => {
    const button = event.target as HTMLElement
    if (!button.classList.contains('remove-image-suggestion-btn')) return

    const suggestionBlock = button.closest('[data-type="image-suggestion"]')
    if (!suggestionBlock || !editor.value) return

    const prompt = suggestionBlock.getAttribute('data-prompt')
    if (!prompt) return

    let suggestionPos: number | null = null
    let suggestionSize = 0
    editor.value.state.doc.descendants((node, pos) => {
      if (node.type.name === 'imageSuggestion' && node.attrs.prompt === prompt) {
        suggestionPos = pos
        suggestionSize = node.nodeSize
        return false
      }
    })

    if (suggestionPos !== null) {
      editor.value
        .chain()
        .focus()
        .deleteRange({ from: suggestionPos, to: suggestionPos + suggestionSize })
        .run()
      toast.success('Sugerencia eliminada')
    }
  }

  const handleClick = (event: Event) => {
    handleGenerateImage(event)
    handleRemoveSuggestion(event)
  }

  onMounted(() => {
    document.addEventListener('click', handleClick)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClick)
  })

  return {
    isGenerating,
  }
}
