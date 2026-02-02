import { ref } from 'vue'
import { useCreateModule } from './mutations/use-create-module'
import { useUpdateModule } from './mutations/use-update-module'
import { useDeleteModule } from './mutations/use-delete-module'
import type { Module, CreateModule, UpdateModule } from '../types/modules.types'

export function useModulesList() {
  const drawerOpen = ref(false)
  const confirmDialogOpen = ref(false)
  const moduleToDelete = ref<Module | null>(null)
  const initialData = ref<Partial<Module>>()
  const createModule = useCreateModule()
  const updateModule = useUpdateModule()
  const deleteModule = useDeleteModule()

  const openAddDrawer = () => {
    initialData.value = undefined
    drawerOpen.value = true
  }

  const openEditDrawer = (module: Module) => {
    initialData.value = module
    drawerOpen.value = true
  }

  const closeDrawer = () => {
    drawerOpen.value = false
    initialData.value = undefined
  }

  const handleDelete = (module: Module) => {
    moduleToDelete.value = module
    confirmDialogOpen.value = true
  }

  const confirmDelete = async () => {
    if (moduleToDelete.value) {
      await deleteModule.mutateAsync(moduleToDelete.value.id)
      moduleToDelete.value = null
    }
    confirmDialogOpen.value = false
  }

  const cancelDelete = () => {
    moduleToDelete.value = null
    confirmDialogOpen.value = false
  }

  const handleSubmit = async (data: CreateModule | UpdateModule) => {
    if (initialData.value && initialData.value.id) {
      const updateData: UpdateModule & { id: number } = {
        ...data,
        id: initialData.value.id,
      }
      await updateModule.mutateAsync({ id: updateData.id, payload: data })
    } else {
      await createModule.mutateAsync(data as CreateModule)
    }
    drawerOpen.value = false
  }

  return {
    drawerOpen,
    initialData,
    confirmDialogOpen,
    moduleToDelete,
    openAddDrawer,
    openEditDrawer,
    closeDrawer,
    handleSubmit,
    handleDelete,
    confirmDelete,
    cancelDelete,
  }
}
