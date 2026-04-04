import { ref, computed, type Ref } from 'vue'
import { useCreateStudentQuestion } from './mutations/use-create-student-question'
import { useUpdateStudentQuestion } from './mutations/use-update-student-question'
import { useDeleteStudentQuestion } from './mutations/use-delete-student-question'
import { useCreateQuestionReply } from './mutations/use-create-question-reply'
import { useUpdateQuestionReply } from './mutations/use-update-question-reply'
import { useDeleteQuestionReply } from './mutations/use-delete-question-reply'
import { useAuthStore } from '@/features/auth/context/auth-store'
import { useToast } from '@/shared/composables/use-toast'
import type { StudentQuestion, QuestionReply } from '../types/student-questions.types'

export function useStudentQuestionsPanel(
  learningObjectId: number,
  studentQuestions: Ref<StudentQuestion[] | null | undefined> | StudentQuestion[] | null | undefined,
  isProfessor: boolean
) {
  const toast = useToast()
  const authStore = useAuthStore()

  const isCollapsed = ref(true)
  const isCreating = ref(false)
  const editingId = ref<number | null>(null)
  const newQuestion = ref('')
  const newIsPublic = ref(true)
  const editQuestion = ref('')
  const editIsPublic = ref(true)
  const showDeleteDialog = ref(false)
  const questionToDelete = ref<number | null>(null)

  const replyingToQuestionId = ref<number | null>(null)
  const newReplyText = ref('')
  const editingReplyId = ref<number | null>(null)
  const editReplyText = ref('')
  const showDeleteReplyDialog = ref(false)
  const replyToDelete = ref<number | null>(null)

  const { mutate: createQuestion, isPending: isCreatingQuestion } = useCreateStudentQuestion(learningObjectId)
  const { mutate: updateQuestion, isPending: isUpdatingQuestion } = useUpdateStudentQuestion(learningObjectId)
  const { mutate: deleteQuestion, isPending: isDeletingQuestion } = useDeleteStudentQuestion(learningObjectId)
  const { mutate: createReply, isPending: isCreatingReply } = useCreateQuestionReply(learningObjectId)
  const { mutate: updateReply, isPending: isUpdatingReply } = useUpdateQuestionReply(learningObjectId)
  const { mutate: deleteReply, isPending: isDeletingReply } = useDeleteQuestionReply(learningObjectId)

  const questionsList = computed(() => {
    const value =
      studentQuestions && typeof studentQuestions === 'object' && 'value' in studentQuestions
        ? studentQuestions.value
        : studentQuestions
    return value ?? []
  })

  const currentUserId = computed(() => authStore.user?.id ?? null)

  const canEditQuestion = (q: StudentQuestion) =>
    !isProfessor && currentUserId.value != null && q.user?.id === currentUserId.value

  const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value
  }

  const startCreating = () => {
    if (isCollapsed.value) isCollapsed.value = false
    isCreating.value = true
    newQuestion.value = ''
    newIsPublic.value = true
    setTimeout(() => document.getElementById('new-student-question-textarea')?.focus(), 100)
  }

  const cancelCreating = () => {
    isCreating.value = false
    newQuestion.value = ''
  }

  const saveNewQuestion = () => {
    if (!newQuestion.value.trim()) {
      toast.warning('La pregunta no puede estar vacía')
      return
    }
    createQuestion(
      {
        learningObjectId,
        question: newQuestion.value.trim(),
        isPublic: newIsPublic.value,
      },
      {
        onSuccess: () => {
          toast.success('Pregunta creada')
          cancelCreating()
        },
        onError: (e: unknown) => {
          toast.error(e instanceof Error ? e.message : 'Error al crear la pregunta')
        },
      }
    )
  }

  const startEditing = (q: StudentQuestion) => {
    editingId.value = q.id
    editQuestion.value = q.question
    editIsPublic.value = q.isPublic
    setTimeout(() => document.getElementById(`edit-student-question-${q.id}`)?.focus(), 100)
  }

  const cancelEditing = () => {
    editingId.value = null
    editQuestion.value = ''
  }

  const saveEdit = (id: number) => {
    if (!editQuestion.value.trim()) {
      toast.warning('La pregunta no puede estar vacía')
      return
    }
    updateQuestion(
      { id, payload: { question: editQuestion.value.trim(), isPublic: editIsPublic.value } },
      {
        onSuccess: () => {
          toast.success('Pregunta actualizada')
          cancelEditing()
        },
        onError: (e: unknown) => {
          toast.error(e instanceof Error ? e.message : 'Error al actualizar')
        },
      }
    )
  }

  const openDeleteDialog = (id: number) => {
    questionToDelete.value = id
    showDeleteDialog.value = true
  }

  const cancelDelete = () => {
    showDeleteDialog.value = false
    questionToDelete.value = null
  }

  const confirmDelete = () => {
    if (questionToDelete.value == null) return
    deleteQuestion(questionToDelete.value, {
      onSuccess: () => {
        toast.success('Pregunta eliminada')
        cancelDelete()
      },
      onError: (e: unknown) => {
        toast.error(e instanceof Error ? e.message : 'Error al eliminar')
        cancelDelete()
      },
    })
  }

  const formatDate = (date: string | Date) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (minutes < 1) return 'Hace un momento'
    if (minutes < 60) return `Hace ${minutes} min`
    if (hours < 24) return `Hace ${hours}h`
    if (days < 7) return `Hace ${days}d`
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const startReplying = (questionId: number) => {
    replyingToQuestionId.value = questionId
    newReplyText.value = ''
    setTimeout(() => document.getElementById(`new-reply-${questionId}`)?.focus(), 100)
  }

  const cancelReplying = () => {
    replyingToQuestionId.value = null
    newReplyText.value = ''
  }

  const saveNewReply = (questionId: number) => {
    if (!newReplyText.value.trim()) {
      toast.warning('La respuesta no puede estar vacía')
      return
    }
    createReply(
      { questionId, replyText: newReplyText.value.trim() },
      {
        onSuccess: () => {
          toast.success('Respuesta publicada')
          cancelReplying()
        },
        onError: (e: unknown) => {
          toast.error(e instanceof Error ? e.message : 'Error al publicar la respuesta')
        },
      }
    )
  }

  const startEditingReply = (reply: QuestionReply) => {
    editingReplyId.value = reply.id
    editReplyText.value = reply.replyText
    setTimeout(() => document.getElementById(`edit-reply-${reply.id}`)?.focus(), 100)
  }

  const cancelEditingReply = () => {
    editingReplyId.value = null
    editReplyText.value = ''
  }

  const saveEditReply = (replyId: number) => {
    if (!editReplyText.value.trim()) {
      toast.warning('La respuesta no puede estar vacía')
      return
    }
    updateReply(
      { id: replyId, payload: { replyText: editReplyText.value.trim() } },
      {
        onSuccess: () => {
          toast.success('Respuesta actualizada')
          cancelEditingReply()
        },
        onError: (e: unknown) => {
          toast.error(e instanceof Error ? e.message : 'Error al actualizar')
        },
      }
    )
  }

  const openDeleteReplyDialog = (replyId: number) => {
    replyToDelete.value = replyId
    showDeleteReplyDialog.value = true
  }

  const cancelDeleteReply = () => {
    showDeleteReplyDialog.value = false
    replyToDelete.value = null
  }

  const confirmDeleteReply = () => {
    if (replyToDelete.value == null) return
    deleteReply(replyToDelete.value, {
      onSuccess: () => {
        toast.success('Respuesta eliminada')
        cancelDeleteReply()
      },
      onError: (e: unknown) => {
        toast.error(e instanceof Error ? e.message : 'Error al eliminar')
        cancelDeleteReply()
      },
    })
  }

  const getReplies = (q: StudentQuestion): QuestionReply[] => q.replies ?? []

  return {
    isCollapsed,
    isCreating,
    editingId,
    newQuestion,
    newIsPublic,
    editQuestion,
    editIsPublic,
    isCreatingQuestion,
    isUpdatingQuestion,
    isDeletingQuestion,
    showDeleteDialog,
    questionsList,
    canEditQuestion,
    isProfessor,
    toggleCollapse,
    startCreating,
    cancelCreating,
    saveNewQuestion,
    startEditing,
    cancelEditing,
    saveEdit,
    openDeleteDialog,
    cancelDelete,
    confirmDelete,
    formatDate,
    replyingToQuestionId,
    newReplyText,
    editingReplyId,
    editReplyText,
    showDeleteReplyDialog,
    replyToDelete,
    isCreatingReply,
    isUpdatingReply,
    isDeletingReply,
    startReplying,
    cancelReplying,
    saveNewReply,
    startEditingReply,
    cancelEditingReply,
    saveEditReply,
    openDeleteReplyDialog,
    cancelDeleteReply,
    confirmDeleteReply,
    getReplies,
  }
}
