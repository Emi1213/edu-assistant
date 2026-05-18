import { ref } from 'vue'
import { useCreateLearningObject } from './mutations/use-create-learning-object'
import { useToast } from '@/shared/composables/use-toast'
import { useDisclosure } from '@/shared/composables/use-disclosure'
import type { CreateLearningObjectPayload } from '../types'

const DEFAULT_TYPE_ID = 1

export function useLearningObjectCreator(moduleId: number) {
  const toast = useToast()
  const learningObjectTitle = ref('')
  const isPublished = ref(false)
  const currentTypeId = ref<number>(DEFAULT_TYPE_ID)

  const resetForm = () => {
    learningObjectTitle.value = ''
    isPublished.value = false
  }

  const {
    isOpen: isDialogOpen,
    open: openDialogInternal,
    close: closeDialog,
  } = useDisclosure(false, {
    onOpen: resetForm,
    onClose: resetForm,
  })

  const openDialog = (typeId?: number) => {
    currentTypeId.value = typeId ?? DEFAULT_TYPE_ID
    openDialogInternal()
  }

  const { mutate: createLearningObject, isPending: isCreating } = useCreateLearningObject(moduleId)

  const handleCreate = () => {
    if (!learningObjectTitle.value.trim()) {
      toast.warning('El título del objeto de aprendizaje es requerido')
      return
    }

    const payload: CreateLearningObjectPayload = {
      moduleId,
      title: learningObjectTitle.value.trim(),
      isPublished: isPublished.value,
      typeId: currentTypeId.value,
    }

    createLearningObject(payload, {
      onSuccess: () => {
        toast.success('Objeto de aprendizaje creado exitosamente')
        closeDialog()
      },
      onError: (error) => {
        toast.error(error.message || 'Error al crear el objeto de aprendizaje')
      },
    })
  }

  return {
    isDialogOpen,
    learningObjectTitle,
    isPublished,
    isCreating,
    openDialog,
    closeDialog,
    handleCreate,
  }
}
