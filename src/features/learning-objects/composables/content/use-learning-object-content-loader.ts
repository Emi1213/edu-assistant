import type { Editor } from '@tiptap/vue-3'
import type { LearningObject, LOContentBlock } from '../../types'

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
      if (block.tipTapContent && block.tipTapContent.content) {
        if (filterImageSuggestions) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const filteredContent = block.tipTapContent.content.filter((node: any) => 
            node.type !== 'imageSuggestion'
          )
          combinedContent.content.push(...filteredContent)
        } else {
          combinedContent.content.push(...block.tipTapContent.content)
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
