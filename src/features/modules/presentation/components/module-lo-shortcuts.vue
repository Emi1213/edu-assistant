<script setup lang="ts">
import { computed } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import type { LearningObjectType } from '@/features/learning-objects/types'
import { LEARNING_OBJECT_TYPE_CONFIG } from '@/features/learning-objects/constants/learning-object-type.constants'
import { LEARNING_OBJECTS_TAB_QUERY_KEY } from '@/features/learning-objects/constants/learning-objects-tabs.constants'
import { MODULES_ROUTES_NAMES } from '../../routes/modules-routes'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type ShortcutItem = {
  id: number
  name: string
  label: string
  icon: NonNullable<(typeof LEARNING_OBJECT_TYPE_CONFIG)[string]['icon']>
  to: RouteLocationRaw
}

const props = defineProps<{
  moduleId: number
  types: LearningObjectType[]
}>()

const items = computed<ShortcutItem[]>(() =>
  props.types.flatMap<ShortcutItem>((type) => {
    const config = LEARNING_OBJECT_TYPE_CONFIG[type.name]
    if (!config?.icon) return []
    const to: RouteLocationRaw = {
      name: MODULES_ROUTES_NAMES.MODULE_WIKI,
      params: { id: props.moduleId },
      query: { [LEARNING_OBJECTS_TAB_QUERY_KEY]: type.name },
    }
    return [{
      id: type.id,
      name: type.name,
      label: config.tabLabel,
      icon: config.icon,
      to,
    }]
  }),
)

function stop(e: Event) {
  e.stopPropagation()
}
</script>

<template>
  <TooltipProvider v-if="items.length > 0" :delay-duration="150">
    <div class="flex items-center gap-1.5">
      <Tooltip v-for="item in items" :key="item.id">
        <TooltipTrigger as-child>
          <router-link
            :to="item.to"
            :aria-label="`Ir a ${item.label}`"
            class="inline-flex items-center justify-center size-8 rounded-md border border-border bg-muted/40 text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-110 transition-all duration-150"
            @click="stop"
          >
            <component :is="item.icon" class="size-4" />
          </router-link>
        </TooltipTrigger>
        <TooltipContent side="top">
          Ir a {{ item.label }}
        </TooltipContent>
      </Tooltip>
    </div>
  </TooltipProvider>
</template>
