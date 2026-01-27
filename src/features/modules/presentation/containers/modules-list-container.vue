<script setup lang="ts">
import ModulesListView from '../views/modules-list-view.vue'
import { useModulesList } from '../../composables/use-modules-list'

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
} = useModulesList()
</script>

<template>
  <ModulesListView
    :modules="modules ?? null"
    :loading="isLoading"
    :search-query="searchQuery"
    :current-page="currentPage"
    :has-next-page="hasNextPage"
    :on-update-search="updateSearch"
    :on-clear-filters="clearFilters"
    :on-previous-page="goToPreviousPage"
    :on-next-page="goToNextPage"
  />
</template>
