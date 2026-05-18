import type { Ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import type { EditorState } from '@tiptap/pm/state'
import type { Node as PMNode } from '@tiptap/pm/model'
import { Fragment } from '@tiptap/pm/model'
import { ref, computed } from 'vue'
import { useLearningObjects } from '../queries/use-learning-objects'
import type { LearningObjectsQueryParams } from '../../types'

function findLearningObjectLinkAround(
  state: EditorState,
  pos: number
): { from: number; to: number; node: PMNode } | null {
  const $pos = state.doc.resolve(pos)
  for (let d = $pos.depth; d > 0; d--) {
    const node = $pos.node(d)
    if (node.type.name === 'learningObjectLink') {
      return { from: $pos.before(d), to: $pos.after(d), node }
    }
  }
  return null
}

function replaceRangeWithLearningObjectLinkNode(
  editor: Editor,
  from: number,
  to: number,
  attrs: { targetLearningObjectId: number; mentionText: string }
) {
  const state = editor.state
  const linkType = state.schema.nodes.learningObjectLink
  if (!linkType) return
  const slice = state.doc.slice(from, to)
  const text = attrs.mentionText.trim()
  const inner =
    slice.content.size > 0 ? slice.content : Fragment.from(state.schema.text(text))
  const node = linkType.create(
    {
      targetLearningObjectId: attrs.targetLearningObjectId,
      mentionText: text,
    },
    inner
  )
  editor.view.dispatch(state.tr.replaceWith(from, to, node))
}

export function useLearningObjectEditorLinkModal(
  editor: Ref<Editor | undefined>,
  _learningObjectId: Ref<number>,
  moduleId: Ref<number>
) {
  const showPageLinkModal = ref(false)
  const searchQuery = ref('')
  const pageLinkForm = ref<{ targetLearningObjectId: number | null; mentionText: string }>({
    targetLearningObjectId: null,
    mentionText: '',
  })
  const editingLinkRange = ref<{ from: number; to: number } | null>(null)

  const params = computed<LearningObjectsQueryParams>(() => ({
    moduleId: moduleId.value,
    search: searchQuery.value,
    limit: 20
  }))

  const { data: moduleLearningObjects, isFetching } = useLearningObjects(params)

  const isEditingLearningObjectLink = computed(() => editingLinkRange.value !== null)

  const openPageLinkModal = () => {
    const ed = editor.value
    if (!ed) return

    const sel = ed.state.selection
    const around = findLearningObjectLinkAround(ed.state, sel.from)

    if (around) {
      editingLinkRange.value = { from: around.from, to: around.to }
      const id = Number(around.node.attrs.targetLearningObjectId ?? 0)
      const display =
        around.node.textContent ||
        String(around.node.attrs.mentionText ?? '').trim() ||
        ed.state.doc.textBetween(sel.from, sel.to, '')
      pageLinkForm.value = {
        targetLearningObjectId: id > 0 ? id : null,
        mentionText: display.trim(),
      }
    } else {
      editingLinkRange.value = null
      const selectedText =
        sel.from !== sel.to ? ed.state.doc.textBetween(sel.from, sel.to) : ''
      pageLinkForm.value = {
        targetLearningObjectId: null,
        mentionText: selectedText.trim(),
      }
    }
    searchQuery.value = ''
    showPageLinkModal.value = true
  }

  const closePageLinkModal = () => {
    showPageLinkModal.value = false
    pageLinkForm.value = { targetLearningObjectId: null, mentionText: '' }
    editingLinkRange.value = null
    searchQuery.value = ''
  }

  const submitPageLink = () => {
    const ed = editor.value
    if (!ed || !pageLinkForm.value.targetLearningObjectId || !pageLinkForm.value.mentionText.trim()) return

    const targetId = pageLinkForm.value.targetLearningObjectId
    const mention = pageLinkForm.value.mentionText.trim()

    const range = editingLinkRange.value
    if (range) {
      replaceRangeWithLearningObjectLinkNode(ed, range.from, range.to, {
        targetLearningObjectId: targetId,
        mentionText: mention,
      })
    } else {
      ed.chain().focus().setLearningObjectLink(targetId, mention).run()
    }
    closePageLinkModal()
  }

  const removeLearningObjectLink = () => {
    const ed = editor.value
    const range = editingLinkRange.value
    if (!ed || !range) return

    const state = ed.state
    const node = state.doc.nodeAt(range.from)
    if (!node || node.type.name !== 'learningObjectLink') {
      closePageLinkModal()
      return
    }
    const end = range.from + node.nodeSize
    const fallback = String(node.attrs.mentionText ?? '').trim()
    const inner =
      node.content.size > 0
        ? node.content
        : Fragment.from(state.schema.text(fallback || ' '))
    ed.view.dispatch(state.tr.replaceWith(range.from, end, inner))
    closePageLinkModal()
  }

  return {
    showPageLinkModal,
    searchQuery,
    pageLinkForm,
    isFetching,
    modulePages: computed(() => moduleLearningObjects.value?.records ?? []),
    isEditingLearningObjectLink,
    openPageLinkModal,
    closePageLinkModal,
    submitPageLink,
    removeLearningObjectLink,
  }
}
