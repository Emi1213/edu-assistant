import type { Editor } from '@tiptap/vue-3'
import type { LearningObject, LOContentBlock } from '../types'
import { normalizeTiptapContent } from './normalize-tiptap-content'

function countTopLevelNodesInBlock(block: LOContentBlock): number {
  const raw = block.tipTapContent?.content
  if (!raw?.length) return 0
  return normalizeTiptapContent(raw).length
}

export function findBlockIdForEditorPosition(
  editor: Editor | undefined,
  learningObject: LearningObject | null | undefined,
  pos: number
): number | null {
  if (!editor || !learningObject?.blocks?.length) return null

  const doc = editor.state.doc
  if (doc.childCount === 0) return null

  const clamped = Math.max(1, Math.min(pos, doc.content.size))
  const childIndex = doc.resolve(clamped).index(0)

  const blocks = [...learningObject.blocks].sort((a, b) => a.orderIndex - b.orderIndex)

  let cumulative = 0
  for (const block of blocks) {
    const n = countTopLevelNodesInBlock(block)
    if (childIndex < cumulative + n) {
      return typeof block.id === 'number' && block.id > 0 ? block.id : null
    }
    cumulative += n
  }

  const fallback = blocks.find((b) => typeof b.id === 'number' && b.id > 0)
  return fallback?.id ?? null
}
