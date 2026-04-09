import { useQuery } from '@tanstack/vue-query'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import { LearningObjectsDataSource } from '../../services/learning-objects.service'

const dataSource = new LearningObjectsDataSource()

export function useLearningObjectTypes() {
  return useQuery({
    queryKey: QUERY_KEYS.LEARNING_OBJECT_TYPES(),
    queryFn: () => dataSource.getTypes(),
  })
}
