import { ref } from 'vue'
import { useCreateModule } from './mutations/use-create-module'
import { useUpdateModule } from './mutations/use-update-module'
import type { Module, CreateModule, UpdateModule, UpdateModuleAiConfiguration } from '../types/modules.types'

function buildUpdateModulePayload(data: CreateModule | UpdateModule | Partial<Module>): UpdateModule {
  const ai = (data as { aiConfiguration?: UpdateModuleAiConfiguration }).aiConfiguration
  const d = data as Partial<Module>
  return {
    title: data.title,
    description: data.description ?? undefined,
    isPublic: data.isPublic,
    allowSelfEnroll: data.allowSelfEnroll,
    allowSelfUnenroll: (data as { allowSelfUnenroll?: boolean }).allowSelfUnenroll,
    logoUrl: data.logoUrl ?? undefined,
    isActive: d.isActive,
    aiConfiguration: ai
      ? {
          language: ai.language,
          targetLevel: ai.targetLevel,
          audience: ai.audience,
          contentLength: ai.contentLength,
          tone: ai.tone,
        }
      : undefined,
  }
}

export function useModulesList() {
  const drawerOpen = ref(false)
  const initialData = ref<Partial<Module>>()
  const createModule = useCreateModule()
  const updateModule = useUpdateModule()

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

  const handleSubmit = async (data: CreateModule | UpdateModule) => {
    if (initialData.value && initialData.value.id) {
      const payload = buildUpdateModulePayload(data)
      await updateModule.mutateAsync({ id: initialData.value.id, payload })
    } else {
      const { isActive: _, ...createPayload } = data as CreateModule & { isActive?: boolean }
      await createModule.mutateAsync(createPayload as CreateModule)
    }
    drawerOpen.value = false
  }

  return {
    drawerOpen,
    initialData,
    openAddDrawer,
    openEditDrawer,
    closeDrawer,
    handleSubmit,
  }
}
