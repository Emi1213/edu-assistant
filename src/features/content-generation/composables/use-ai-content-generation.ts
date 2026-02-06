import { ref } from 'vue'
import { marked } from 'marked'
import { useGenerateContent } from './mutations/use-generate-content'

export function useAIContentGeneration(pageId: number) {
  const showAIModal = ref(false)
  const aiInstructions = ref('')
  const isGenerating = ref(false)
  const generationError = ref('')

  const { mutate: generateContent } = useGenerateContent()

  const openAIModal = () => {
    showAIModal.value = true
    generationError.value = ''
    setTimeout(() => {
      document.getElementById('ai-instructions-input')?.focus()
    }, 100)
  }

  const closeAIModal = () => {
    showAIModal.value = false
    aiInstructions.value = ''
    generationError.value = ''
  }

  const processBlocks = (blocks: any[]): string => {
    let contentToInsert = ''

    blocks.forEach((block) => {
      switch (block.type) {
        case 'TEXT':
          if ('markdown' in block.content) {
            const htmlContent = marked.parse(block.content.markdown) as string
            contentToInsert += htmlContent + '\n\n'
          }
          break
        case 'CODE':
          if ('code' in block.content && 'language' in block.content) {
            const escapedCode = block.content.code
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
            contentToInsert += `<pre><code class="language-${block.content.language}">${escapedCode}</code></pre>\n\n`
          }
          break
        case 'IMAGE_SUGGESTION':
          if ('prompt' in block.content && 'reason' in block.content) {
            contentToInsert += `<blockquote><p><strong>💡 Sugerencia de Imagen:</strong></p><p>${block.content.prompt}</p><p><em>${block.content.reason}</em></p></blockquote>\n\n`
          }
          break
      }
    })

    return contentToInsert
  }

  const generate = (
    onSuccess: (data: { title?: string; keywords?: string[]; content: string }) => void,
    isMounted: () => boolean
  ) => {
    if (!aiInstructions.value.trim() || isGenerating.value) return

    isGenerating.value = true
    generationError.value = ''

    generateContent(
      {
        pageId,
        instructions: aiInstructions.value,
      },
      {
        onSuccess: (data) => {
          if (!isMounted() || !data) {
            isGenerating.value = false
            return
          }

          const contentToInsert = processBlocks(data.blocks || [])

          if (contentToInsert.trim()) {
            onSuccess({
              title: data.title,
              keywords: data.keywords,
              content: contentToInsert,
            })
            setTimeout(() => closeAIModal(), 500)
          } else {
            generationError.value = 'No se generó contenido. Intenta con instrucciones más específicas.'
          }

          isGenerating.value = false
        },
        onError: (error: any) => {
          if (!isMounted()) return
          isGenerating.value = false
          generationError.value = error.message || 'Error al generar contenido. Por favor, intenta de nuevo.'
        },
      }
    )
  }

  return {
    showAIModal,
    aiInstructions,
    isGenerating,
    generationError,
    openAIModal,
    closeAIModal,
    generate,
  }
}
