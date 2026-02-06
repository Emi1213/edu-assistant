import { onMounted, onBeforeUnmount, type Ref } from 'vue'
import { useGenerateImage } from './mutations/use-generate-image'
import { useToast } from 'vue-toastification'
import type { Editor } from '@tiptap/vue-3'

export function useImageGenerationHandler(editor: Ref<Editor | undefined>) {
  const { mutate: generateImage, isPending: isGenerating } = useGenerateImage()
  const toast = useToast()

  const handleGenerateImage = (event: Event) => {
    const button = event.target as HTMLElement
    if (!button.classList.contains('generate-image-btn')) return

    const prompt = button.getAttribute('data-prompt')
    if (!prompt || !editor.value) return
    
    // Find the image suggestion block parent
    const suggestionBlock = button.closest('[data-type="image-suggestion"]')
    if (!suggestionBlock) return

    // Disable button and show loading
    button.textContent = '⏳ Generando...'
    button.setAttribute('disabled', 'true')

    generateImage(
      { prompt },
      {
        onSuccess: (base64Image) => {
          toast.success('Imagen generada exitosamente')
          
          // Replace the suggestion with the image
          if (editor.value) {
            // Find the position of the suggestion node
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
                .insertContentAt(suggestionPos, `<img src="${base64Image}" alt="${prompt}" style="max-width: 100%; border-radius: 8px; margin: 16px 0;" />`)
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

  onMounted(() => {
    document.addEventListener('click', handleGenerateImage)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleGenerateImage)
  })

  return {
    isGenerating,
  }
}
