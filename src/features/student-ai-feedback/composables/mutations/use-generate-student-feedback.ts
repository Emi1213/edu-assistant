import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { studentAiFeedbackService } from '../../services/student-ai-feedback.service'
import { useToast } from '@/shared/composables/use-toast'
import axios from 'axios'

export function useGenerateStudentFeedback(moduleId: number) {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: () => studentAiFeedbackService.generate(moduleId),
    onSuccess: (data) => {
      toast.success(data?.message || 'La generación de tu feedback ha comenzado. Te avisaremos cuando esté listo.')
      queryClient.invalidateQueries({ queryKey: ['student-feedbacks', moduleId] })
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
