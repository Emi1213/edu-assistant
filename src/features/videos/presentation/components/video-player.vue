<template>
  <div v-if="youtubeId" class="aspect-video w-full rounded-md overflow-hidden bg-black">
    <lite-youtube :videoid="youtubeId" :title="title" class="w-full h-full" />
  </div>
  <div
    v-else
    class="file-poster aspect-video w-full rounded-md overflow-hidden relative isolate"
    :style="posterStyle"
  >
    <div class="file-poster__mesh absolute inset-0"></div>
    <div class="file-poster__grain absolute inset-0 pointer-events-none"></div>

    <svg
      class="absolute -top-24 -right-24 w-[22rem] h-[22rem] text-white/10 pointer-events-none"
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      stroke-width="0.6"
    >
      <circle cx="100" cy="100" r="95" />
      <circle cx="100" cy="100" r="78" />
      <circle cx="100" cy="100" r="61" />
      <circle cx="100" cy="100" r="44" />
      <circle cx="100" cy="100" r="27" />
    </svg>

    <div
      class="relative h-full w-full flex flex-col justify-between p-5 sm:p-8 lg:p-10 gap-4"
    >
      <div class="flex items-start justify-between gap-4">
        <span
          class="text-[10px] sm:text-[11px] tracking-[0.28em] font-semibold uppercase text-white/75"
        >
          Archivo de video
        </span>
        <span
          class="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] uppercase tracking-wider text-white/65 whitespace-nowrap"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-[color:var(--accent-ink-soft)]"></span>
          Contenido analizado
        </span>
      </div>

      <div class="space-y-3 max-w-3xl">
        <h2
          class="video-display-serif text-white font-semibold tracking-tight leading-[1.05] text-2xl sm:text-4xl lg:text-5xl line-clamp-3 break-words"
        >
          {{ title }}
        </h2>
        <div class="h-[2px] w-14 bg-[color:var(--accent-ink-soft)] rounded-full"></div>
      </div>

      <div class="flex items-end justify-between gap-4">
        <div class="flex items-center gap-3 min-w-0">
          <div
            class="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-white/35 flex items-center justify-center bg-white/5 backdrop-blur-sm shrink-0"
          >
            <Play
              class="w-4 h-4 sm:w-[18px] sm:h-[18px] text-white translate-x-[1px]"
              :stroke-width="1.5"
              fill="currentColor"
            />
          </div>
          <div class="flex flex-col min-w-0">
            <span class="video-display-serif italic text-white/90 text-sm sm:text-base leading-tight">
              Solo contenido
            </span>
            <span class="text-[11px] text-white/55 leading-tight truncate">
              El archivo original no se almacenó
            </span>
          </div>
        </div>

        <FileVideo class="w-5 h-5 sm:w-6 sm:h-6 text-white/35 shrink-0" :stroke-width="1.5" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { FileVideo, Play } from 'lucide-vue-next'
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

const posterStyle = computed(() => {
  const seed = [...props.title].reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  const meshX = 15 + (seed % 35)
  const meshY = 20 + ((seed * 7) % 30)
  const tilt = (seed % 40) - 20
  return {
    '--poster-mesh-x': `${meshX}%`,
    '--poster-mesh-y': `${meshY}%`,
    '--poster-tilt': `${tilt}deg`,
  } as Record<string, string>
})

let ytEmbedLoaded = false
watch(
  youtubeId,
  async (id) => {
    if (!id || ytEmbedLoaded) return
    ytEmbedLoaded = true
    await import('lite-youtube-embed/src/lite-yt-embed.js')
    await import('lite-youtube-embed/src/lite-yt-embed.css')
  },
  { immediate: true },
)
</script>

<style scoped>
.file-poster {
  background:
    linear-gradient(var(--poster-tilt, 0deg), rgba(15, 23, 64, 0) 0%, rgba(15, 23, 64, 0.35) 100%),
    linear-gradient(135deg, var(--primary) 0%, #151f52 55%, #0c1238 100%);
}

.file-poster__mesh {
  background:
    radial-gradient(
      circle at var(--poster-mesh-x, 20%) var(--poster-mesh-y, 25%),
      var(--accent-ink) 0%,
      rgba(182, 90, 54, 0.45) 22%,
      transparent 55%
    ),
    radial-gradient(
      circle at calc(100% - var(--poster-mesh-x, 20%)) 85%,
      rgba(251, 241, 232, 0.2) 0%,
      transparent 50%
    );
  mix-blend-mode: screen;
  opacity: 0.9;
}

.file-poster__grain {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.35 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  mix-blend-mode: overlay;
  opacity: 0.35;
}
</style>
