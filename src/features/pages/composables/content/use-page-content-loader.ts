import type { Editor } from '@tiptap/vue-3'
import type { Page } from '../../types'

export function usePageContentLoader() {
  const loadContentFromBlocks = (editor: Editor | undefined, page: Page, filterImageSuggestions = false) => {
    if (!editor || !page.blocks || page.blocks.length === 0) {
      if (editor && page.content) {
        editor.commands.setContent(page.content)
      }
      return
    }

    const combinedContent: any = {
      type: 'doc',
      content: [],
    }

    page.blocks.forEach((block) => {
      if (block.tipTapContent && block.tipTapContent.content) {
        if (filterImageSuggestions) {
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
    } else if (page.content) {
      editor.commands.setContent(page.content)
    }
  }

  return {
    loadContentFromBlocks,
  }
}
