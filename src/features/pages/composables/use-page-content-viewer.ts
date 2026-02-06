import { onBeforeUnmount, watch } from 'vue'
import { useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { lowlight } from '@/shared/config/lowlight.config'
import type { Ref } from 'vue'

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
