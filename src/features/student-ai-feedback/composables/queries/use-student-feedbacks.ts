import { useQuery } from '@tanstack/vue-query'
import { studentAiFeedbackService } from '../../services/student-ai-feedback.service'
import type { ListStudentFeedbackParams } from '../../types/student-ai-feedback.types'
import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'

export function useStudentFeedbacks(
  moduleId: MaybeRefOrGetter<number>, 
  params?: MaybeRefOrGetter<ListStudentFeedbackParams>
) {
  return useQuery({
    queryKey: ['student-feedbacks', moduleId, params],
    queryFn: () => studentAiFeedbackService.listByModule(toValue(moduleId), toValue(params)),
    enabled: () => !!toValue(moduleId),
  })
}
