import { onBeforeUnmount, watch } from 'vue'
import { useEditor } from '@tiptap/vue-3'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Image from '@tiptap/extension-image'
import { lowlight } from '@/shared/config/lowlight.config'
import { Concept } from './tiptap-extensions/concept'
import { PageLink } from './tiptap-extensions/page-link'
import ConceptTooltipNodeView from '../presentation/components/concept-tooltip-node-view.vue'
import type { Ref } from 'vue'

function normalizeImageSrc(src: string): string {
  if (!src) return ''
  if (src.startsWith('data:')) return src
  return `data:image/png;base64,${src}`
}

export function usePageContentViewer(content: Ref<any>) {
  const editor = useEditor({
    content: content.value,
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
          const src = normalizeImageSrc(node.attrs.src ?? '')
          return ['img', { ...HTMLAttributes, src, alt: node.attrs.alt, style: 'max-width: 100%; max-height: 360px; object-fit: contain; border-radius: 8px; margin: 16px auto; display: block;' }]
        },
      }),
      Concept.extend({
        addNodeView() {
          return VueNodeViewRenderer(ConceptTooltipNodeView as any)
        },
      }),
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
      editor.value.commands.setContent(newContent)
    }
  })

  onBeforeUnmount(() => {
    editor.value?.destroy()
  })

  return { editor }
}
