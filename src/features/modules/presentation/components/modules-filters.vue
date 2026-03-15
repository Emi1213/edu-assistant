<script setup lang="ts">
import Input from '@/components/ui/input/Input.vue'
import Button from '@/components/ui/button/Button.vue'
import { Search, X } from 'lucide-vue-next'

defineProps<{
  searchQuery: string
  onUpdateSearch: (query: string) => void
  onClearFilters: () => void
}>()
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-4">
    <div class="flex-1 relative">
      <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
      <Input
        :model-value="searchQuery"
        @update:model-value="(val) => onUpdateSearch(String(val))"
        placeholder="Buscar módulos..."
        class="pl-10"
      />
    </div>
    <Button
      v-if="searchQuery"
      variant="ghost"
      size="sm"
      @click="onClearFilters"
    >
      <X class="size-4" />
    </Button>
  </div>
</template>
