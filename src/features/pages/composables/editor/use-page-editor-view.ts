import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePage } from '../queries/use-page'
import { usePageEditor } from './use-page-editor'
import { useUpdatePage } from '../mutations/use-update-page'
import { useAIContentGeneration } from '@/features/content-generation/composables/use-ai-content-generation'
import { useImageGenerationHandler } from '@/features/content-generation/composables/use-image-generation-handler'
import { useConceptsGenerationHandler } from '@/features/content-generation/composables/use-concepts-generation-handler'
import { useRelationsGenerationHandler } from '@/features/content-generation/composables/use-relations-generation-handler'
import type { ExtractRelationsRelation } from '@/features/content-generation/types'
import { useToast } from '@/shared/composables/use-toast'

export function usePageEditorView() {
  const route = useRoute()
  const router = useRouter()
  const toast = useToast()

  const pageId = computed(() => Number(route.params.pageId))
  const moduleId = computed(() => Number(route.params.id))

  const { data: page, isLoading: isLoadingPage } = usePage(pageId.value)
  const pageTitle = ref('')
  const pageKeywords = ref<string[]>([])

  const { mutateAsync: updatePage, isPending: isUpdatingPage } = useUpdatePage(pageId)
  const {
    editor,
    isMounted,
    isSaving,
    setContentFromPage,
    insertContent,
    saveContent,
  } = usePageEditor(pageId.value)

  const savePage = async () => {
    await updatePage({ title: pageTitle.value, keywords: pageKeywords.value })
    saveContent()
  }

  const {
    showAIModal,
    aiInstructions,
    isGenerating,
    generationError,
    openAIModal,
    closeAIModal,
    generate,
  } = useAIContentGeneration(pageId.value)

  useImageGenerationHandler(editor)

  const { generateConcepts, isExtracting: isExtractingConcepts } = useConceptsGenerationHandler(
    pageId.value,
    editor
  )
  const handleGenerateConcepts = () => {
    generateConcepts(
      () => toast.success('Conceptos generados'),
      (msg) => toast.error(msg)
    )
  }

  const { generateRelations } = useRelationsGenerationHandler(pageId.value, editor)

  const hasRunApplyRelations = ref(false)
  watch(
    [() => editor.value, () => page.value, () => route.query.applyRelations],
    ([editorInstance, pageData]) => {
      if (
        editorInstance &&
        pageData &&
        route.query.applyRelations === '1' &&
        !hasRunApplyRelations.value
      ) {
        hasRunApplyRelations.value = true
        setContentFromPage(pageData)
        const preFetchedRelations = history.state?.relations as ExtractRelationsRelation[] | undefined
        generateRelations(
          () => {
            toast.success('Relaciones aplicadas. Guarda los cambios si lo deseas.')
            const { applyRelations: _, ...rest } = route.query
            router.replace({ path: route.path, query: rest })
          },
          (msg) => {
            toast.error(msg)
            const { applyRelations: __, ...rest } = route.query
            router.replace({ path: route.path, query: rest })
          },
          preFetchedRelations?.length ? { relations: preFetchedRelations } : undefined
        )
      }
    },
    { immediate: true }
  )

  watch(
    () => page.value,
    (pageData) => {
      if (pageData) {
        pageTitle.value = pageData.title
        pageKeywords.value = [...pageData.keywords]
        if (editor.value) {
          setContentFromPage(pageData)
        }
      }
    },
    { immediate: true }
  )

  watch(
    () => editor.value,
    (editorInstance) => {
      if (editorInstance && page.value) {
        if (!pageTitle.value) {
          pageTitle.value = page.value.title
          pageKeywords.value = [...page.value.keywords]
        }
        setContentFromPage(page.value)
      }
    },
    { immediate: true }
  )

  const goBack = () => {
    router.push(`/modules/${moduleId.value}/pages/${pageId.value}`)
  }

  const handleGenerateContent = () => {
    generate(
      (result) => {
        if (result.title) pageTitle.value = result.title
        if (result.keywords) pageKeywords.value = result.keywords
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
    pageId,
    moduleId,
    page,
    isLoadingPage,
    editor,
    isMounted,
    isSaving: isSaving || isUpdatingPage,
    pageTitle,
    pageKeywords,
    goBack,
    saveContent: savePage,
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
  }
}
