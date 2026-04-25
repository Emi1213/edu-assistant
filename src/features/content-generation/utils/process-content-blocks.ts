import { marked } from 'marked'
import { normalizeConceptMarkersInMarkdown } from '@/features/content-generation/utils/normalize-concept-markers'
import type { ContentGenerationBlock } from '../types'

export interface ProcessedContent {
  content: string
  imageSuggestions: Array<{ prompt: string; reason: string }>
}

const fixNewlines = (text: string) => text.replace(/\\n/g, '\n')

export const processContentBlocks = (blocks: ContentGenerationBlock[]): ProcessedContent => {
  let contentToInsert = ''
  const imageSuggestions: Array<{ prompt: string; reason: string }> = []

  blocks.forEach((b) => {
    switch (b.type) {
      case 'TEXT':
        if (b.content && 'markdown' in b.content) {
          const fixedMarkdown = fixNewlines(b.content.markdown)
          const normalized = normalizeConceptMarkersInMarkdown(fixedMarkdown)
          contentToInsert += marked.parse(normalized) as string
        }
        break
      case 'CODE':
        if (b.content && 'code' in b.content) {
          const fixedCode = fixNewlines(b.content.code)
          const escapedCode = fixedCode
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
            prompt: fixNewlines(b.content.prompt),
            reason: (('reason' in b.content ? b.content.reason : '') || '').replace(/\\n/g, '\n'),
          })
        }
        break
    }
  })

  return { content: contentToInsert, imageSuggestions }
}
