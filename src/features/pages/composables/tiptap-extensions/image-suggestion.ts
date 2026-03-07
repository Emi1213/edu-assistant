import { Node, mergeAttributes } from '@tiptap/core'

export interface ImageSuggestionOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageSuggestion: {
      setImageSuggestion: (prompt: string, reason: string) => ReturnType
    }
  }
}

export const ImageSuggestion = Node.create<ImageSuggestionOptions>({
  name: 'imageSuggestion',

  group: 'block',

  content: 'inline*',

  addAttributes() {
    return {
      prompt: {
        default: '',
      },
      reason: {
        default: '',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="image-suggestion"]',
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'image-suggestion',
        'data-prompt': node.attrs.prompt,
        class: 'image-suggestion-block',
      }),
      [
        'div',
        { class: 'image-suggestion-content' },
        [
          'p',
          { class: 'image-suggestion-title' },
          '💡 Sugerencia de Imagen:',
        ],
        [
          'p',
          { class: 'image-suggestion-prompt' },
          node.attrs.prompt,
        ],
        [
          'p',
          { class: 'image-suggestion-reason' },
          node.attrs.reason,
        ],
        [
          'div',
          { class: 'image-suggestion-actions' },
          [
            'button',
            {
              class: 'generate-image-btn',
              'data-prompt': node.attrs.prompt,
              type: 'button',
            },
            '🎨 Generar Imagen',
          ],
          [
            'button',
            {
              class: 'remove-image-suggestion-btn',
              type: 'button',
            },
            '✕ Quitar sugerencia',
          ],
        ],
      ],
    ]
  },

  addCommands() {
    return {
      setImageSuggestion:
        (prompt: string, reason: string) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              prompt,
              reason,
            },
          })
        },
    }
  },
})
