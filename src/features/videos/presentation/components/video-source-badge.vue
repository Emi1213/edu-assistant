<template>
  <span
    class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
    :class="badgeClasses"
  >
    <component :is="SOURCE_ICONS[sourceKind]" class="w-3 h-3" />
    {{ SOURCE_LABELS[sourceKind] }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { SOURCE_ICONS } from '../../constants/video-source.constants'
import { SOURCE_LABELS } from '../../constants/video-labels.constants'
import type { SourceKind } from '../../types/video.types'

const props = defineProps<{ sourceKind: SourceKind }>()

const badgeClasses = computed(() =>
  props.sourceKind === 'YOUTUBE_URL'
    ? 'bg-red-50 text-red-700'
    : 'bg-blue-50 text-blue-700',
)
</script>
