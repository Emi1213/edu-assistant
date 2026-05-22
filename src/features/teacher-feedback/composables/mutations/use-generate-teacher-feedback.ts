import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { teacherFeedbackService } from '../../services/teacher-feedback.service'
import { useToast } from '@/shared/composables/use-toast'
import type { TeacherFeedbackScope } from '../../types/teacher-feedback.types'
import axios from 'axios'

export function useGenerateTeacherFeedback(moduleId: number) {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (scope?: TeacherFeedbackScope) => teacherFeedbackService.generate(moduleId, scope),
    onSuccess: (data) => {
      toast.success(data?.message || 'La generación de feedback ha comenzado. Te avisaremos cuando esté listo.')
      queryClient.invalidateQueries({ queryKey: ['teacher-feedbacks', moduleId] })
    },
    onError: (error) => {
      let message = 'Error al solicitar la generación de feedback'
      
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message || message
        
        if (error.response?.status === 409) {
          toast.warning(message)
          return
        }
      } else if (error instanceof Error) {
        message = error.message
      }

      toast.error(message)
    }
  })
}
