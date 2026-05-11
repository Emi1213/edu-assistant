<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import type { Module } from '../../types/modules.types'
import type { LearningObjectType } from '@/features/learning-objects/types'
import { toFullAssetUrl } from '@/shared/utils/image.utils'
import { Globe, Lock, BookOpen, UserPlus, UserMinus } from 'lucide-vue-next'
import { useRoles } from '@/features/auth/composables/use-roles'
import { useAuthStore } from '@/features/auth/context/auth-store'
import { computed } from 'vue'
import ModulesActionsMenu from './modules-actions-menu.vue'
import ModuleLoShortcuts from './module-lo-shortcuts.vue'

const props = defineProps<{
  module: Module
  to?: RouteLocationRaw
  onClick?: (module: Module) => void
  onEdit?: (module: Module) => void
  isEnrolled?: boolean
  onEnroll?: (module: Module) => void
  onUnenroll?: (module: Module) => void
  learningObjectTypes?: LearningObjectType[]
}>()

const { canEdit } = useRoles()
const authStore = useAuthStore()

const isOwner = computed(() => authStore.user?.id === props.module.teacherId)
const showActions = computed(() => canEdit() && isOwner.value)
const showEnrollActions = computed(() => (props.onEnroll != null || props.onUnenroll != null) && props.module.allowSelfEnroll && !isOwner.value)

const handleEdit = () => {
  if (props.onEdit) props.onEdit(props.module)
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
    class="group relative rounded-lg border border-border bg-card overflow-hidden shadow-sm hover:shadow-xl hover:border-primary dark:hover:border-primary/50 transition-all duration-200"
    :class="{ 'cursor-pointer': props.to || props.onClick }"
  >
    <component
      :is="props.to ? 'router-link' : 'div'"
      :to="props.to"
      class="block no-underline text-inherit"
      @click="!props.to && props.onClick && props.onClick(props.module)"
    >
      <div class="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
      <div class="p-5 pb-0">
      <div class="flex items-start gap-3 mb-3">
        <div class="flex-shrink-0 w-10 h-10 rounded-md bg-primary flex items-center justify-center overflow-hidden transition-all duration-200 group-hover:scale-105">
          <img
            v-if="module.logoUrl"
            :src="toFullAssetUrl(module.logoUrl)"
            :alt="module.title"
            class="w-full h-full object-cover transition-transform duration-200 group-hover:rotate-3"
          />
          <BookOpen v-else class="size-5 text-primary-foreground transition-transform duration-200 group-hover:rotate-3" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <h3 class="text-lg font-bold text-card-foreground line-clamp-2 leading-snug group-hover:text-primary dark:group-hover:text-primary/80 transition-colors">
              {{ module.title }}
            </h3>
            <component
              :is="module.isPublic ? Globe : Lock"
              class="size-4 flex-shrink-0 mt-1"
              :class="module.isPublic 
                ? 'text-blue-500 dark:text-blue-400' 
                : 'text-muted-foreground/60'"
            />
          </div>
        </div>
      </div>

      <div class="mb-4">
        <p v-if="module.description" class="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">
          {{ module.description }}
        </p>
        <p v-else class="text-sm text-muted-foreground/60 italic">
          Sin descripción
        </p>
      </div>
      </div>
    </component>
    <div class="flex items-center justify-between px-5 pb-5 pt-3 border-t border-border gap-2 flex-wrap">
      <div class="flex items-center gap-2 min-w-0">
        <span
          class="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full transition-transform duration-200 hover:scale-105 shrink-0"
          :class="module.isActive
            ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'"
        >
          {{ module.isActive ? 'Activo' : 'Inactivo' }}
        </span>
        <ModuleLoShortcuts
          v-if="learningObjectTypes && learningObjectTypes.length > 0"
          :module-id="module.id"
          :types="learningObjectTypes"
        />
      </div>
      <div v-if="showEnrollActions" class="flex items-center gap-1 shrink-0">
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
      <div v-if="showActions">
        <ModulesActionsMenu
          :module="module"
          :on-edit="props.onEdit && canEdit() ? handleEdit : undefined"
        />
      </div>
    </div>
  </div>
</template>
