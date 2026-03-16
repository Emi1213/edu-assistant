import { ref } from 'vue'
import type { Page } from '../types'
import { usePageCreator } from './use-page-creator'

export function usePagesList(moduleId: number) {
  const pageToUpdate = ref<Page | null>(null)

  const {
    isDialogOpen,
    pageTitle,
    isPublished,
    isCreating,
    openDialog,
    closeDialog,
    handleCreate,
  } = usePageCreator(moduleId)

  const openUpdatePage = (page: Page) => {
    pageToUpdate.value = page
  }

  const closeUpdatePage = () => {
    pageToUpdate.value = null
  }

  return {
    isDialogOpen,
    pageTitle,
    isPublished,
    isCreating,
    openDialog,
    closeDialog,
    handleCreate,
    pageToUpdate,
    openUpdatePage,
    closeUpdatePage,
  }
}
