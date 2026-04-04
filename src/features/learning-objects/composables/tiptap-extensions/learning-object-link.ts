import { Node, mergeAttributes } from '@tiptap/core'

export interface LearningObjectLinkOptions {
  HTMLAttributes: Record<string, unknown>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    learningObjectLink: {
      setLearningObjectLink: (targetLearningObjectId: number, mentionText: string) => ReturnType
    }
  }
}

export const LearningObjectLink = Node.create<LearningObjectLinkOptions>({
  name: 'learningObjectLink',

  group: 'inline',
  inline: true,
  content: 'inline*',

  addAttributes() {
    return {
      targetLearningObjectId: {
        default: 0,
        parseHTML: (element) => Number(element.getAttribute('data-target-lo-id')) || 0,
        renderHTML: (attrs) => ({ 'data-target-lo-id': attrs.targetLearningObjectId }),
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
        tag: 'span[data-type="learning-object-link"]',
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    const mentionText = node.attrs.mentionText ?? ''
    const attrs = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
      'data-type': 'learning-object-link',
      class: 'learning-object-link-term',
      title: mentionText ? `Ir a: ${mentionText}` : '',
    })
    if (node.content.size > 0) {
      return ['span', attrs, 0]
    }
    return ['span', attrs, mentionText]
  },

  addCommands() {
    return {
      setLearningObjectLink:
        (targetLearningObjectId: number, mentionText: string) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              targetLearningObjectId,
              mentionText,
            },
            content: [{ type: 'text', text: mentionText }],
          })
        },
    }
  },
})
