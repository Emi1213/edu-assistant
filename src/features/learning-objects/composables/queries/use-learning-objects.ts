import type { ComputedRef } from 'vue'
import type { LearningObjectsQueryParams } from '../../types'
import { useQuery } from '@tanstack/vue-query'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import { LearningObjectsDataSource } from '../../services/learning-objects.service'

const learningObjectsDataSource = new LearningObjectsDataSource()

export function useLearningObjects(params: ComputedRef<LearningObjectsQueryParams>) {
  const query = useQuery({
    queryKey: QUERY_KEYS.LEARNING_OBJECTS(params.value),
    queryFn: () => {
      const { moduleId, ...queryParams } = params.value
      return learningObjectsDataSource.getByModuleId(moduleId, queryParams)
    },
  })
  return query
}

