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
        const markdown = currentTextNodes.map((n) => nodeToMarkdown(n)).join('\n\n')
        blocks.push({
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
      } else if (node.type === 'image') {
        flushTextNodes()
        blocks.push({
          type: 'IMAGE',
          content: {
            src: node.attrs?.src ?? '',
            alt: node.attrs?.alt,
          },
          tipTapContent: {
            type: 'doc',
            content: [node],
          },
        })
      } else if (node.type === 'imageSuggestion') {
        flushTextNodes()
        blocks.push({
          type: 'IMAGE_SUGGESTION',
          content: {
            prompt: node.attrs?.prompt ?? '',
            reason: node.attrs?.reason ?? '',
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

  const nodeToMarkdown = (node: any): string => {
    if (node.type === 'paragraph') {
      return (node.content || []).map((c: any) => inlineToMarkdown(c)).join('')
    }
    if (node.type === 'heading') {
      const level = node.attrs?.level ?? 1
      const prefix = '#'.repeat(level) + ' '
      return prefix + (node.content || []).map((c: any) => inlineToMarkdown(c)).join('')
    }
    if (node.type === 'bulletList') {
      return (node.content || [])
        .map((li: any) => listItemToMarkdown(li, '-'))
        .join('\n')
    }
    if (node.type === 'orderedList') {
      return (node.content || [])
        .map((li: any, i: number) => listItemToMarkdown(li, `${i + 1}.`))
        .join('\n')
    }
    if (node.type === 'listItem') {
      return listItemToMarkdown(node, '-')
    }
    if (node.type === 'blockquote') {
      const inner = (node.content || []).map((c: any) => nodeToMarkdown(c)).join('\n\n')
      return inner
        .split('\n')
        .map((line: string) => '> ' + line)
        .join('\n')
    }
    if (node.type === 'horizontalRule') {
      return '---'
    }
    if (node.content) {
      return (node.content || []).map((c: any) => nodeToMarkdown(c)).join('\n\n')
    }
    return ''
  }

  const listItemToMarkdown = (listItem: any, prefix: string): string => {
    const content = (listItem.content || []).map((n: any) => {
      if (n.type === 'paragraph') {
        return (n.content || []).map((c: any) => inlineToMarkdown(c)).join('')
      }
      return nodeToMarkdown(n)
    }).join('\n')
    return prefix + ' ' + content
  }

  const inlineToMarkdown = (node: any): string => {
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
      const term = node.attrs?.term ?? ''
      return term ? `[[concept:${id}|${term}]]` : ''
    }
    if (node.type === 'pageLink') {
      const id = node.attrs?.targetPageId ?? 0
      const text = node.attrs?.mentionText ?? ''
      return text ? `[[page:${id}|${text}]]` : ''
    }
    if (node.content) {
      return node.content.map((c: any) => inlineToMarkdown(c)).join('')
    }
    return ''
  }

  const extractTextFromNode = (node: any): string => {
    if (node.type === 'text') {
      return node.text || ''
    }

    if (node.type === 'concept') {
      const id = node.attrs?.conceptId ?? 0
      const term = node.attrs?.term ?? ''
      return term ? `[[concept:${id}|${term}]]` : ''
    }

    if (node.type === 'pageLink') {
      const id = node.attrs?.targetPageId ?? 0
      const text = node.attrs?.mentionText ?? ''
      return text ? `[[page:${id}|${text}]]` : ''
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
