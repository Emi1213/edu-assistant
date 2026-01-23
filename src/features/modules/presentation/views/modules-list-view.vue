<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import ModulesFilters from '../components/modules-filters.vue'
import ModuleCard from '../components/module-card.vue'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
import { useModulesList } from '../../composables/use-modules-list'
import type { Module } from '../../types/modules.types'

const router = useRouter()

const {
  modules,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  searchQuery,
  updateSearch,
  clearFilters,
  loadMore,
} = useModulesList()

const emptyMessage = 'No modules found'
const loadMoreRef = ref<HTMLElement | null>(null)

const handleModuleClick = (module: Module) => {
  router.push(`/modules/${module.id}/wiki`)
}

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
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold tracking-tight text-foreground">Mis Módulos</h1>
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
          :on-click="handleModuleClick"
        />
      </div>

      <div
        ref="loadMoreRef"
        class="flex items-center justify-center py-8"
      >
        <div v-if="isFetchingNextPage" class="flex items-center gap-2 text-muted-foreground">
          <div class="w-5 h-5 border-2 border-[#C8102E] border-t-transparent rounded-full animate-spin"></div>
          <span class="text-sm">Cargando más módulos...</span>
        </div>
        <div v-else-if="!hasNextPage && modules.length > 0" class="text-sm text-muted-foreground">
          No hay más módulos para mostrar
        </div>
      </div>
    </div>
  </div>
</template>
