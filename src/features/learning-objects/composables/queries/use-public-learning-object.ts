import type { MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { LearningObjectsDataSource } from '../../services/learning-objects.service'
import { QUERY_KEYS } from '@/shared/composables/query-key'

const learningObjectsDataSource = new LearningObjectsDataSource()

export function usePublicLearningObject(id: MaybeRefOrGetter<number>) {
  return useQuery({
    queryKey: computed(() => QUERY_KEYS.LEARNING_OBJECT_PUBLIC(toValue(id))),
    queryFn: () => learningObjectsDataSource.getByIdPublic(toValue(id)),
    enabled: computed(() => {
      const v = toValue(id)
      return Number.isFinite(v) && v > 0
    }),
  })
}
