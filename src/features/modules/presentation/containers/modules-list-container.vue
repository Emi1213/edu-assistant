<script setup lang="ts">
import ModulesListView from '../views/modules-list-view.vue'
import { useModulesList } from '../../composables/use-modules-list'
import { useModulesTable } from '../../composables/use-modules-table'
import FormOverlay from '@/shared/components/form-overlay.vue'
import ModuleForm from '../components/module-form.vue'
import { computed } from 'vue'
import type { IModulesListViewProps } from '../../types/ui/modules-list-view.types'

const {
  drawerOpen,
  initialData,
  openAddDrawer,
  openEditDrawer,
  closeDrawer,
  handleSubmit,
} = useModulesList()

const {
  modules,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  searchQuery,
  updateSearch,
  clearFilters,
  loadMore,
} = useModulesTable()

const modulesListViewProps = computed(
  (): IModulesListViewProps => ({
    modules: modules.value,
    loading: isLoading.value,
    searchQuery: searchQuery.value,
    onEdit: openEditDrawer,
    onAdd: openAddDrawer,
    onUpdateSearch: updateSearch,
    onClearFilters: clearFilters,
    loadMore,
    hasNextPage: hasNextPage.value,
    isFetchingNextPage: isFetchingNextPage.value,
  })
)
</script>

<template>
  <ModulesListView v-bind="modulesListViewProps" />

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
</template>
