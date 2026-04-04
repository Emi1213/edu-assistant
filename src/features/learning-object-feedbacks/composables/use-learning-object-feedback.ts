import { ref } from 'vue'
import { useCreateLearningObjectFeedback } from './mutations/use-create-learning-object-feedback'
import { useToast } from '@/shared/composables/use-toast'

export function useLearningObjectFeedback(learningObjectId: number) {
  const toast = useToast()
  const comment = ref('')
  
  const { mutateAsync: submitFeedback, isPending } = useCreateLearningObjectFeedback(learningObjectId)

  const handleSubmit = async () => {
    const feedbackText = comment.value.trim()
    
    if (!feedbackText) {
      toast.error('Por favor, escribe un comentario')
      return
    }

    try {
      await submitFeedback({
        learningObjectId,
        feedback: feedbackText,
      })
      toast.success('¡Gracias por tu feedback!')
      comment.value = ''
    } catch (error: unknown) {
      toast.error((error as Error).message || 'Error al enviar el feedback')
    }
  }

  return {
    comment,
    isPending,
    handleSubmit,
  }
}
