import { ref } from 'vue'
import { marked } from 'marked'
import { useGenerateContent } from './mutations/use-generate-content'
import { normalizeConceptMarkersInMarkdown } from '../utils/normalize-concept-markers'

export function useAIContentGeneration(learningObjectId: number) {
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

  const processBlocks = (blocks: unknown[]): { content: string; imageSuggestions: Array<{ prompt: string; reason: string }> } => {
    let contentToInsert = ''
    const imageSuggestions: Array<{ prompt: string; reason: string }> = []

    blocks.forEach((block) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const b = block as any
      switch (b.type) {
        case 'TEXT':
          if (b.content && 'markdown' in b.content) {
            const raw = b.content.markdown as string
            const normalized = normalizeConceptMarkersInMarkdown(raw)
            const htmlContent = marked.parse(normalized) as string
            contentToInsert += htmlContent + '\n\n'
          }
          break
        case 'CODE':
          if (b.content && 'code' in b.content && 'language' in b.content) {
            const escapedCode = b.content.code
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
            contentToInsert += `<pre><code class="language-${b.content.language}">${escapedCode}</code></pre>\n\n`
          }
          break
        case 'IMAGE_SUGGESTION':
          if (b.content && 'prompt' in b.content && 'reason' in b.content) {
            imageSuggestions.push({
              prompt: b.content.prompt,
              reason: b.content.reason,
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
        learningObjectId,
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
        onError: (error: unknown) => {
          if (!isMounted()) return
          isGenerating.value = false
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          generationError.value = (error as any).message || 'Error al generar contenido. Por favor, intenta de nuevo.'
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
