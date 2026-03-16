<script setup lang="ts">
import type { Module } from '../../types/modules.types'
import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-vue-next'

const props = defineProps<{
  module: Module
  onEdit?: () => void
}>()

const handleEdit = (event: Event) => {
  event.preventDefault()
  event.stopPropagation()
  props.onEdit?.()
}
</script>

<template>
  <div class="flex justify-center gap-2">
    <Button
      variant="ghost"
      size="sm"
      class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      @click="handleEdit"
    >
      <Edit class="h-4 w-4" />
    </Button>
  </div>
</template>
