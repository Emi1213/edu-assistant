import type { MaybeRefOrGetter } from 'vue'
import { ref, onBeforeUnmount } from 'vue'
import { useEditor } from '@tiptap/vue-3'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Image from '@tiptap/extension-image'
import { ImageSuggestion } from '../tiptap-extensions/image-suggestion'
import { Concept } from '../tiptap-extensions/concept'
import { LearningObjectLink } from '../tiptap-extensions/learning-object-link'
import { createLearningObjectLink } from '../tiptap-extensions/editor-external-link'
import { useUpdateLearningObjectContent } from '../mutations/use-update-learning-object-content'
import { useLearningObjectContentConverter } from '../content/use-learning-object-content-converter'
import { useLearningObjectContentLoader } from '../content/use-learning-object-content-loader'
import { useToast } from '@/shared/composables/use-toast'
import { lowlight } from '@/shared/config/lowlight.config'
import { toImageDataUrl } from '@/shared/utils/image.utils'
import CodeBlockNodeView from '../../presentation/components/code-block-node-view.vue'
import ImageSuggestionNodeView from '../../presentation/components/image-suggestion-node-view.vue'
import type { LearningObject } from '../../types'

export function useLearningObjectEditor(learningObjectId: MaybeRefOrGetter<number>, initialContent = '') {
  const editorContent = ref('')
  const isMounted = ref(true)
  const toast = useToast()

  const { mutateAsync: updateContent, isPending: isSaving } = useUpdateLearningObjectContent(learningObjectId)
  const { createPayload } = useLearningObjectContentConverter()
  const { loadContentFromBlocks } = useLearningObjectContentLoader()

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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return VueNodeViewRenderer(CodeBlockNodeView as any)
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
      ImageSuggestion.extend({
        addNodeView() {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return VueNodeViewRenderer(ImageSuggestionNodeView as any)
        },
      }),
      Concept,
      LearningObjectLink,
      createLearningObjectLink(),
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

  const setContentFromLearningObject = (learningObject: LearningObject) => {
    if (editor.value && learningObject) {
      loadContentFromBlocks(editor.value, learningObject)
    }
  }

  const insertContent = (content: string) => {
    if (editor.value) {
      editor.value.commands.insertContent(content)
    }
  }

  const saveContent = async () => {
    if (!editor.value) return

    const payload = createPayload(editor.value)

    try {
      await updateContent(payload)
      toast.success('Contenido guardado exitosamente')
    } catch (error: unknown) {
      toast.error((error as { message?: string }).message || 'Error al guardar el contenido')
      throw error
    }
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
    setContentFromLearningObject,
    insertContent,
    saveContent,
  }
}
