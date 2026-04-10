import { marked } from 'marked'
import { normalizeConceptMarkersInMarkdown } from '@/features/content-generation/utils/normalize-concept-markers'

export interface ProcessedContent {
  content: string
  imageSuggestions: Array<{ prompt: string; reason: string }>
}

interface TextBlock {
  type: 'TEXT';
  content: { markdown: string };
}
interface CodeBlock {
  type: 'CODE';
  content: { code: string; language?: string };
}
interface ImageSuggestionBlock {
  type: 'IMAGE_SUGGESTION';
  content: { prompt: string; reason?: string };
}
type ContentBlock = TextBlock | CodeBlock | ImageSuggestionBlock;

export const processContentBlocks = (blocks: ContentBlock[]): ProcessedContent => {
  let contentToInsert = ''
  const imageSuggestions: Array<{ prompt: string; reason: string }> = []

  blocks.forEach((b) => {
    switch (b.type) {
      case 'TEXT':
        if (b.content && b.content.markdown) {
          const normalized = normalizeConceptMarkersInMarkdown(b.content.markdown)
          contentToInsert += marked.parse(normalized) as string
        }
        break
      case 'CODE':
        if (b.content && b.content.code) {
          const escapedCode = b.content.code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
          contentToInsert += `<pre><code class="language-${b.content.language || 'plaintext'}">${escapedCode}</code></pre>`
        }
        break
      case 'IMAGE_SUGGESTION':
        if (b.content && b.content.prompt) {
          imageSuggestions.push({
            prompt: b.content.prompt,
            reason: b.content.reason || '',
          })
        }
        break
    }
  })

  return { content: contentToInsert, imageSuggestions }
}
