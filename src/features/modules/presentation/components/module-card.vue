<script setup lang="ts">
import type { Module } from '../../types/modules.types'
import { Globe, Lock, BookOpen } from 'lucide-vue-next'

defineProps<{
  module: Module
}>()
</script>

<template>
  <div class="group relative rounded-lg border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
    <div class="absolute left-0 top-0 bottom-0 w-1 bg-[#C8102E]"></div>
    
    <div class="p-5">
      <div class="flex items-start gap-3 mb-3">
        <div class="flex-shrink-0 w-10 h-10 rounded-md bg-[#C8102E]/10 dark:bg-[#C8102E]/20 flex items-center justify-center overflow-hidden">
          <img
            v-if="module.logoUrl"
            :src="module.logoUrl"
            :alt="module.title"
            class="w-full h-full object-cover"
          />
          <BookOpen v-else class="size-5 text-[#C8102E] dark:text-red-400" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <h3 class="text-base font-semibold text-card-foreground line-clamp-2 leading-snug group-hover:text-[#C8102E] dark:group-hover:text-red-400 transition-colors">
              {{ module.title }}
            </h3>
            <component
              :is="module.isPublic ? Globe : Lock"
              class="size-4 flex-shrink-0 mt-0.5"
              :class="module.isPublic 
                ? 'text-blue-500 dark:text-blue-400' 
                : 'text-gray-400 dark:text-gray-500'"
            />
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="mb-4">
        <p v-if="module.description" class="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {{ module.description }}
        </p>
        <p v-else class="text-sm text-muted-foreground/60 italic">
          Sin descripción
        </p>
      </div>

      <!-- Footer with badges -->
      <div class="flex items-center justify-between pt-3 border-t border-border">
        <div class="flex items-center gap-2">
          <span
            class="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded"
            :class="module.isActive
              ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'"
          >
            {{ module.isActive ? 'Activo' : 'Inactivo' }}
          </span>
          <span
            v-if="module.allowSelfEnroll"
            class="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded bg-[#C8102E]/10 text-[#C8102E] dark:bg-[#C8102E]/20 dark:text-red-400"
          >
            Auto-inscripción
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
