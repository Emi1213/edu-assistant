<script setup lang="ts">
import type { Module } from '../../types/modules.types'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-vue-next'

defineProps<{
  module: Module
  onEdit?: () => void
  onDelete?: () => void
}>()
</script>

<template>
  <div class="flex justify-center gap-2">
    <Button
      variant="ghost"
      size="sm"
      class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      @click.stop="onEdit"
    >
      <Edit class="h-4 w-4" />
    </Button>

    <Button
      variant="ghost"
      size="sm"
      class="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
      @click.stop="onDelete"
    >
      <Trash2 class="h-4 w-4" />
    </Button>
  </div>
</template>
