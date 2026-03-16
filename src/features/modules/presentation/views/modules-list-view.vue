<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, nextTick } from 'vue'
import ModulesFilters from '../components/modules-filters.vue'
import ModuleCard from '../components/module-card.vue'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-vue-next'
import { useRoles } from '@/features/auth/composables/use-roles'
import type { IModulesListViewProps } from '../../types/ui/modules-list-view.types'

const props = defineProps<IModulesListViewProps>()

const { canCreate } = useRoles()

const emptyMessage = 'No hay módulos registrados'
const loadMoreRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const setupObserver = () => {
  if (observer) observer.disconnect()
  if (!loadMoreRef.value || !props.loadMore) return
  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (
        entry?.isIntersecting &&
        props.hasNextPage &&
        !props.isFetchingNextPage &&
        props.loadMore
      ) {
        props.loadMore()
      }
    },
    { rootMargin: '100px' }
  )
  observer.observe(loadMoreRef.value)
}

onMounted(() => {
  nextTick(setupObserver)
})

watch([loadMoreRef, () => props.hasNextPage], () => nextTick(setupObserver))

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<template>
  <div class="space-y-6 pt-4 sm:pt-8 min-w-0">
    <div class="flex items-center justify-between min-w-0">
      <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-foreground truncate">Mis Módulos</h1>
    </div>

    <div
      class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between"
    >
      <div class="flex-1 w-full lg:w-auto">
        <ModulesFilters
          :search-query="props.searchQuery"
          :on-update-search="props.onUpdateSearch"
          :on-clear-filters="props.onClearFilters"
        />
      </div>
      <div v-if="canCreate()" class="w-full lg:w-auto">
        <Button @click="props.onAdd" class="w-full lg:w-auto">
          <Plus class="w-4 h-4 mr-1" />
          Agregar
        </Button>
      </div>
    </div>

    <div v-if="props.loading && props.modules.length === 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

    <div v-else-if="!props.modules || props.modules.length === 0" class="rounded-md bg-card px-6 py-12 text-center">
      <p class="text-muted-foreground">{{ emptyMessage }}</p>
    </div>

    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ModuleCard
          v-for="module in props.modules"
          :key="module.id"
          :module="module"
          :to="{ name: 'module-wiki', params: { id: module.id } }"
          :on-edit="props.onEdit ? () => props.onEdit(module) : undefined"
        />
      </div>
      <div
        ref="loadMoreRef"
        class="flex items-center justify-center py-8"
      >
        <div v-if="props.isFetchingNextPage" class="flex items-center gap-2 text-muted-foreground">
          <div class="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span class="text-sm">Cargando más módulos...</span>
        </div>
        <div v-else-if="props.hasNextPage === false && props.modules.length > 0" class="text-sm text-muted-foreground">
          No hay más módulos para mostrar
        </div>
      </div>
    </template>
  </div>
</template>
