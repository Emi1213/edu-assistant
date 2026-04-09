import type { LearningObject, ReorderLearningObjectsPayload } from '../types'

export function sortLearningObjectsByOrderIndex(list: LearningObject[]): LearningObject[] {
  return [...list].sort((a, b) => {
    const byOrder = a.orderIndex - b.orderIndex
    return byOrder !== 0 ? byOrder : a.id - b.id
  })
}

export function buildReorderPayloadAfterMove(
  sorted: LearningObject[],
  fromIndex: number,
  toIndex: number
): ReorderLearningObjectsPayload | null {
  if (fromIndex === toIndex) return null
  if (fromIndex < 0 || fromIndex >= sorted.length) return null
  if (toIndex < 0 || toIndex >= sorted.length) return null
  const next = [...sorted]
  const [removed] = next.splice(fromIndex, 1)
  if (removed === undefined) return null
  next.splice(toIndex, 0, removed)
  return {
    los: next.map((lo, i) => ({ id: lo.id, orderIndex: i + 1 })),
  }
}
