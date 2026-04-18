<template>
  <div v-if="youtubeId" class="aspect-video w-full rounded-md overflow-hidden bg-black">
    <lite-youtube :videoid="youtubeId" :title="title" class="w-full h-full" />
  </div>
  <div
    v-else
    class="aspect-video w-full rounded-md bg-muted flex flex-col items-center justify-center text-muted-foreground"
  >
    <FileVideo class="w-10 h-10 mb-2" />
    <p class="text-sm font-medium">Archivo procesado</p>
    <p class="text-xs">El archivo original no está disponible</p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { FileVideo } from 'lucide-vue-next'
import { extractYoutubeId } from '../../utils/extract-youtube-id'
import type { SourceKind } from '../../types/video.types'

const props = defineProps<{
  sourceKind: SourceKind
  sourceUrl: string
  title: string
}>()

onMounted(async () => {
  await import('lite-youtube-embed/src/lite-yt-embed.js')
  await import('lite-youtube-embed/src/lite-yt-embed.css')
})

const youtubeId = computed(() =>
  props.sourceKind === 'YOUTUBE_URL' ? extractYoutubeId(props.sourceUrl) : null,
)
</script>
