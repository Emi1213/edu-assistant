import { ref, onBeforeUnmount } from 'vue'
import { useEditor } from '@tiptap/vue-3'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Image from '@tiptap/extension-image'
import { ImageSuggestion } from './tiptap-extensions/image-suggestion'
import { Concept } from './tiptap-extensions/concept'
import { PageLink } from './tiptap-extensions/page-link'
import ConceptTooltipNodeView from '../presentation/components/concept-tooltip-node-view.vue'
import { useUpdatePageContent } from './mutations/use-update-page-content'
import { usePageContentConverter } from './use-page-content-converter'
import { usePageContentLoader } from './use-page-content-loader'
import { useToast } from 'vue-toastification'
import { lowlight } from '@/shared/config/lowlight.config'
import CodeBlockNodeView from '../presentation/components/code-block-node-view.vue'
import type { Page } from '../types/pages.types'

function normalizeImageSrc(src: string): string {
  if (!src) return ''
  if (src.startsWith('data:')) return src
  return `data:image/png;base64,${src}`
}

export function usePageEditor(pageId: number, initialContent = '') {
  const editorContent = ref('')
  const isMounted = ref(true)
  const toast = useToast()

  const { mutate: updateContent, isPending: isSaving } = useUpdatePageContent(pageId)
  const { createPayload } = usePageContentConverter()
  const { loadContentFromBlocks } = usePageContentLoader()

  const editor = useEditor({
    content: initialContent,
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
          return VueNodeViewRenderer(CodeBlockNodeView as any)
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
      ImageSuggestion,
      Concept.extend({
        addNodeView() {
          return VueNodeViewRenderer(ConceptTooltipNodeView as any)
        },
      }),
      PageLink,
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[60vh]',
      },
    },
    onUpdate: ({ editor }) => {
      editorContent.value = editor.getHTML()
    },
  })

  const setContent = (content: string) => {
    if (editor.value && content) {
      editorContent.value = content
      editor.value.commands.setContent(content)
    }
  }

  const setContentFromPage = (page: Page) => {
    if (editor.value && page) {
      loadContentFromBlocks(editor.value, page)
    }
  }

  const insertContent = (content: string) => {
    if (editor.value) {
      editor.value.commands.insertContent(content)
    }
  }

  const saveContent = () => {
    if (!editor.value) return

    const payload = createPayload(editor.value)

    updateContent(payload, {
      onSuccess: () => {
        toast.success('Contenido guardado exitosamente')
      },
      onError: (error: any) => {
        toast.error(error.message || 'Error al guardar el contenido')
      },
    })
  }

  onBeforeUnmount(() => {
    isMounted.value = false
    editor.value?.destroy()
  })

  return {
    editor,
    editorContent,
    isMounted,
    isSaving,
    setContent,
    setContentFromPage,
    insertContent,
    saveContent,
  }
}
