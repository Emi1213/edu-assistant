import type { Editor } from '@tiptap/vue-3'
import type { LearningObject, LOContentBlock } from '../../types'
import { normalizeTiptapContent } from '../../utils/normalize-tiptap-content'

interface TiptapDoc {
  type: 'doc'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any[]
}

export function useLearningObjectContentLoader() {
  const loadContentFromBlocks = (editor: Editor | undefined, learningObject: LearningObject, filterImageSuggestions = false) => {
    if (!editor || !learningObject.blocks || learningObject.blocks.length === 0) {
      if (editor && learningObject.content) {
        editor.commands.setContent(learningObject.content)
      }
      return
    }

    const combinedContent: TiptapDoc = {
      type: 'doc',
      content: [],
    }

    learningObject.blocks.forEach((block: LOContentBlock) => {
      if (block.type === 'CODE' && block.content && 'code' in block.content) {
        combinedContent.content.push({
          type: 'codeBlock',
          attrs: {
            language:
              ('language' in block.content && typeof block.content.language === 'string'
                ? block.content.language
                : 'plaintext'),
          },
          content: [{ type: 'text', text: block.content.code ?? '' }],
        })
        return
      }

      if (block.tipTapContent && block.tipTapContent.content) {
        const normalizedNodes = normalizeTiptapContent(block.tipTapContent.content)
        if (filterImageSuggestions) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const filteredContent = normalizedNodes.filter((node: any) => 
            node.type !== 'imageSuggestion'
          )
          combinedContent.content.push(...filteredContent)
        } else {
          combinedContent.content.push(...normalizedNodes)
        }
      }
    })

    if (combinedContent.content.length > 0) {
      editor.commands.setContent(combinedContent)
    } else if (learningObject.content) {
      editor.commands.setContent(learningObject.content)
    }
  }


  return {
    loadContentFromBlocks,
  }
}
