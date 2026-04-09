import { useQuery } from '@tanstack/vue-query'
import { LearningObjectsDataSource } from '../../services/learning-objects.service'
import { QUERY_KEYS } from '@/shared/composables/query-key'

const learningObjectsDataSource = new LearningObjectsDataSource()

export function useLearningObject(id: number) {
  const query = useQuery({
    queryKey: QUERY_KEYS.LEARNING_OBJECT(id),
    queryFn: () => learningObjectsDataSource.getById(id),
  })
  return query
}

