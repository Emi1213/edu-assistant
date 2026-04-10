import { ref, type Ref } from 'vue'
import type { ActivityType, CreateActivityPayload } from '../types'
import type { ActivityType as GenActivityType, GenerateActivityPayload } from '@/features/content-generation/types'
import { getDefaultCreateOptionsForType } from '../constants/activity.constants'
import {
  type GeneratedActivityPreview,
  buildCreatePayloadFromForm,
  buildCreatePayloadFromPreview,
  isActivityResponse,
  mapApiActivityToPreview,
} from '../utils/activities-create-generate.utils'

type MutationHandlers<T> = {
  onSuccess: (data: T) => void
  onError: (err: Error) => void
}

type ToastApi = {
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
  warning: (message: string) => void
}

type CreateGenerateParams = {
  learningObjectId: Ref<number>
  createActivity: (payload: CreateActivityPayload, handlers: MutationHandlers<unknown>) => void
  generateActivity: (payload: GenerateActivityPayload, handlers: MutationHandlers<unknown>) => void
  toast: ToastApi
  refetchActivities: () => void
}

export function useActivitiesCreateGenerate(params: CreateGenerateParams) {
  const { learningObjectId, createActivity, generateActivity, toast, refetchActivities } = params

  const showCreateModal = ref(false)
  const createForm = ref<CreateActivityPayload>({
    type: 'MULTIPLE_CHOICE',
    options: getDefaultCreateOptionsForType('MULTIPLE_CHOICE'),
    difficulty: 2,
    isApprovedByTeacher: false,
  })
  const matchColumnLeft = ref('')
  const matchColumnRight = ref('')

  const showGenerateModal = ref(false)
  const generateForm = ref({
    type: 'MULTIPLE_CHOICE' as GenActivityType,
    language: 'es',
    difficulty: 2,
    instructions: '',
  })
  const generatedPreview = ref<GeneratedActivityPreview | null>(null)

  function openCreateModal() {
    createForm.value = {
      type: 'MULTIPLE_CHOICE',
      options: getDefaultCreateOptionsForType('MULTIPLE_CHOICE'),
      difficulty: 2,
      isApprovedByTeacher: false,
    }
    matchColumnLeft.value = ''
    matchColumnRight.value = ''
    showCreateModal.value = true
  }

  function onCreateTypeChange() {
    createForm.value.options = getDefaultCreateOptionsForType(createForm.value.type)
    if (createForm.value.type === 'MATCH') {
      matchColumnLeft.value = ''
      matchColumnRight.value = ''
    }
  }

  function closeCreateModal() {
    showCreateModal.value = false
  }

  function submitCreateActivity() {
    const { payload, error } = buildCreatePayloadFromForm(
      createForm.value,
      matchColumnLeft.value,
      matchColumnRight.value
    )
    if (!payload) {
      if (error) toast.error(error)
      return
    }
    createActivity(payload, {
      onSuccess: () => {
        toast.success('Actividad creada')
        closeCreateModal()
      },
      onError: (err: Error) => {
        toast.error(err.message || 'Error al crear la actividad')
      },
    })
  }

  function openGenerateModal() {
    generateForm.value = {
      type: 'MULTIPLE_CHOICE' as GenActivityType,
      language: 'es',
      difficulty: 2,
      instructions: '',
    }
    generatedPreview.value = null
    showGenerateModal.value = true
  }

  function closeGenerateModal() {
    showGenerateModal.value = false
    generatedPreview.value = null
  }

  function discardGeneratedPreview() {
    generatedPreview.value = null
    toast.info('Vista previa descartada. Puedes generar otra.')
  }

  function handleGenerateActivity() {
    generateActivity(
      {
        learningObjectId: learningObjectId.value,
        type: generateForm.value.type,
        language: generateForm.value.language,
        difficulty: generateForm.value.difficulty,
        instructions: generateForm.value.instructions || undefined,
      },
      {
        onSuccess: (data: unknown) => {
          let raw: unknown = data
          if (isActivityResponse(data)) raw = data.activity
          const one = Array.isArray(raw) ? raw[0] : raw
          const activity = one && typeof one === 'object' && one !== null
            ? (one as Record<string, unknown>)
            : null

          if (!activity) {
            toast.success('Actividad generada.')
            refetchActivities()
            closeGenerateModal()
            return
          }

          const preview = mapApiActivityToPreview(activity, generateForm.value.type)
          if (!preview) {
            toast.warning('La respuesta no tiene el formato esperado para este tipo.')
            return
          }
          generatedPreview.value = preview
          toast.success('Vista previa lista. Revisa y guarda o descarta.')
        },
        onError: (err: Error) => {
          toast.error(err.message || 'Error al generar la actividad')
        },
      }
    )
  }

  function saveGeneratedPreview() {
    const preview = generatedPreview.value
    if (!preview) return
    const { payload, error } = buildCreatePayloadFromPreview(
      preview,
      (generateForm.value.type || preview.type || 'MULTIPLE_CHOICE') as ActivityType,
      generateForm.value.difficulty
    )
    if (!payload) {
      if (error) toast.error(error)
      return
    }

    createActivity(payload, {
      onSuccess: () => {
        toast.success('Actividad guardada.')
        generatedPreview.value = null
        refetchActivities()
        closeGenerateModal()
      },
      onError: (err: Error) => {
        toast.error(err.message || 'Error al guardar la actividad')
      },
    })
  }

  return {
    showCreateModal,
    createForm,
    matchColumnLeft,
    matchColumnRight,
    openCreateModal,
    onCreateTypeChange,
    closeCreateModal,
    submitCreateActivity,
    showGenerateModal,
    generateForm,
    generatedPreview,
    openGenerateModal,
    closeGenerateModal,
    discardGeneratedPreview,
    handleGenerateActivity,
    saveGeneratedPreview,
  }
}
