import { ref } from 'vue'
import { useCreateLearningObject } from './mutations/use-create-page'
import { useToast } from '@/shared/composables/use-toast'
import type { CreateLearningObjectPayload } from '../types'

export function useLearningObjectCreator(moduleId: number) {
  const toast = useToast()
  const isDialogOpen = ref(false)
  const learningObjectTitle = ref('')
  const isPublished = ref(false)

  const { mutate: createLearningObject, isPending: isCreating } = useCreateLearningObject(moduleId)

  const openDialog = () => {
    isDialogOpen.value = true
    learningObjectTitle.value = ''
    isPublished.value = false
  }

  const closeDialog = () => {
    isDialogOpen.value = false
    learningObjectTitle.value = ''
    isPublished.value = false
  }

  const handleCreate = () => {
    if (!learningObjectTitle.value.trim()) {
      toast.warning('El título del objeto de aprendizaje es requerido')
      return
    }

    const payload: CreateLearningObjectPayload = {
      moduleId,
      title: learningObjectTitle.value.trim(),
      isPublished: isPublished.value,
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
