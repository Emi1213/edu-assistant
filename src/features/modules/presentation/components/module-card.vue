<script setup lang="ts">
import type { Module } from '../../types/modules.types'
import { Globe, Lock, BookOpen, UserPlus, UserMinus } from 'lucide-vue-next'
import { useRoles } from '@/features/auth/composables/use-roles'
import ModulesActionsMenu from './modules-actions-menu.vue'

const props = defineProps<{
  module: Module
  onClick?: (module: Module) => void
  onEdit?: (module: Module) => void
  onDelete?: (module: Module) => void
  isEnrolled?: boolean
  onEnroll?: (module: Module) => void
  onUnenroll?: (module: Module) => void
}>()

const { canEdit, canDelete } = useRoles()

const showActions = canEdit() || canDelete()
const showEnrollActions = (props.onEnroll != null || props.onUnenroll != null) && props.module.allowSelfEnroll

const handleEdit = () => {
  if (props.onEdit) props.onEdit(props.module)
}

const handleDelete = () => {
  if (props.onDelete) props.onDelete(props.module)
}

const handleEnroll = (e: Event) => {
  e.stopPropagation()
  props.onEnroll?.(props.module)
}

const handleUnenroll = (e: Event) => {
  e.stopPropagation()
  props.onUnenroll?.(props.module)
}
</script>

<template>
  <div 
    class="group relative rounded-lg border border-border bg-card overflow-hidden shadow-sm hover:shadow-xl hover:border-red-700 dark:hover:border-[#600000] transition-all duration-200"
    :class="{ 'cursor-pointer': props.onClick }"
    @click="props.onClick && props.onClick(props.module)"
  >
    <div class="absolute left-0 top-0 bottom-0 w-1 bg-[#C8102E]"></div>
    
    <div class="p-5">
      <div class="flex items-start gap-3 mb-3">
        <div class="flex-shrink-0 w-10 h-10 rounded-md bg-[#C8102E] flex items-center justify-center overflow-hidden transition-all duration-200 group-hover:scale-105">
          <img
            v-if="module.logoUrl"
            :src="module.logoUrl"
            :alt="module.title"
            class="w-full h-full object-cover transition-transform duration-200 group-hover:rotate-3"
          />
          <BookOpen v-else class="size-5 text-white transition-transform duration-200 group-hover:rotate-3" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <h3 class="text-lg font-bold text-card-foreground line-clamp-2 leading-snug group-hover:text-[#C8102E] dark:group-hover:text-red-400 transition-colors">
              {{ module.title }}
            </h3>
            <component
              :is="module.isPublic ? Globe : Lock"
              class="size-4 flex-shrink-0 mt-1"
              :class="module.isPublic 
                ? 'text-blue-500 dark:text-blue-400' 
                : 'text-gray-400 dark:text-gray-500'"
            />
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="mb-4">
        <p v-if="module.description" class="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">
          {{ module.description }}
        </p>
        <p v-else class="text-sm text-muted-foreground/60 italic">
          Sin descripción
        </p>
      </div>
      <div class="flex items-center justify-between pt-3 border-t border-border gap-2">
        <div class="flex items-center gap-2 min-w-0">
          <span
            class="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full transition-transform duration-200 hover:scale-105 shrink-0"
            :class="module.isActive
              ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'"
          >
            {{ module.isActive ? 'Activo' : 'Inactivo' }}
          </span>
        </div>
        <div v-if="showEnrollActions" class="flex items-center gap-1 shrink-0" @click.stop>
          <button
            v-if="!isEnrolled && onEnroll"
            type="button"
            class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            @click="handleEnroll"
          >
            <UserPlus class="size-3.5" />
            Inscribirse
          </button>
          <button
            v-else-if="isEnrolled && onUnenroll"
            type="button"
            class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
            @click="handleUnenroll"
          >
            <UserMinus class="size-3.5" />
            Darse de baja
          </button>
        </div>
        <div v-if="showActions" @click.stop>
          <ModulesActionsMenu
            :module="module"
            :on-edit="props.onEdit && canEdit() ? handleEdit : undefined"
            :on-delete="props.onDelete && canDelete() ? handleDelete : undefined"
          />
        </div>
      </div>
    </div>
  </div>
</template>
