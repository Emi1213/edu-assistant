import { FileVideo, Youtube } from 'lucide-vue-next'
import type { Component } from 'vue'
import type { SourceKind } from '../types/video.types'

export const SOURCE_ICONS: Record<SourceKind, Component> = {
  YOUTUBE_URL: Youtube,
  VIDEO_FILE: FileVideo,
}
