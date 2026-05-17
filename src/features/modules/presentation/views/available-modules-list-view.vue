<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, nextTick } from 'vue'
import ModulesFilters from '../components/modules-filters.vue'
import ModuleCard from '../components/module-card.vue'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
import { useAvailableModulesList } from '../../composables/use-available-modules-list'
import { useModulesList } from '../../composables/use-modules-list'
import FormOverlay from '@/shared/components/form-overlay.vue'
import ModuleForm from '../components/module-form.vue'
import { useSelfEnrollMutation } from '@/features/enrollments/composables/mutations/useSelfEnrollMutation'
import { useToast } from '@/shared/composables/use-toast'
import type { Module } from '../../types/modules.types'
import { useLearningObjectTypes } from '@/features/learning-objects/composables/queries/use-learning-object-types'
import { computed } from 'vue'
import { useAuthStore } from '@/features/auth/context/auth-store'
import { storeToRefs } from 'pinia'

const toast = useToast()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const {
  modules: rawModules,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  searchQuery,
  updateSearch,
  clearFilters,
  loadMore,
} = useAvailableModulesList()

const modules = computed(() => {
  if (!user.value?.id) return rawModules.value
  return rawModules.value.filter(m => Number(m.teacherId) !== Number(user.value?.id))
})

const {
  drawerOpen,
  initialData,
  openEditDrawer,
  closeDrawer,
  handleSubmit,
} = useModulesList()

const selfEnrollMutation = useSelfEnrollMutation()

const { data: learningObjectTypesData } = useLearningObjectTypes()
const learningObjectTypes = computed(() => learningObjectTypesData.value ?? [])

function handleEnroll(module: Module) {
  selfEnrollMutation.mutate(
    { moduleId: module.id },
    {
      onSuccess: () => toast.success(`Te has inscrito en "${module.title}"`),
      onError: (err: Error) => toast.error(err?.message ?? 'Error al inscribirse'),
    }
  )
}

const emptyMessage = 'No modules found'
const loadMoreRef = ref<HTMLElement | null>(null)

let observer: IntersectionObserver | null = null

const setupObserver = () => {
  if (observer) {
    observer.disconnect()
  }

  if (!loadMoreRef.value) return

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry && entry.isIntersecting && hasNextPage.value && !isFetchingNextPage.value) {
        loadMore()
      }
    },
    {
      rootMargin: '100px',
    }
  )

  observer.observe(loadMoreRef.value)
}

onMounted(() => {
  nextTick(() => {
    setupObserver()
  })
})

watch([loadMoreRef, hasNextPage], () => {
  nextTick(() => {
    setupObserver()
  })
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<template>
  <div class="space-y-6 pt-4 sm:pt-8 min-w-0">
    <div class="flex items-center justify-between min-w-0">
      <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-foreground truncate">Módulos Disponibles</h1>
    </div>

    <ModulesFilters
      :search-query="searchQuery"
      :on-update-search="updateSearch"
      :on-clear-filters="clearFilters"
    />

    <div v-if="isLoading && modules.length === 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="i in 6"
        :key="i"
        class="rounded-lg border border-border bg-card p-6"
      >
        <Skeleton class="h-6 w-3/4 mb-4" />
        <Skeleton class="h-4 w-full mb-2" />
        <Skeleton class="h-4 w-2/3" />
      </div>
    </div>

    <div v-else-if="!modules || modules.length === 0" class="rounded-md bg-card px-6 py-12 text-center">
      <p class="text-muted-foreground">{{ emptyMessage }}</p>
    </div>

    <div v-else class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ModuleCard
          v-for="module in modules"
          :key="module.id"
          :module="module"
          :is-enrolled="false"
          :learning-object-types="learningObjectTypes"
          :on-enroll="handleEnroll"
          :on-edit="openEditDrawer"
        />
      </div>

      <div
        ref="loadMoreRef"
        class="flex items-center justify-center py-8"
      >
        <div v-if="isFetchingNextPage" class="flex items-center gap-2 text-muted-foreground">
          <div class="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span class="text-sm">Cargando más módulos...</span>
        </div>
        <div v-else-if="!hasNextPage && modules.length > 0" class="text-sm text-muted-foreground">
          No hay más módulos para mostrar
        </div>
      </div>
    </div>

    <FormOverlay
      :isOpen="drawerOpen"
      :onClose="closeDrawer"
      :title="initialData ? 'Editar Módulo' : 'Agregar Módulo'"
    >
      <ModuleForm
        :key="initialData?.id ?? 'create'"
        :onSubmit="handleSubmit"
        :onCancel="closeDrawer"
        :initialData="initialData"
      />
    </FormOverlay>
  </div>
</template>
