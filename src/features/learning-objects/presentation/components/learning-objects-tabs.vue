<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Plus } from 'lucide-vue-next'
import type { LearningObjectType } from '../../types/learning-object-type.types'
import { LEARNING_OBJECT_TYPE_CONFIG } from '../../constants/learning-object-type.constants'
import { useLearningObjects } from '../../composables/queries/use-learning-objects'
import GenericTabContent from './generic-tab-content.vue'

const props = defineProps<{
  types: LearningObjectType[]
  canEdit: boolean
  moduleId: number
}>()

const emit = defineEmits<{
  create: [typeId: number]
}>()

const activeTypeId = ref<number>(0)

watch(
  () => props.types,
  (types) => {
    if (activeTypeId.value === 0 && types[0] !== undefined) {
      activeTypeId.value = types[0].id
    }
  },
  { immediate: true }
)

const { learningObjects } = useLearningObjects(
  computed(() => props.moduleId),
  activeTypeId,
)

const activeType = computed(() => props.types.find(t => t.id === activeTypeId.value))

const activeConfig = computed(() =>
  activeType.value ? LEARNING_OBJECT_TYPE_CONFIG[activeType.value.name] : undefined
)

const activeTabContent = computed(() =>
  activeConfig.value?.tabContent ?? GenericTabContent
)
</script>

<template>
  <div class="space-y-4 min-w-0">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div class="flex gap-1 border-b border-border">
        <button
          v-for="type in types"
          :key="type.id"
          @click="activeTypeId = type.id"
          class="px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px"
          :class="activeTypeId === type.id
            ? 'border-primary text-primary'
            : 'border-transparent text-muted-foreground hover:text-foreground'"
        >
          {{ LEARNING_OBJECT_TYPE_CONFIG[type.name]?.label ?? type.name }}
          <span v-if="type.id === activeTypeId" class="ml-1 text-xs opacity-70">({{ learningObjects.length }})</span>
        </button>
      </div>

      <button
        v-if="canEdit && activeType"
        @click="emit('create', activeType.id)"
        class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 hover:shadow-md transition-all duration-200 w-full sm:w-auto"
      >
        <Plus class="size-4" />
        <span>Crear {{ activeConfig?.label ?? activeType.name }}</span>
      </button>
    </div>

    <component
      :is="activeTabContent"
      :learning-objects="learningObjects"
      :module-id="moduleId"
      :can-edit="canEdit"
    />
  </div>
</template>
