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


export function usePageContentConverter() {
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
      if (tNode.type === 'codeBlock') {
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
      } else if (tNode.type === 'image') {
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
      } else if (tNode.type === 'imageSuggestion') {
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
      } else if (tNode.type === 'blockquote') {
        const textContent = extractTextFromNode(tNode)
        if (textContent.includes('Sugerencia de Imagen') || textContent.includes('💡')) {
          flushTextNodes()
          const lines = textContent.split('\n').filter(l => l.trim())
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
      } else {
        currentTextNodes.push(tNode)
      }
    })

    flushTextNodes()

    return blocks
  }

  const nodeToMarkdown = (node: TiptapNode): string => {
    if (node.type === 'paragraph') {
      return (node.content || []).map((c) => inlineToMarkdown(c)).join('')
    }
    if (node.type === 'heading') {
      const level = node.attrs?.level ?? 1
      const prefix = '#'.repeat(level) + ' '
      return prefix + (node.content || []).map((c) => inlineToMarkdown(c)).join('')
    }
    if (node.type === 'bulletList') {
      return (node.content || [])
        .map((li) => listItemToMarkdown(li, '-'))
        .join('\n')
    }
    if (node.type === 'orderedList') {
      return (node.content || [])
        .map((li, i: number) => listItemToMarkdown(li, `${i + 1}.`))
        .join('\n')
    }
    if (node.type === 'listItem') {
      return listItemToMarkdown(node, '-')
    }
    if (node.type === 'blockquote') {
      const inner = (node.content || []).map((c) => nodeToMarkdown(c)).join('\n\n')
      return inner
        .split('\n')
        .map((line: string) => '> ' + line)
        .join('\n')
    }
    if (node.type === 'horizontalRule') {
      return '---'
    }
    if (node.content) {
      return (node.content || []).map((c) => nodeToMarkdown(c)).join('\n\n')
    }
    return ''
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
    if (node.type === 'text') return node.text || ''
    if (node.type === 'concept') {
      if (node.content?.length) {
        return node.content.map((c) => conceptPlainText(c)).join('')
      }
      return node.attrs?.term ?? ''
    }
    if (node.content) return node.content.map((c) => conceptPlainText(c)).join('')
    return ''
  }

  const pageLinkPlainText = (node: TiptapNode): string => {
    if (node.type === 'text') return node.text || ''
    if (node.type === 'pageLink') {
      if (node.content?.length) {
        return node.content.map((c) => pageLinkPlainText(c)).join('')
      }
      return node.attrs?.mentionText ?? ''
    }
    if (node.content) return node.content.map((c) => pageLinkPlainText(c)).join('')
    return ''
  }

  const inlineToMarkdown = (node: TiptapNode): string => {
    if (node.type === 'text') {
      let t = node.text || ''
      const marks = node.marks || []
      for (const m of marks) {
        if (m.type === 'bold') t = `**${t}**`
        else if (m.type === 'italic') t = `*${t}*`
        else if (m.type === 'strike') t = `~~${t}~~`
        else if (m.type === 'code') t = '`' + t + '`'
      }
      return t
    }
    if (node.type === 'concept') {
      const id = node.attrs?.conceptId ?? 0
      const term = node.content?.length ? conceptPlainText(node) : (node.attrs?.term ?? '')
      return term ? `[[concept:${id}|${term}]]` : ''
    }
    if (node.type === 'pageLink') {
      const id = node.attrs?.targetPageId ?? 0
      const text = node.content?.length
        ? node.content.map((c) => inlineToMarkdown(c)).join('')
        : (node.attrs?.mentionText ?? '')
      return text ? `[[page:${id}|${text}]]` : ''
    }
    if (node.content) {
      return node.content.map((c) => inlineToMarkdown(c)).join('')
    }
    return ''
  }

  const extractTextFromNode = (node: TiptapNode): string => {
    if (node.type === 'text') {
      return node.text || ''
    }

    if (node.type === 'concept') {
      const id = node.attrs?.conceptId ?? 0
      const term = node.content?.length ? conceptPlainText(node) : (node.attrs?.term ?? '')
      return term ? `[[concept:${id}|${term}]]` : ''
    }

    if (node.type === 'pageLink') {
      const id = node.attrs?.targetPageId ?? 0
      const text = node.content?.length ? pageLinkPlainText(node) : (node.attrs?.mentionText ?? '')
      return text ? `[[page:${id}|${text}]]` : ''
    }

    if (node.content) {
      return node.content.map((child) => extractTextFromNode(child)).join('')
    }

    return ''
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
