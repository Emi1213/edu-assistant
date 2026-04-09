import type { Editor } from '@tiptap/vue-3'
import type { LOContentBlock, UpdateLearningObjectContentPayload } from '../../types'

interface TiptapNode {
  type: string
  content?: TiptapNode[]
  text?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attrs?: Record<string, any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  marks?: Array<{ type: string; attrs?: Record<string, any> }>
}


export function useLearningObjectContentConverter() {
  const convertEditorToBlocks = (editor: Editor | undefined): LOContentBlock[] => {
    if (!editor) return []

    const json = editor.getJSON()
    const blocks: LOContentBlock[] = []

    if (!json.content) return blocks

    let currentTextNodes: TiptapNode[] = []

    const flushTextNodes = () => {
      if (currentTextNodes.length > 0) {
        const markdown = currentTextNodes.map((n) => nodeToMarkdown(n)).join('\n\n')
        blocks.push({
          orderIndex: blocks.length,
          type: 'TEXT',
          content: {
            markdown,
          },
          tipTapContent: {
            type: 'doc',
            content: currentTextNodes,
          },
        })
        currentTextNodes = []
      }
    }

    json.content.forEach((node: unknown) => {
      const tNode = node as TiptapNode
      switch (tNode.type) {
        case 'codeBlock':
          flushTextNodes()
          blocks.push({
            orderIndex: blocks.length,
            type: 'CODE',
            content: {
              code: tNode.content?.[0]?.text || '',
              language: tNode.attrs?.language || 'javascript',
            },
            tipTapContent: {
              type: 'doc',
              content: [tNode],
            },
          })
          break

        case 'image':
          flushTextNodes()
          blocks.push({
            orderIndex: blocks.length,
            type: 'IMAGE',
            content: {
              src: tNode.attrs?.src ?? '',
              alt: tNode.attrs?.alt,
            },
            tipTapContent: {
              type: 'doc',
              content: [tNode],
            },
          })
          break

        case 'imageSuggestion':
          flushTextNodes()
          blocks.push({
            orderIndex: blocks.length,
            type: 'IMAGE_SUGGESTION',
            content: {
              prompt: tNode.attrs?.prompt ?? '',
              reason: tNode.attrs?.reason ?? '',
            },
            tipTapContent: {
              type: 'doc',
              content: [tNode],
            },
          })
          break

        case 'blockquote': {
          const textContent = extractTextFromNode(tNode)
          if (textContent.includes('Sugerencia de Imagen') || textContent.includes('💡')) {
            flushTextNodes()
            const lines = textContent.split('\n').filter((l) => l.trim())
            blocks.push({
              orderIndex: blocks.length,
              type: 'IMAGE_SUGGESTION',
              content: {
                prompt: lines[1] || lines[0] || '',
                reason: lines[2] || lines[1] || '',
              },
              tipTapContent: {
                type: 'doc',
                content: [tNode],
              },
            })
          } else {
            currentTextNodes.push(tNode)
          }
          break
        }

        default:
          currentTextNodes.push(tNode)
          break
      }
    })

    flushTextNodes()

    return blocks
  }

  const nodeToMarkdown = (node: TiptapNode): string => {
    switch (node.type) {
      case 'paragraph':
        return (node.content || []).map((c) => inlineToMarkdown(c)).join('')

      case 'heading': {
        const level = node.attrs?.level ?? 1
        const prefix = '#'.repeat(level) + ' '
        return prefix + (node.content || []).map((c) => inlineToMarkdown(c)).join('')
      }

      case 'bulletList':
        return (node.content || [])
          .map((li) => listItemToMarkdown(li, '-'))
          .join('\n')

      case 'orderedList':
        return (node.content || [])
          .map((li, i: number) => listItemToMarkdown(li, `${i + 1}.`))
          .join('\n')

      case 'listItem':
        return listItemToMarkdown(node, '-')

      case 'blockquote': {
        const inner = (node.content || []).map((c) => nodeToMarkdown(c)).join('\n\n')
        return inner
          .split('\n')
          .map((line: string) => '> ' + line)
          .join('\n')
      }

      case 'horizontalRule':
        return '---'

      default:
        if (node.content) {
          return (node.content || []).map((c) => nodeToMarkdown(c)).join('\n\n')
        }
        return ''
    }
  }

  const listItemToMarkdown = (listItem: TiptapNode, prefix: string): string => {
    const content = (listItem.content || []).map((n) => {
      if (n.type === 'paragraph') {
        return (n.content || []).map((c) => inlineToMarkdown(c)).join('')
      }
      return nodeToMarkdown(n)
    }).join('\n')
    return prefix + ' ' + content
  }

  const conceptPlainText = (node: TiptapNode): string => {
    switch (node.type) {
      case 'text':
        return node.text || ''
      case 'concept':
        if (node.content?.length) {
          return node.content.map((c) => conceptPlainText(c)).join('')
        }
        return node.attrs?.term ?? ''
      default:
        if (node.content) return node.content.map((c) => conceptPlainText(c)).join('')
        return ''
    }
  }

  const learningObjectLinkPlainText = (node: TiptapNode): string => {
    switch (node.type) {
      case 'text':
        return node.text || ''
      case 'learningObjectLink':
        if (node.content?.length) {
          return node.content.map((c) => learningObjectLinkPlainText(c)).join('')
        }
        return node.attrs?.mentionText ?? ''
      default:
        if (node.content) return node.content.map((c) => learningObjectLinkPlainText(c)).join('')
        return ''
    }
  }

  const inlineToMarkdown = (node: TiptapNode): string => {
    switch (node.type) {
      case 'text': {
        let t = node.text || ''
        const marks = node.marks || []
        for (const m of marks) {
          switch (m.type) {
            case 'bold':
              t = `**${t}**`
              break
            case 'italic':
              t = `*${t}*`
              break
            case 'strike':
              t = `~~${t}~~`
              break
            case 'code':
              t = '`' + t + '`'
              break
          }
        }
        return t
      }
      case 'concept': {
        const id = node.attrs?.conceptId ?? 0
        const term = node.content?.length ? conceptPlainText(node) : (node.attrs?.term ?? '')
        return term ? `[[concept:${id}|${term}]]` : ''
      }
      case 'learningObjectLink': {
        const id = node.attrs?.targetLearningObjectId ?? 0
        const text = node.content?.length
          ? node.content.map((c) => inlineToMarkdown(c)).join('')
          : (node.attrs?.mentionText ?? '')
        return text ? `[[learning-object:${id}|${text}]]` : ''
      }
      default:
        if (node.content) {
          return node.content.map((c) => inlineToMarkdown(c)).join('')
        }
        return ''
    }
  }

  const extractTextFromNode = (node: TiptapNode): string => {
    switch (node.type) {
      case 'text':
        return node.text || ''

      case 'concept': {
        const id = node.attrs?.conceptId ?? 0
        const term = node.content?.length ? conceptPlainText(node) : (node.attrs?.term ?? '')
        return term ? `[[concept:${id}|${term}]]` : ''
      }

      case 'learningObjectLink': {
        const id = node.attrs?.targetLearningObjectId ?? 0
        const text = node.content?.length ? learningObjectLinkPlainText(node) : (node.attrs?.mentionText ?? '')
        return text ? `[[learning-object:${id}|${text}]]` : ''
      }

      default:
        if (node.content) {
          return node.content.map((child) => extractTextFromNode(child)).join('')
        }
        return ''
    }
  }

  const createPayload = (editor: Editor | undefined): UpdateLearningObjectContentPayload => {
    return {
      blocks: convertEditorToBlocks(editor),
    }
  }

  return {
    convertEditorToBlocks,
    createPayload,
  }
}
