import type { Editor } from '@tiptap/vue-3'
import type { PageContentBlock, UpdatePageContentPayload } from '../types/pages.types'

export function usePageContentConverter() {
  const convertEditorToBlocks = (editor: Editor | undefined): PageContentBlock[] => {
    if (!editor) return []

    const json = editor.getJSON()
    const blocks: PageContentBlock[] = []

    if (!json.content) return blocks

    let currentTextNodes: any[] = []

    const flushTextNodes = () => {
      if (currentTextNodes.length > 0) {
        blocks.push({
          type: 'TEXT',
          content: {
            text: currentTextNodes.map(n => extractTextFromNode(n)).join(''),
          },
          tipTapContent: {
            type: 'doc',
            content: currentTextNodes,
          },
        })
        currentTextNodes = []
      }
    }

    json.content.forEach((node: any) => {
      if (node.type === 'codeBlock') {
        flushTextNodes()
        blocks.push({
          type: 'CODE',
          content: {
            code: node.content?.[0]?.text || '',
            language: node.attrs?.language || 'javascript',
          },
          tipTapContent: {
            type: 'doc',
            content: [node],
          },
        })
      } else if (node.type === 'blockquote') {
        const textContent = extractTextFromNode(node)
        if (textContent.includes('Sugerencia de Imagen') || textContent.includes('💡')) {
          flushTextNodes()
          const lines = textContent.split('\n').filter(l => l.trim())
          blocks.push({
            type: 'IMAGE_SUGGESTION',
            content: {
              prompt: lines[1] || lines[0] || '',
              reason: lines[2] || lines[1] || '',
            },
            tipTapContent: {
              type: 'doc',
              content: [node],
            },
          })
        } else {
          currentTextNodes.push(node)
        }
      } else {
        currentTextNodes.push(node)
      }
    })

    flushTextNodes()

    return blocks
  }

  const extractTextFromNode = (node: any): string => {
    if (node.type === 'text') {
      return node.text || ''
    }

    if (node.content) {
      return node.content.map((child: any) => extractTextFromNode(child)).join('')
    }

    return ''
  }

  const createPayload = (editor: Editor | undefined): UpdatePageContentPayload => {
    return {
      blocks: convertEditorToBlocks(editor),
    }
  }

  return {
    convertEditorToBlocks,
    createPayload,
  }
}
