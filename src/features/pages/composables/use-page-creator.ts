import { ref } from 'vue'
import { useCreatePage } from './mutations/use-create-page'
import { useToast } from '@/shared/composables/use-toast'
import type { CreateLearningObjectPayload } from '@/features/learning-objects/types/learning-object.types'

export function usePageCreator(moduleId: number) {
  const toast = useToast()
  const isDialogOpen = ref(false)
  const pageTitle = ref('')
  const isPublished = ref(false)
  const activeTypeId = ref<number>(0)

  const { mutate: createPage, isPending: isCreating } = useCreatePage(moduleId)

  const openDialog = (typeId: number) => {
    activeTypeId.value = typeId
    isDialogOpen.value = true
    pageTitle.value = ''
    isPublished.value = false
  }

  const closeDialog = () => {
    isDialogOpen.value = false
    pageTitle.value = ''
    isPublished.value = false
  }

  const handleCreate = () => {
    if (!pageTitle.value.trim()) {
      toast.warning('El título de la página es requerido')
      return
    }

    const payload: CreateLearningObjectPayload = {
      moduleId,
      title: pageTitle.value.trim(),
      typeId: activeTypeId.value,
      isPublished: isPublished.value,
    }

    createPage(payload, {
      onSuccess: () => {
        toast.success('Página creada exitosamente')
        closeDialog()
      },
      onError: (error: any) => {
        toast.error(error.message || 'Error al crear la página')
      },
    })
  }

  return {
    isDialogOpen,
    pageTitle,
    isPublished,
    isCreating,
    openDialog,
    closeDialog,
    handleCreate,
  }
}
