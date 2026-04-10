import { ref } from 'vue'
import type {
  Activity,
  MatchActivityOptions,
  CreateActivityAttemptPayload,
  ActivityAttemptResponse,
} from '../types'

type ToastApi = {
  success: (message: string) => void
  error: (message: string) => void
}

type MutationHandlers<T> = {
  onSuccess: (data: T) => void
  onError: (err: Error) => void
}

type UseActivitiesAttemptParams = {
  createAttempt: (
    payload: { activityId: number; payload: CreateActivityAttemptPayload },
    handlers: MutationHandlers<ActivityAttemptResponse | null>
  ) => void
  toast: ToastApi
}

export function useActivitiesAttempt(params: UseActivitiesAttemptParams) {
  const { createAttempt, toast } = params

  const activityToAttempt = ref<Activity | null>(null)
  const attemptAnswer = ref<{
    selectedOption?: number
    answer?: boolean
    fillAnswer?: string
    matchPairs?: [number, number][]
  }>({})
  const attemptResult = ref<ActivityAttemptResponse | null>(null)
  const showAttemptModal = ref(false)

  function openAttemptModal(act: Activity) {
    activityToAttempt.value = act
    attemptResult.value = null
    if (act.type === 'MULTIPLE_CHOICE') attemptAnswer.value = { selectedOption: 0 }
    else if (act.type === 'TRUE_FALSE') attemptAnswer.value = { answer: true }
    else if (act.type === 'FILL_BLANK') attemptAnswer.value = { fillAnswer: '' }
    else if (act.type === 'MATCH') {
      const opts = act.options as MatchActivityOptions
      const n = Math.max(opts.leftItems?.length ?? 0, opts.rightItems?.length ?? 0)
      attemptAnswer.value = { matchPairs: Array.from({ length: n }, (_, i) => [i, i] as [number, number]) }
    } else attemptAnswer.value = {}
    showAttemptModal.value = true
  }

  function closeAttemptModal() {
    showAttemptModal.value = false
    activityToAttempt.value = null
    attemptResult.value = null
    attemptAnswer.value = {}
  }

  function submitAttempt() {
    const act = activityToAttempt.value
    if (!act) return
    let studentAnswer: CreateActivityAttemptPayload['studentAnswer']
    if (act.type === 'MULTIPLE_CHOICE' && typeof attemptAnswer.value.selectedOption === 'number') {
      studentAnswer = { selectedOption: attemptAnswer.value.selectedOption }
    } else if (act.type === 'TRUE_FALSE' && typeof attemptAnswer.value.answer === 'boolean') {
      studentAnswer = { answer: attemptAnswer.value.answer }
    } else if (act.type === 'FILL_BLANK' && attemptAnswer.value.fillAnswer != null) {
      studentAnswer = { answer: attemptAnswer.value.fillAnswer }
    } else if (act.type === 'MATCH' && attemptAnswer.value.matchPairs) {
      studentAnswer = { matches: attemptAnswer.value.matchPairs }
    } else {
      toast.error('Completa tu respuesta.')
      return
    }
    createAttempt(
      { activityId: act.id, payload: { studentAnswer } },
      {
        onSuccess: (data) => {
          if (data) attemptResult.value = data
          toast.success(data?.isCorrect ? '¡Correcto!' : 'Incorrecto. Revisa la explicación.')
        },
        onError: (err: Error) => toast.error(err.message || 'Error al enviar'),
      }
    )
  }

  return {
    activityToAttempt,
    attemptAnswer,
    attemptResult,
    showAttemptModal,
    openAttemptModal,
    closeAttemptModal,
    submitAttempt,
  }
}
