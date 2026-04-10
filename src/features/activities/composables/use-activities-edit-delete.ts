import { ref } from 'vue'
import type {
  Activity,
  ActivityType,
  ActivityOptionsByType,
  UpdateActivityPayload,
} from '../types'
import {
  buildUpdatePayloadFromEditForm,
  getOptionsAndCorrectAnswer,
  toEditOptionsShape,
} from '../utils/activity-payload.utils'

type ToastApi = {
  success: (message: string) => void
  error: (message: string) => void
}

type MutationHandlers<T> = {
  onSuccess: (data: T) => void
  onError: (err: Error) => void
}

type UseActivitiesEditDeleteParams = {
  updateActivity: (
    payload: { activityId: number; payload: UpdateActivityPayload },
    handlers: MutationHandlers<unknown>
  ) => void
  deleteActivity: (activityId: number, handlers: MutationHandlers<unknown>) => void
  refetchActivities: () => void
  toast: ToastApi
}

type EditFormShape = {
  activityId?: number
  type: ActivityType
  question: string
  options: ActivityOptionsByType
  explanation?: string
  difficulty: number
  isApprovedByTeacher: boolean
  usedAsExample: boolean
}

export function useActivitiesEditDelete(params: UseActivitiesEditDeleteParams) {
  const { updateActivity, deleteActivity, refetchActivities, toast } = params

  const showEditModal = ref(false)
  const activityToEdit = ref<Activity | null>(null)
  const editForm = ref<EditFormShape>({
    type: 'MULTIPLE_CHOICE',
    question: '',
    options: { options: ['', '', '', ''], correctAnswer: 0 },
    difficulty: 2,
    isApprovedByTeacher: false,
    usedAsExample: false,
  })

  const activityToDelete = ref<Activity | null>(null)

  function openEditModal(act: Activity) {
    activityToEdit.value = act
    const { options } = getOptionsAndCorrectAnswer(act)
    editForm.value = {
      activityId: act.id,
      type: act.type,
      question: act.question,
      options: toEditOptionsShape(act.type, options),
      explanation: typeof act.explanation === 'string' ? act.explanation : '',
      difficulty: act.difficulty,
      isApprovedByTeacher: act.isApprovedByTeacher,
      usedAsExample: act.usedAsExample,
    }
    showEditModal.value = true
  }

  function closeEditModal() {
    showEditModal.value = false
    activityToEdit.value = null
  }

  function submitUpdateActivity() {
    const id = editForm.value.activityId
    if (id == null) return
    const payload: UpdateActivityPayload = buildUpdatePayloadFromEditForm(editForm.value)
    updateActivity(
      { activityId: id, payload },
      {
        onSuccess: () => {
          toast.success('Actividad actualizada.')
          closeEditModal()
          refetchActivities()
        },
        onError: (err: Error) => toast.error(err.message || 'Error al actualizar'),
      }
    )
  }

  function confirmDelete(act: Activity) {
    activityToDelete.value = act
  }

  function closeDeleteConfirm() {
    activityToDelete.value = null
  }

  function doDeleteActivity() {
    const act = activityToDelete.value
    if (!act) return
    deleteActivity(act.id, {
      onSuccess: () => {
        toast.success('Actividad eliminada.')
        closeDeleteConfirm()
        refetchActivities()
      },
      onError: (err: Error) => toast.error(err.message || 'Error al eliminar'),
    })
  }

  return {
    showEditModal,
    activityToEdit,
    editForm,
    openEditModal,
    closeEditModal,
    submitUpdateActivity,
    activityToDelete,
    confirmDelete,
    closeDeleteConfirm,
    doDeleteActivity,
  }
}
