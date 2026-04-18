<template>
  <div class="relative overflow-hidden rounded-md bg-muted aspect-video w-40 shrink-0">
    <img
      v-if="youtubeId"
      :src="`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`"
      :alt="title"
      class="w-full h-full object-cover"
      loading="lazy"
    />
    <div v-else class="w-full h-full flex items-center justify-center text-muted-foreground">
      <FileVideo class="w-8 h-8" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { FileVideo } from 'lucide-vue-next'
import { extractYoutubeId } from '../../utils/extract-youtube-id'
import type { SourceKind } from '../../types/video.types'

const props = defineProps<{
  sourceKind: SourceKind
  sourceUrl: string
  title: string
}>()

const youtubeId = computed(() =>
  props.sourceKind === 'YOUTUBE_URL' ? extractYoutubeId(props.sourceUrl) : null,
)
</script>
