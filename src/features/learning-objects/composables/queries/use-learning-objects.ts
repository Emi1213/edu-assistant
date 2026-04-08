import type { MaybeRef } from 'vue'
import { computed, unref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import { LearningObjectsDataSource } from '../../services/learning-objects.service'

const dataSource = new LearningObjectsDataSource()

export function useLearningObjects(moduleId: MaybeRef<number>, typeId: MaybeRef<number>) {
  const moduleIdValue = computed(() => unref(moduleId))
  const typeIdValue = computed(() => unref(typeId))

  const query = useQuery({
    queryKey: computed(() => [...QUERY_KEYS.LEARNING_OBJECTS(moduleIdValue.value), typeIdValue.value]),
    queryFn: () => dataSource.getByModuleId(moduleIdValue.value, typeIdValue.value),
    enabled: computed(() => typeIdValue.value > 0),
  })

  const learningObjects = computed(() => query.data.value?.records ?? [])

  return { ...query, learningObjects }
}
