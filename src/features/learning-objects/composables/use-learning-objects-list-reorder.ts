import type { LearningObject } from '../types'
import { useReorderLearningObjects } from './mutations/use-reorder-learning-objects'

export function useLearningObjectsListReorder(moduleId: number) {
  const { mutate: reorderLearningObjects, isPending: isReorderingLearningObjects } =
    useReorderLearningObjects(moduleId)

  function reorderByDrag(
    movedLo: LearningObject,
    targetLo: LearningObject,
    options?: { onSuccess?: () => void; onError?: (error: unknown) => void },
  ) {
    reorderLearningObjects(
      {
        id: movedLo.id,
        orderIndex: targetLo.orderIndex,
      },
      options,
    )
  }

  return { reorderByDrag, isReorderingLearningObjects }
}
