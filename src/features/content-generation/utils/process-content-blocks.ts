import { marked } from 'marked'
import { normalizeConceptMarkersInMarkdown } from '@/features/content-generation/utils/normalize-concept-markers'
import type { ContentGenerationBlock } from '../types'

export interface ProcessedContent {
  content: string
  imageSuggestions: Array<{ prompt: string; reason: string }>
}

export const processContentBlocks = (blocks: ContentGenerationBlock[]): ProcessedContent => {
  let contentToInsert = ''
  const imageSuggestions: Array<{ prompt: string; reason: string }> = []

  blocks.forEach((b) => {
    switch (b.type) {
      case 'TEXT':
        if (b.content && 'markdown' in b.content) {
          const normalized = normalizeConceptMarkersInMarkdown(b.content.markdown)
          contentToInsert += marked.parse(normalized) as string
        }
        break
      case 'CODE':
        if (b.content && 'code' in b.content) {
          const escapedCode = b.content.code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
          const language = 'language' in b.content ? b.content.language : 'plaintext'
          contentToInsert += `<pre><code class="language-${language}">${escapedCode}</code></pre>`
        }
        break
      case 'IMAGE_SUGGESTION':
        if (b.content && 'prompt' in b.content) {
          imageSuggestions.push({
            prompt: b.content.prompt,
            reason: ('reason' in b.content ? b.content.reason : '') || '',
          })
        }
        break
    }
  })

  return { content: contentToInsert, imageSuggestions }
}
