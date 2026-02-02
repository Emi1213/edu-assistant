<script setup lang="ts">
import ModulesFilters from '../components/modules-filters.vue'
import ModuleCard from '../components/module-card.vue'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-vue-next'
import type { IModulesListViewProps } from '../../types/ui/modules-list-view.types'
import type { Module } from '../../types/modules.types'

const props = defineProps<IModulesListViewProps>()

const emptyMessage = 'No hay módulos registrados'

const handleModuleClick = (module: Module) => {
  if (props.onClick) {
    props.onClick(module)
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold tracking-tight text-foreground">Mis Módulos</h1>
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
      <div class="w-full lg:w-auto">
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

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ModuleCard
        v-for="module in props.modules"
        :key="module.id"
        :module="module"
        :on-click="props.onClick ? (m) => handleModuleClick(m) : undefined"
        :on-edit="() => props.onEdit(module)"
        :on-delete="() => props.onDelete(module)"
      />
    </div>
  </div>
</template>
