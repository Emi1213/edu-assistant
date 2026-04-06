import { onBeforeUnmount, watch } from 'vue'
import { useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Image from '@tiptap/extension-image'
import { lowlight } from '@/shared/config/lowlight.config'
import { toImageDataUrl } from '@/shared/utils/image.utils'
import { Concept } from '../tiptap-extensions/concept'
import { PageLink } from '../tiptap-extensions/page-link'
import { stripImageSuggestionsFromDoc } from '../../utils/strip-image-suggestions-from-doc'
import type { Ref } from 'vue'
import type { Content } from '@tiptap/core'

function viewerContent(value: unknown): Content {
  return stripImageSuggestionsFromDoc(value) as Content
}

export function usePageContentViewer(content: Ref<any>) {
  const editor = useEditor({
    content: viewerContent(content.value),
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'plaintext',
        HTMLAttributes: {
          class: 'code-block-wrapper',
        },
      }).extend({
        addNodeView() {
          return ({ node, HTMLAttributes }) => {
            const dom = document.createElement('pre')
            const code = document.createElement('code')
            
            Object.entries(HTMLAttributes).forEach(([key, value]) => {
              if (value) dom.setAttribute(key, value)
            })
            
            const language = node.attrs.language || 'plaintext'
            dom.setAttribute('data-language', language)
            code.className = `language-${language}`
            
            dom.appendChild(code)
            
            return { dom, contentDOM: code }
          }
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
      }).extend({
        renderHTML({ node, HTMLAttributes }) {
          const src = toImageDataUrl(node.attrs.src ?? '')
          return ['img', { ...HTMLAttributes, src, alt: node.attrs.alt, style: 'max-width: 100%; max-height: 360px; object-fit: contain; border-radius: 8px; margin: 16px auto; display: block;' }]
        },
      }),
      Concept,
      PageLink,
    ],
    editable: false,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none',
      },
    },
  })

  watch(content, (newContent) => {
    if (editor.value && newContent) {
      editor.value.commands.setContent(viewerContent(newContent) as Content)
    }
  })

  onBeforeUnmount(() => {
    editor.value?.destroy()
  })

  return { editor }
}
