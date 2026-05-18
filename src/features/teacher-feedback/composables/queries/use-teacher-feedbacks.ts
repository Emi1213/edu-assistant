import { useQuery } from '@tanstack/vue-query'
import { teacherFeedbackService } from '../../services/teacher-feedback.service'
import type { ListTeacherFeedbackParams } from '../../types/teacher-feedback.types'
import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'

export function useTeacherFeedbacks(
  moduleId: MaybeRefOrGetter<number>, 
  params?: MaybeRefOrGetter<ListTeacherFeedbackParams>
) {
  return useQuery({
    queryKey: ['teacher-feedbacks', moduleId, params],
    queryFn: () => teacherFeedbackService.listByModule(toValue(moduleId), toValue(params)),
    enabled: () => !!toValue(moduleId),
  })
}
