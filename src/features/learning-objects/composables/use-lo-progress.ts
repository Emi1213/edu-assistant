import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { loProgressService } from '../services/lo-progress.service'
import { QUERY_KEYS } from '@/shared/composables/query-key'

export function useLoProgress(learningObjectId: MaybeRefOrGetter<number>) {
  const queryClient = useQueryClient()
  const loId = computed(() => toValue(learningObjectId))

  const { data: progress, isLoading: isLoadingProgress } = useQuery({
    queryKey: computed(() => QUERY_KEYS.LO_PROGRESS(loId.value)),
    queryFn: () => loProgressService.getProgress(loId.value),
    enabled: computed(() => !!loId.value),
  })

  const { mutate: markVisitedMutation, isPending: isMarkingVisited } = useMutation({
    mutationFn: (vars: { isCompleted?: boolean }) =>
      loProgressService.markVisited({ learningObjectId: loId.value, isCompleted: vars.isCompleted }),
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.LO_PROGRESS(loId.value), data)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEARNING_OBJECT(loId.value) })
      queryClient.invalidateQueries({ queryKey: ['learning-objects'] }) 
      queryClient.invalidateQueries({ queryKey: ['videos', 'detail', loId.value] })
    },
  })

  const isVisited = computed(() => !!progress.value)
  const isCompleted = computed(() => !!progress.value?.isCompleted)

  const markAsVisited = () => {
    if (!isVisited.value) {
      markVisitedMutation({ isCompleted: false })
    }
  }

  const markAsCompleted = () => {
    if (!isCompleted.value) {
      markVisitedMutation({ isCompleted: true })
    }
  }

  return {
    progress,
    isLoading: isLoadingProgress,
    isVisited,
    isCompleted,
    isMarkingVisited,
    markAsVisited,
    markAsCompleted,
  }
}
