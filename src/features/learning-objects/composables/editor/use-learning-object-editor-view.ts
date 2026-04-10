import { ref, computed, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLearningObject } from '../queries/use-learning-object'
import { useLearningObjectEditor } from './use-learning-object-editor'
import { useUpdateLearningObject } from '../mutations/use-update-learning-object'
import { useAIContentGeneration } from '@/features/content-generation/composables/use-ai-content-generation'
import { useImageGenerationHandler } from '@/features/content-generation/composables/use-image-generation-handler'
import { useConceptsGenerationHandler } from '@/features/content-generation/composables/use-concepts-generation-handler'
import { useRelationsGenerationHandler } from '@/features/content-generation/composables/use-relations-generation-handler'
import type { ExtractRelationsRelation } from '@/features/content-generation/types'
import { useToast } from '@/shared/composables/use-toast'

export function useLearningObjectEditorView() {
  const route = useRoute()
  const router = useRouter()
  const toast = useToast()

  const learningObjectId = computed(() => Number(route.params.learningObjectId))
  const moduleId = computed(() => Number(route.params.id))

  const { data: learningObject, isLoading: isLoadingLearningObject } = useLearningObject(learningObjectId)
  const learningObjectTitle = ref('')
  const learningObjectKeywords = ref<string[]>([])

  const { mutateAsync: updateLearningObject, isPending: isUpdatingLearningObject } = useUpdateLearningObject(learningObjectId)
  const {
    editor,
    isMounted,
    isSaving,
    setContentFromLearningObject,
    insertContent,
    saveContent,
  } = useLearningObjectEditor(learningObjectId)

  const saveLearningObject = async () => {
    await updateLearningObject({ title: learningObjectTitle.value, keywords: learningObjectKeywords.value })
    await saveContent()
  }

  const {
    showAIModal,
    aiInstructions,
    isGenerating,
    generationError,
    openAIModal,
    closeAIModal,
    generate,
  } = useAIContentGeneration(learningObjectId)

  useImageGenerationHandler(editor)

  const { generateConcepts, isExtracting: isExtractingConcepts } = useConceptsGenerationHandler(
    learningObjectId,
    editor
  )
  const handleGenerateConcepts = async () => {
    try {
      // Save before extracting to ensure backend has blocks
      await saveLearningObject()
      
      generateConcepts(
        () => toast.success('Conceptos generados'),
        (msg) => toast.error(msg)
      )
    } catch {
      // Error already handled in saveLearningObject/saveContent
    }
  }

  const { generateRelations, isExtracting: isExtractingRelations } = useRelationsGenerationHandler(
    learningObjectId.value,
    editor
  )

  const handleGenerateRelations = async () => {
    try {
      // Guardar antes para asegurar que el backend tenga el contenido actualizado
      await saveLearningObject()

      generateRelations(
        () => toast.success('Relaciones generadas y aplicadas'),
        (msg) => toast.error(msg)
      )
    } catch {
      // Error ya manejado en saveLearningObject
    }
  }

  const relationsStorageKey = (id: number) => `learning-object-relations-${id}`

  const hasRunApplyRelations = ref(false)
  watch(
    [() => editor.value, () => learningObject.value, () => route.query.applyRelations],
    async ([editorInstance, learningObjectData]) => {
      if (
        editorInstance &&
        learningObjectData &&
        route.query.applyRelations === '1' &&
        !hasRunApplyRelations.value
      ) {
        hasRunApplyRelations.value = true
        setContentFromLearningObject(learningObjectData)
        await nextTick()
        await nextTick()

        let preFetchedRelations = history.state?.relations as ExtractRelationsRelation[] | undefined
        if (!preFetchedRelations?.length) {
          try {
            const raw = sessionStorage.getItem(relationsStorageKey(learningObjectData.id))
            if (raw) {
              const parsed = JSON.parse(raw) as unknown
              if (Array.isArray(parsed) && parsed.length > 0) {
                preFetchedRelations = parsed as ExtractRelationsRelation[]
              }
            }
          } catch {
            /* ignore */
          }
        }
        sessionStorage.removeItem(relationsStorageKey(learningObjectData.id))

        generateRelations(
          () => {
            toast.success('Relaciones aplicadas. Guarda los cambios si lo deseas.')
            const query = { ...route.query }
            delete query.applyRelations
            router.replace({ path: route.path, query })
          },
          (msg) => {
            toast.error(msg)
            const query = { ...route.query }
            delete query.applyRelations
            router.replace({ path: route.path, query })
          },
          preFetchedRelations?.length ? { relations: preFetchedRelations } : undefined
        )
      }
    },
    { immediate: true }
  )

  watch(
    () => learningObject.value,
    (learningObjectData) => {
      if (learningObjectData) {
        learningObjectTitle.value = learningObjectData.title
        learningObjectKeywords.value = [...learningObjectData.keywords]
        if (editor.value) {
          setContentFromLearningObject(learningObjectData)
        }
      }
    },
    { immediate: true }
  )

  watch(
    () => editor.value,
    (editorInstance) => {
      if (editorInstance && learningObject.value) {
        if (!learningObjectTitle.value) {
          learningObjectTitle.value = learningObject.value.title
          learningObjectKeywords.value = [...learningObject.value.keywords]
        }
        setContentFromLearningObject(learningObject.value)
      }
    },
    { immediate: true }
  )

  const goBack = () => {
    router.push(`/modules/${moduleId.value}/learning-objects/${learningObjectId.value}`)
  }

  const handleGenerateContent = () => {
    generate(
      (result) => {
        if (result.title) learningObjectTitle.value = result.title
        if (result.keywords) learningObjectKeywords.value = result.keywords
        if (result.content) {
          insertContent(result.content)
        }
        if (result.imageSuggestions && result.imageSuggestions.length > 0 && editor.value) {
          result.imageSuggestions.forEach((suggestion) => {
            editor.value?.commands.setImageSuggestion(suggestion.prompt, suggestion.reason)
          })
        }
      },
      () => isMounted.value
    )
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleGenerateContent()
    } else if (e.key === 'Escape') {
      closeAIModal()
    }
  }

  return {
    learningObjectId,
    moduleId,
    learningObject,
    isLoadingLearningObject,
    editor,
    isMounted,
    isSaving: isSaving || isUpdatingLearningObject,
    learningObjectTitle,
    learningObjectKeywords,
    goBack,
    saveContent: saveLearningObject,
    showAIModal,
    aiInstructions,
    openAIModal,
    closeAIModal,
    handleGenerateContent,
    handleKeyDown,
    isGenerating,
    generationError,
    handleGenerateConcepts,
    isExtractingConcepts,
    handleGenerateRelations,
    isExtractingRelations,
  }
}
