<script setup lang="ts">
import ModulesListView from '../views/modules-list-view.vue'
import ConfirmationDialog from '@/shared/components/confirmation-dialog.vue'
import { useModulesList } from '../../composables/use-modules-list'
import { useModulesTable } from '../../composables/use-modules-table'
import FormOverlay from '@/shared/components/form-overlay.vue'
import ModuleForm from '../components/module-form.vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { IModulesListViewProps } from '../../types/ui/modules-list-view.types'
import type { Module } from '../../types/modules.types'

const router = useRouter()

const {
  drawerOpen,
  initialData,
  confirmDialogOpen,
  moduleToDelete,
  openAddDrawer,
  openEditDrawer,
  closeDrawer,
  handleSubmit,
  handleDelete,
  confirmDelete,
  cancelDelete,
} = useModulesList()

const {
  modules,
  isLoading,
  searchQuery,
  updateSearch,
  clearFilters,
} = useModulesTable()

const handleModuleClick = (module: Module) => {
  router.push({ name: 'module-wiki', params: { id: module.id } })
}

const modulesListViewProps = computed(
  (): IModulesListViewProps => ({
    modules: modules.value,
    loading: isLoading.value,
    searchQuery: searchQuery.value,
    onEdit: openEditDrawer,
    onDelete: handleDelete,
    onAdd: openAddDrawer,
    onClick: handleModuleClick,
    onUpdateSearch: updateSearch,
    onClearFilters: clearFilters,
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
      :onSubmit="handleSubmit"
      :onCancel="closeDrawer"
      :initialData="initialData"
    />
  </FormOverlay>

  <ConfirmationDialog
    :visible="confirmDialogOpen"
    :title="`Eliminar módulo`"
    :message="`¿Estás seguro de que quieres eliminar el módulo '${moduleToDelete?.title}'? Esta acción no se puede deshacer.`"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />
</template>
