<template>
  <div class="relative overflow-hidden rounded-md aspect-video w-full sm:w-40 shrink-0">
    <img
      v-if="youtubeId"
      :src="`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`"
      :alt="title"
      class="w-full h-full object-cover bg-muted"
      loading="lazy"
    />
    <div
      v-else
      class="file-thumb w-full h-full relative isolate"
      :style="posterStyle"
    >
      <div class="file-thumb__mesh absolute inset-0"></div>
      <div class="file-thumb__grain absolute inset-0 pointer-events-none"></div>

      <svg
        class="absolute -top-8 -right-8 w-28 h-28 text-white/10 pointer-events-none"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        stroke-width="1"
      >
        <circle cx="100" cy="100" r="95" />
        <circle cx="100" cy="100" r="72" />
        <circle cx="100" cy="100" r="49" />
      </svg>

      <div class="relative h-full w-full flex flex-col justify-between p-2.5">
        <span
          class="text-[9px] tracking-[0.22em] font-semibold uppercase text-white/75 leading-none"
        >
          Archivo
        </span>

        <div class="flex items-end justify-between gap-2">
          <div
            class="w-8 h-8 rounded-full border border-white/35 bg-white/5 backdrop-blur-sm flex items-center justify-center"
          >
            <Play
              class="w-3 h-3 text-white translate-x-[0.5px]"
              :stroke-width="1.5"
              fill="currentColor"
            />
          </div>
          <div class="h-px w-6 bg-[color:var(--accent-ink-soft)]/70 mb-1.5"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Play } from 'lucide-vue-next'
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
</script>

<style scoped>
.file-thumb {
  background:
    linear-gradient(var(--poster-tilt, 0deg), rgba(15, 23, 64, 0) 0%, rgba(15, 23, 64, 0.35) 100%),
    linear-gradient(135deg, var(--primary) 0%, #151f52 55%, #0c1238 100%);
}

.file-thumb__mesh {
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

.file-thumb__grain {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.35 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  mix-blend-mode: overlay;
  opacity: 0.35;
}
</style>
