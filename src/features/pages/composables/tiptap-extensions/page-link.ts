import { Node, mergeAttributes } from '@tiptap/core'

export interface PageLinkOptions {
  HTMLAttributes: Record<string, unknown>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    pageLink: {
      setPageLink: (targetPageId: number, mentionText: string) => ReturnType
    }
  }
}

export const PageLink = Node.create<PageLinkOptions>({
  name: 'pageLink',

  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      targetPageId: {
        default: 0,
        parseHTML: (element) => Number(element.getAttribute('data-target-page-id')) || 0,
        renderHTML: (attrs) => ({ 'data-target-page-id': attrs.targetPageId }),
      },
      mentionText: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-mention-text') ?? '',
        renderHTML: (attrs) => ({ 'data-mention-text': attrs.mentionText }),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="page-link"]',
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    const mentionText = node.attrs.mentionText ?? ''
    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'page-link',
        class: 'page-link-term',
        title: mentionText ? `Ir a: ${mentionText}` : '',
      }),
      mentionText,
    ]
  },

  addCommands() {
    return {
      setPageLink:
        (targetPageId: number, mentionText: string) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              targetPageId,
              mentionText,
            },
          })
        },
    }
  },
})
