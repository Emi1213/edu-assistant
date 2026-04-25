import { ref } from 'vue'
import type { OutputLanguage } from '../types/video.types'
import { DEFAULT_OUTPUT_LANGUAGE } from '../constants/video-language.constants'

export type VideoCreatorTab = 'youtube' | 'upload'

export function useVideoCreator() {
  const activeTab = ref<VideoCreatorTab>('youtube')
  const title = ref('')
  const outputLanguage = ref<OutputLanguage>(DEFAULT_OUTPUT_LANGUAGE)
  const youtubeUrl = ref('')
  const file = ref<File | null>(null)

  function reset() {
    activeTab.value = 'youtube'
    title.value = ''
    outputLanguage.value = DEFAULT_OUTPUT_LANGUAGE
    youtubeUrl.value = ''
    file.value = null
  }

  return { activeTab, title, outputLanguage, youtubeUrl, file, reset }
}
