import Link from '@tiptap/extension-link'

const linkHtmlAttributes = {
  class: 'text-primary underline underline-offset-2 hover:opacity-90 cursor-pointer',
  rel: 'noopener noreferrer',
  target: '_blank',
} as const

export function createLearningObjectLink() {
  return Link.configure({
    autolink: true,
    linkOnPaste: true,
    openOnClick: true,
    HTMLAttributes: { ...linkHtmlAttributes },
  })
}
