import { Node, mergeAttributes } from '@tiptap/core'

export interface ConceptOptions {
  HTMLAttributes: Record<string, unknown>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    concept: {
      setConcept: (conceptId: number, term: string, definition: string) => ReturnType
    }
  }
}

export const Concept = Node.create<ConceptOptions>({
  name: 'concept',

  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      conceptId: {
        default: 0,
        parseHTML: (element) => Number(element.getAttribute('data-concept-id')) || 0,
        renderHTML: (attrs) => ({ 'data-concept-id': attrs.conceptId }),
      },
      term: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-term') ?? '',
        renderHTML: (attrs) => ({ 'data-term': attrs.term }),
      },
      definition: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-definition') ?? '',
        renderHTML: (attrs) => ({ 'data-definition': attrs.definition }),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="concept"]',
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    const definition = node.attrs.definition ?? ''
    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'concept',
        class: 'concept-term',
        ...(definition ? { title: definition } : {}),
      }),
      node.attrs.term ?? '',
    ]
  },

  addCommands() {
    return {
      setConcept:
        (conceptId: number, term: string, definition: string) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              conceptId,
              term,
              definition,
            },
          })
        },
    }
  },
})
