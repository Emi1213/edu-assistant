<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import ModulesFilters from '../components/modules-filters.vue'
import ModuleCard from '../components/module-card.vue'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useAvailableModulesList } from '../../composables/use-available-modules-list'
import { useModulesList } from '../../composables/use-modules-list'
import FormOverlay from '@/shared/components/form-overlay.vue'
import ModuleForm from '../components/module-form.vue'
import { useSelfEnrollMutation } from '@/features/enrollments/composables/mutations/useSelfEnrollMutation'
import { useToast } from '@/shared/composables/use-toast'
import type { Module } from '../../types/modules.types'
import { useLearningObjectTypes } from '@/features/learning-objects/composables/queries/use-learning-object-types'
import { useAuthStore } from '@/features/auth/context/auth-store'

const toast = useToast()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const {
  modules: rawModules,
  isLoading,
  isFetching,
  searchQuery,
  updateSearch,
  clearFilters,
  currentPage,
  totalPages,
  totalItems,
  goToPage,
  nextPage,
  prevPage,
} = useAvailableModulesList()

const modules = computed(() => {
  if (!user.value?.id) return rawModules.value
  return rawModules.value.filter(m => Number(m.teacherId) !== Number(user.value?.id))
})

const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  const end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
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

const emptyMessage = 'No hay módulos disponibles'
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
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity"
        :class="{ 'opacity-60 pointer-events-none': isFetching }"
      >
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

      <!-- Pagination Controls -->
      <div
        v-if="totalPages > 1"
        class="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-border mt-8"
      >
        <p class="text-sm text-muted-foreground">
          Página <span class="font-medium text-foreground">{{ currentPage }}</span> de <span class="font-medium text-foreground">{{ totalPages }}</span>
          <span v-if="totalItems"> ({{ totalItems }} módulos en total)</span>
        </p>

        <div class="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            :disabled="currentPage <= 1 || isFetching"
            @click="prevPage"
          >
            <ChevronLeft class="h-4 w-4 mr-1" />
            Anterior
          </Button>

          <div class="flex items-center space-x-1">
            <Button
              v-for="page in visiblePages"
              :key="page"
              :variant="page === currentPage ? 'default' : 'outline'"
              size="sm"
              class="w-9 h-9 p-0"
              :disabled="isFetching"
              @click="goToPage(page)"
            >
              {{ page }}
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            :disabled="currentPage >= totalPages || isFetching"
            @click="nextPage"
          >
            Siguiente
            <ChevronRight class="h-4 w-4 ml-1" />
          </Button>
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
