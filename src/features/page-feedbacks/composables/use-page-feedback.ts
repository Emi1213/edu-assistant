import { ref, computed, type Ref } from 'vue'
import { useCreateFeedback } from './mutations/use-create-feedback'
import { useUpdateFeedback } from './mutations/use-update-feedback'
import { useDeleteFeedback } from './mutations/use-delete-feedback'
import { useAuthStore } from '@/features/auth/context/auth-store'
import { useToast } from '@/shared/composables/use-toast'
import type { PageFeedback } from '../types/page-feedbacks.types'

export function usePageFeedback(pageId: number, feedbacks: Ref<PageFeedback[]> | PageFeedback[] | null | undefined) {
  const authStore = useAuthStore()
  const toast = useToast()

  const isEditing = ref(false)
  const feedbackContent = ref('')
  const showDeleteDialog = ref(false)

  const { mutate: createFeedback, isPending: isCreating } = useCreateFeedback(pageId)
  const { mutate: updateFeedback, isPending: isUpdating } = useUpdateFeedback(pageId)
  const { mutate: deleteFeedback, isPending: isDeleting } = useDeleteFeedback(pageId)

  const feedbacksValue = computed(() => {
    const value = feedbacks && typeof feedbacks === 'object' && 'value' in feedbacks ? feedbacks.value : feedbacks
    return value || []
  })

  const userFeedback = computed(() => {
    return feedbacksValue.value.find(f => f.user.id === authStore.user?.id)
  })

  const startEditing = () => {
    isEditing.value = true
    feedbackContent.value = userFeedback.value?.feedback || ''
    setTimeout(() => {
      document.getElementById('feedback-textarea')?.focus()
    }, 100)
  }

  const cancelEditing = () => {
    isEditing.value = false
    feedbackContent.value = ''
  }

  const saveFeedback = () => {
    if (!feedbackContent.value.trim()) {
      toast.warning('El feedback no puede estar vacío')
      return
    }

    if (userFeedback.value) {
      updateFeedback(
        {
          feedbackId: userFeedback.value.id,
          payload: { feedback: feedbackContent.value.trim() },
        },
        {
          onSuccess: () => {
            toast.success('Feedback actualizado exitosamente')
            cancelEditing()
          },
          onError: (error: any) => {
            toast.error(error.message || 'Error al actualizar el feedback')
          },
        }
      )
    } else {
      createFeedback(
        {
          pageId,
          feedback: feedbackContent.value.trim(),
        },
        {
          onSuccess: () => {
            toast.success('Feedback enviado exitosamente')
            cancelEditing()
          },
          onError: (error: any) => {
            toast.error(error.message || 'Error al enviar el feedback')
          },
        }
      )
    }
  }

  const openDeleteDialog = () => {
    showDeleteDialog.value = true
  }

  const cancelDelete = () => {
    showDeleteDialog.value = false
  }

  const confirmDelete = () => {
    if (!userFeedback.value) return

    deleteFeedback(userFeedback.value.id, {
      onSuccess: () => {
        toast.success('Feedback eliminado exitosamente')
        cancelDelete()
      },
      onError: (error: any) => {
        toast.error(error.message || 'Error al eliminar el feedback')
        cancelDelete()
      },
    })
  }

  return {
    isEditing,
    feedbackContent,
    isCreating,
    isUpdating,
    isDeleting,
    showDeleteDialog,
    userFeedback,
    feedbacksValue,
    startEditing,
    cancelEditing,
    saveFeedback,
    openDeleteDialog,
    cancelDelete,
    confirmDelete,
  }
}
