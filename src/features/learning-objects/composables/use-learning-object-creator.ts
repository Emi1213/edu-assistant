import { ref } from 'vue'
import { useCreateLearningObject } from './mutations/use-create-learning-object'
import { useToast } from '@/shared/composables/use-toast'
import { useDisclosure } from '@/shared/composables/use-disclosure'
import type { CreateLearningObjectPayload } from '../types'

export function useLearningObjectCreator(moduleId: number) {
  const toast = useToast()
  const learningObjectTitle = ref('')
  const isPublished = ref(false)

  const resetForm = () => {
    learningObjectTitle.value = ''
    isPublished.value = false
  }

  const {
    isOpen: isDialogOpen,
    open: openDialog,
    close: closeDialog,
  } = useDisclosure(false, {
    onOpen: resetForm,
    onClose: resetForm,
  })

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
      typeId: 1,
    }

    createLearningObject(payload, {
      onSuccess: () => {
        toast.success('Objeto de aprendizaje creado exitosamente')
        closeDialog()
      },
      onError: (error: any) => {
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
