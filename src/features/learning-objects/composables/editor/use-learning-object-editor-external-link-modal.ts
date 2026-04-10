import type { Ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { ref } from 'vue'

function normalizeHref(raw: string): string | null {
  const t = raw.trim()
  if (!t) return null
  if (/^mailto:/i.test(t) || /^tel:/i.test(t)) return t
  if (/^https?:\/\//i.test(t)) return t
  return `https://${t}`
}

export function useLearningObjectEditorExternalLinkModal(editor: Ref<Editor | undefined>) {
  const showExternalLinkModal = ref(false)
  const externalLinkForm = ref<{ href: string; label: string }>({ href: '', label: '' })

  const openExternalLinkModal = () => {
    const ed = editor.value
    if (!ed) return
    const linkAttrs = ed.getAttributes('link') as { href?: string }
    const sel = ed.state.selection
    const selectedText =
      sel.from !== sel.to ? ed.state.doc.textBetween(sel.from, sel.to) : ''

    externalLinkForm.value = {
      href: (linkAttrs.href ?? '').trim(),
      label: selectedText.trim(),
    }
    showExternalLinkModal.value = true
  }

  const closeExternalLinkModal = () => {
    showExternalLinkModal.value = false
    externalLinkForm.value = { href: '', label: '' }
  }

  const submitExternalLink = () => {
    const ed = editor.value
    if (!ed) return
    const href = normalizeHref(externalLinkForm.value.href)
    if (!href) return

    const { empty } = ed.state.selection
    if (empty) {
      const text = (externalLinkForm.value.label.trim() || href).trim()
      ed.chain()
        .focus()
        .insertContent({
          type: 'text',
          text,
          marks: [{ type: 'link', attrs: { href } }],
        })
        .run()
    } else {
      ed.chain().focus().setLink({ href }).run()
    }
    closeExternalLinkModal()
  }

  const removeExternalLink = () => {
    editor.value?.chain().focus().unsetLink().run()
    closeExternalLinkModal()
  }

  return {
    showExternalLinkModal,
    externalLinkForm,
    openExternalLinkModal,
    closeExternalLinkModal,
    submitExternalLink,
    removeExternalLink,
  }
}
