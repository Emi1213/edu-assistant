import { ref } from 'vue'
import type { LearningObject } from '../types'
import { useLearningObjectCreator } from './use-page-creator'

export function useLearningObjectsList(moduleId: number) {
  const learningObjectToUpdate = ref<LearningObject | null>(null)

  const {
    isDialogOpen,
    learningObjectTitle,
    isPublished,
    isCreating,
    openDialog,
    closeDialog,
    handleCreate,
  } = useLearningObjectCreator(moduleId)

  const openUpdateLearningObject = (learningObject: LearningObject) => {
    learningObjectToUpdate.value = learningObject
  }

  const closeUpdateLearningObject = () => {
    learningObjectToUpdate.value = null
  }

  return {
    isDialogOpen,
    learningObjectTitle,
    isPublished,
    isCreating,
    openDialog,
    closeDialog,
    handleCreate,
    learningObjectToUpdate,
    openUpdateLearningObject,
    closeUpdateLearningObject,
  }
}
