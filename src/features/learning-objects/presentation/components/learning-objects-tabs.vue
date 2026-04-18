<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import type { LearningObject, LearningObjectType } from '../../types'
import { Plus } from 'lucide-vue-next'
import { ref, computed, watch } from 'vue'
import { useLearningObjectsListReorder } from '../../composables/use-learning-objects-list-reorder'
import { sortLearningObjectsByOrderIndex } from '../../utils/learning-objects-reorder.utils'
import {
  FALLBACK_DETAIL_ROUTE_NAME,
  LEARNING_OBJECT_TYPE_CONFIG,
} from '../../constants/learning-object-type.constants'
import { useLearningObjects } from '../../composables/queries/use-learning-objects'
import GenericTabContent from './generic-tab-content.vue'
import { useVideosList } from '@/features/videos/composables/use-videos-list'
import VideoCard from '@/features/videos/presentation/components/video-card.vue'

const props = defineProps<{
  types: LearningObjectType[]
  moduleId: number
  canEdit: boolean
  generatingRelationsLearningObjectId?: number | null
  publishingLearningObjectId?: number | null
  onUpdateLearningObject?: (learningObject: LearningObject) => void
  onGenerateRelations?: (learningObject: LearningObject) => void
  onPublishNow?: (learningObject: LearningObject) => void
  onChat?: (learningObject: LearningObject) => void
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

const queryParams = computed(() => ({
  moduleId: props.moduleId,
  typeId: activeTypeId.value,
}))

const activeType = computed(() =>
  props.types.find((type) => type.id === activeTypeId.value)
)

const activeConfig = computed(() =>
  activeType.value ? LEARNING_OBJECT_TYPE_CONFIG[activeType.value.name] : undefined
)

const activeTypeName = computed(() => activeType.value?.name ?? '')
const isVideoTab = computed(() => activeTypeName.value === 'VIDEO')

const { data: learningObjectsResponse, isLoading: isLoadingLearningObjects } =
  useLearningObjects(queryParams)

const videosParams = computed(() => ({ moduleId: props.moduleId }))
const {
  videos,
  isLoading: isLoadingVideos,
} = useVideosList(videosParams, isVideoTab)

const learningObjects = computed(() => learningObjectsResponse.value?.records ?? [])

const sortedLearningObjects = computed(() => sortLearningObjectsByOrderIndex(learningObjects.value))

const isLoading = computed(() =>
  isVideoTab.value ? isLoadingVideos.value : isLoadingLearningObjects.value,
)

const activeItemsCount = computed(() =>
  isVideoTab.value ? videos.value.length : learningObjects.value.length,
)

const { reorderByDrag, isReorderingLearningObjects } = useLearningObjectsListReorder(props.moduleId)

function handleReorderDrag(movedLo: LearningObject, targetLo: LearningObject) {
  reorderByDrag(movedLo, targetLo)
}

const resolveLabel = (type: LearningObjectType) =>
  LEARNING_OBJECT_TYPE_CONFIG[type.name]?.tabLabel ?? type.name

const buildDetailRoute = (learningObject: LearningObject): RouteLocationRaw => ({
  name: activeConfig.value?.detailRouteName ?? FALLBACK_DETAIL_ROUTE_NAME,
  params: { id: props.moduleId, learningObjectId: learningObject.id },
})
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
          <span class="inline-flex items-center gap-2">
            <component
              v-if="LEARNING_OBJECT_TYPE_CONFIG[type.name]?.icon"
              :is="LEARNING_OBJECT_TYPE_CONFIG[type.name]?.icon"
              class="size-4"
            />
            {{ resolveLabel(type) }}
          </span>
          <span v-if="type.id === activeTypeId" class="ml-1 text-xs opacity-70">
            ({{ activeItemsCount }})
          </span>
        </button>
      </div>

      <button
        v-if="canEdit && activeType"
        @click="emit('create', activeType.id)"
        class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 hover:shadow-md transition-all duration-200 w-full sm:w-auto"
      >
        <Plus class="size-4" />
        <span>Crear {{ activeConfig?.createLabel ?? activeType.name }}</span>
      </button>
    </div>

    <template v-if="isVideoTab">
      <div v-if="isLoading" class="space-y-3">
        <div v-for="i in 3" :key="i" class="rounded-lg border bg-card p-4">
          <div class="flex gap-4">
            <div class="w-40 aspect-video rounded-md bg-muted animate-pulse" />
            <div class="flex-1 space-y-2">
              <div class="h-5 w-2/3 rounded bg-muted animate-pulse" />
              <div class="h-3 w-1/3 rounded bg-muted animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="videos.length === 0" class="rounded-lg border border-dashed bg-muted/20 p-10 text-center">
        <p class="text-muted-foreground">Sin videos todavía.</p>
      </div>
      <div v-else class="space-y-3">
        <VideoCard
          v-for="video in videos"
          :key="video.id"
          :item="video"
          :module-id="moduleId"
        />
      </div>
    </template>

    <GenericTabContent
      v-else
      :learning-objects="sortedLearningObjects"
      :is-loading="isLoading"
      :can-edit="canEdit"
      :reorder-pending="isReorderingLearningObjects"
      :on-reorder-drag="canEdit && sortedLearningObjects.length > 1 ? handleReorderDrag : undefined"
      :generating-relations-learning-object-id="generatingRelationsLearningObjectId"
      :publishing-learning-object-id="publishingLearningObjectId"
      :build-detail-route="buildDetailRoute"
      :on-update-learning-object="onUpdateLearningObject"
      :on-generate-relations="onGenerateRelations"
      :on-publish-now="onPublishNow"
      :on-chat="onChat"
    />
  </div>
</template>
