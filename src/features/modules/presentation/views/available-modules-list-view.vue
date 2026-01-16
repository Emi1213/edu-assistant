<script setup lang="ts">
import ModulesFilters from '../components/modules-filters.vue'
import ModuleCard from '../components/module-card.vue'
import Button from '@/components/ui/button/Button.vue'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useAvailableModulesList } from '../../composables/use-available-modules-list'

const {
  modules,
  isLoading,
  searchQuery,
  currentPage,
  hasNextPage,
  updateSearch,
  clearFilters,
  goToPreviousPage,
  goToNextPage,
} = useAvailableModulesList()

const emptyMessage = 'No modules found'
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold tracking-tight text-foreground">Módulos Disponibles</h1>
    </div>

    <ModulesFilters
      :search-query="searchQuery"
      :on-update-search="updateSearch"
      :on-clear-filters="clearFilters"
    />

    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

    <div v-else class="space-y-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ModuleCard
          v-for="module in modules"
          :key="module.id"
          :module="module"
        />
      </div>

      <div
        v-if="currentPage > 0 || hasNextPage"
        class="flex items-center justify-center gap-4 pt-8 border-t border-border"
      >
        <Button
          variant="outline"
          :disabled="currentPage === 0"
          @click="goToPreviousPage"
          class="min-w-[120px]"
        >
          <ChevronLeft class="w-4 h-4 mr-2" />
          Anterior
        </Button>
        <div class="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted">
          <span class="text-sm font-medium text-foreground">
            Página {{ currentPage + 1 }}
          </span>
        </div>
        <Button
          variant="outline"
          :disabled="!hasNextPage"
          @click="goToNextPage"
          class="min-w-[120px]"
        >
          Siguiente
          <ChevronRight class="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  </div>
</template>
