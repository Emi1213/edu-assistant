import type { MaybeRef } from 'vue'
import { computed, unref } from 'vue'
import { useLearningObjects } from './queries/use-pages'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 100

export function useLearningObjectsTable(moduleId: MaybeRef<number>) {
  const learningObjectParams = computed(() => ({
    moduleId: unref(moduleId),
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
  }))

  const { data: learningObjectsResponse, isLoading: isLoadingLearningObjects } = useLearningObjects(learningObjectParams)

  const learningObjects = computed(() => learningObjectsResponse.value?.records ?? [])

  return {
    learningObjects,
    isLoadingLearningObjects,
    learningObjectsResponse,
  }
}

