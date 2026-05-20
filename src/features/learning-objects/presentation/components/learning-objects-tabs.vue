<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'
import type { LearningObject, LearningObjectType } from '../../types'
import { Plus } from 'lucide-vue-next'
import { ref, computed, watch } from 'vue'
import { useLearningObjectsListReorder } from '../../composables/use-learning-objects-list-reorder'
import { sortLearningObjectsByOrderIndex } from '../../utils/learning-objects-reorder.utils'
import {
  FALLBACK_DETAIL_ROUTE_NAME,
  LEARNING_OBJECT_TYPE_CONFIG,
} from '../../constants/learning-object-type.constants'
import { LEARNING_OBJECTS_TAB_QUERY_KEY } from '../../constants/learning-objects-tabs.constants'
import { useLearningObjects } from '../../composables/queries/use-learning-objects'
import GenericTabContent from './generic-tab-content.vue'
import { useVideosList } from '@/features/videos/composables/use-videos-list'
import { useVideosListReorder } from '@/features/videos/composables/use-videos-list-reorder'
import { sortVideosByOrderIndex } from '@/features/videos/utils/videos-reorder.utils'
import VideosTabContent from '@/features/videos/presentation/components/videos-tab-content.vue'
import type { VideoDto } from '@/features/videos/types/video.types'
import { LearningObjectsDataSource } from '../../services/learning-objects.service'

const learningObjectsDataSource = new LearningObjectsDataSource()

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

const route = useRoute()
const router = useRouter()

const activeTypeName = computed<string>(() => {
  const raw = route.query[LEARNING_OBJECTS_TAB_QUERY_KEY]
  const value = typeof raw === 'string' ? raw : ''
  if (value && props.types.some((t) => t.name === value)) return value
  return props.types[0]?.name ?? ''
})

const activeType = computed(() =>
  props.types.find((type) => type.name === activeTypeName.value),
)

const activeTypeId = computed(() => activeType.value?.id ?? 0)

const currentPage = ref(1)
const pageSize = ref(10)
const loadedLearningObjects = ref<LearningObject[]>([])
const totalItems = ref(0)
const totalPages = ref(0)

function selectType(type: LearningObjectType) {
  if (activeTypeName.value === type.name) return
  router.replace({
    query: { ...route.query, [LEARNING_OBJECTS_TAB_QUERY_KEY]: type.name },
  })
}

watch(
  [() => props.types, () => route.query[LEARNING_OBJECTS_TAB_QUERY_KEY]],
  ([types, queryValue]) => {
    const fallback = types[0]
    if (!fallback) return
    const current = typeof queryValue === 'string' ? queryValue : ''
    if (current && types.some((t) => t.name === current)) return
    router.replace({
      query: { ...route.query, [LEARNING_OBJECTS_TAB_QUERY_KEY]: fallback.name },
    })
  },
  { immediate: true },
)

const queryParams = computed(() => ({
  moduleId: props.moduleId,
  typeId: activeTypeId.value,
  page: currentPage.value,
  limit: pageSize.value,
}))

const activeConfig = computed(() =>
  activeType.value ? LEARNING_OBJECT_TYPE_CONFIG[activeType.value.name] : undefined
)

const isVideoTab = computed(() => activeTypeName.value === 'VIDEO')

const { data: learningObjectsResponse, isLoading: isLoadingLearningObjects, isFetching: isFetchingLearningObjects } =
  useLearningObjects(queryParams)

watch(learningObjectsResponse, (response) => {
  if (response) {
    totalItems.value = response.total
    totalPages.value = response.pages
    
    if (currentPage.value === 1) {
      loadedLearningObjects.value = [...response.records]
    } else {
      const existingIds = new Set(loadedLearningObjects.value.map(lo => lo.id))
      const newItems = response.records.filter(lo => !existingIds.has(lo.id))
      loadedLearningObjects.value = [...loadedLearningObjects.value, ...newItems]
    }
  }
}, { immediate: true })

watch(activeTypeId, () => {
  currentPage.value = 1
  loadedLearningObjects.value = []
  totalItems.value = 0
})

const videosParams = computed(() => ({ 
  moduleId: props.moduleId,
}))
const {
  videos,
  isLoading: isLoadingVideos,
  total: totalVideos,
  hasNextPage: hasNextPageVideo,
  isFetchingNextPage: isFetchingNextPageVideo,
  loadMore: loadMoreVideo,
  refreshAll: refreshAllVideos,
} = useVideosList(videosParams, isVideoTab)

const learningObjects = computed(() => loadedLearningObjects.value)

const sortedLearningObjects = computed(() => sortLearningObjectsByOrderIndex(learningObjects.value))

const isLoading = computed(() =>
  isVideoTab.value ? isLoadingVideos.value : isLoadingLearningObjects.value,
)

const hasNextPage = computed(() => currentPage.value < totalPages.value)
const isFetchingNextPage = computed(() => isFetchingLearningObjects.value && currentPage.value > 1)

const loadMore = () => {
  if (hasNextPage.value && !isFetchingLearningObjects.value) {
    currentPage.value++
  }
}

const activeItemsCount = computed(() =>
  isVideoTab.value ? totalVideos.value : totalItems.value,
)

const { reorderByDrag, isReorderingLearningObjects } = useLearningObjectsListReorder(props.moduleId)

function handleReorderDrag(movedLo: LearningObject, targetLo: LearningObject) {
  reorderByDrag(movedLo, targetLo, {
    onSuccess: async () => {
      const totalToFetch = loadedLearningObjects.value.length || pageSize.value
      const response = await learningObjectsDataSource.getByModuleId(props.moduleId, {
        page: 1,
        limit: totalToFetch,
        typeId: activeTypeId.value,
      })

      if (response) {
        loadedLearningObjects.value = [...response.records]
        totalItems.value = response.total
        totalPages.value = response.pages
      }
    },
  })
}

const sortedVideos = computed(() => sortVideosByOrderIndex(videos.value))

const { reorderByDrag: reorderVideoByDrag, isReorderingVideos } = useVideosListReorder(props.moduleId)

function handleVideoReorderDrag(movedVideo: VideoDto, targetVideo: VideoDto) {
  reorderVideoByDrag(movedVideo, targetVideo, {
    onSuccess: () => {
      refreshAllVideos()
    },
  })
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
          @click="selectType(type)"
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

    <VideosTabContent
      v-if="isVideoTab"
      :videos="sortedVideos"
      :module-id="moduleId"
      :is-loading="isLoading"
      :has-next-page="hasNextPageVideo"
      :is-fetching-next-page="isFetchingNextPageVideo"
      :load-more="loadMoreVideo"
      :reorder-pending="isReorderingVideos"
      :on-reorder-drag="canEdit && sortedVideos.length > 1 ? handleVideoReorderDrag : undefined"
    />

    <GenericTabContent
      v-else
      :learning-objects="sortedLearningObjects"
      :is-loading="isLoading"
      :can-edit="canEdit"
      :has-next-page="hasNextPage"
      :is-fetching-next-page="isFetchingNextPage"
      :load-more="loadMore"
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
