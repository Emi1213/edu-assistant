import type { LearningObject } from '../types'
import { buildReorderPayloadAfterMove } from '../utils/learning-objects-reorder.utils'
import { useReorderLearningObjects } from './mutations/use-reorder-learning-objects'

export function useLearningObjectsListReorder(moduleId: number) {
  const { mutate: reorderLearningObjects, isPending: isReorderingLearningObjects } =
    useReorderLearningObjects(moduleId)

  function reorderByDrag(sorted: LearningObject[], fromIndex: number, toIndex: number) {
    const payload = buildReorderPayloadAfterMove(sorted, fromIndex, toIndex)
    if (payload) reorderLearningObjects(payload)
  }

  return { reorderByDrag, isReorderingLearningObjects }
}
