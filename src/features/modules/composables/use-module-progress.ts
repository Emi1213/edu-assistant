import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { useLearningObjects } from '@/features/learning-objects/composables/queries/use-learning-objects'
import { useRoles } from '@/features/auth/composables/use-roles'

export function useModuleProgress(moduleId: MaybeRefOrGetter<number>, isOwner: MaybeRefOrGetter<boolean>) {
  const { isStudent, isAdmin } = useRoles()

  const showProgress = computed(() => {
    if (isStudent.value) return true
    return !toValue(isOwner) && !isAdmin.value
  })

  const { data: loResponse } = useLearningObjects(computed(() => ({
    moduleId: toValue(moduleId),
    limit: 1000 
  })))

  const totalLo = computed(() => loResponse.value?.records.length ?? 0)
  const visitedLo = computed(() => loResponse.value?.records.filter(lo => !!lo.progress).length ?? 0)

  const isCompleted = computed(() => totalLo.value > 0 && visitedLo.value === totalLo.value)
  const isStarted = computed(() => visitedLo.value > 0 && visitedLo.value < totalLo.value)

  return {
    showProgress,
    isCompleted,
    isStarted,
    totalLo,
    visitedLo,
    loResponse
  }
}
