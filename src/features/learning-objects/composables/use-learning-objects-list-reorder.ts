import type { LearningObject } from '../types'
import { useReorderLearningObjects } from './mutations/use-reorder-learning-objects'

export function useLearningObjectsListReorder(moduleId: number) {
  const { mutate: reorderLearningObjects, isPending: isReorderingLearningObjects } =
    useReorderLearningObjects(moduleId)

  function reorderByDrag(movedLo: LearningObject, targetLo: LearningObject) {
    reorderLearningObjects({
      id: movedLo.id,
      orderIndex: targetLo.orderIndex,
    })
  }

  return { reorderByDrag, isReorderingLearningObjects }
}
