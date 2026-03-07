import { ref } from 'vue'
import { marked } from 'marked'
import { useGenerateContent } from './mutations/use-generate-content'
import { normalizeConceptMarkersInMarkdown } from '../utils/normalize-concept-markers'

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

  const processBlocks = (blocks: any[]): { content: string; imageSuggestions: Array<{ prompt: string; reason: string }> } => {
    let contentToInsert = ''
    const imageSuggestions: Array<{ prompt: string; reason: string }> = []

    blocks.forEach((block) => {
      switch (block.type) {
        case 'TEXT':
          if ('markdown' in block.content) {
            const raw = block.content.markdown as string
            const normalized = normalizeConceptMarkersInMarkdown(raw)
            const htmlContent = marked.parse(normalized) as string
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
            imageSuggestions.push({
              prompt: block.content.prompt,
              reason: block.content.reason,
            })
          }
          break
      }
    })

    return { content: contentToInsert, imageSuggestions }
  }

  const generate = (
    onSuccess: (data: { title?: string; keywords?: string[]; content: string; imageSuggestions?: Array<{ prompt: string; reason: string }> }) => void,
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

          const result = processBlocks(data.blocks || [])

          if (result.content.trim() || result.imageSuggestions.length > 0) {
            onSuccess({
              title: data.title,
              keywords: data.keywords,
              content: result.content,
              imageSuggestions: result.imageSuggestions,
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
