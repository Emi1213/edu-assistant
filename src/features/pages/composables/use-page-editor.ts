import { ref, watch, onBeforeUnmount } from 'vue'
import { useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

export function usePageEditor(initialContent = '') {
  const editorContent = ref('')
  const isMounted = ref(true)

  const editor = useEditor({
    content: initialContent,
    extensions: [StarterKit],
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

  const insertContent = (content: string) => {
    if (editor.value) {
      editor.value.commands.insertContent(content)
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
    setContent,
    insertContent,
  }
}
