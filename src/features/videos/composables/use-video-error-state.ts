import { computed, type ComputedRef, type Ref } from 'vue'
import { parseVideoErrorMessage, type VideoErrorKind } from '../utils/parse-video-error-message'
import { needsReview } from '../types/video-block.types'
import type { FullVideoDto, IngestionStatus } from '../types/video.types'
import type { VideoBlockType } from '../types/video-block.types'

export interface VideoErrorState {
  kind: ComputedRef<VideoErrorKind>
  failedTypes: ComputedRef<VideoBlockType[]>
  needsReviewTypes: ComputedRef<VideoBlockType[]>
  isPartial: ComputedRef<boolean>
  isFullFailure: ComputedRef<boolean>
  rawMessage: ComputedRef<string | null>
}

export function useVideoErrorState(
  video: Ref<FullVideoDto | null | undefined>,
  status: Ref<IngestionStatus | undefined>,
  errorMessage: Ref<string | null>,
): VideoErrorState {
  const parsed = computed(() => parseVideoErrorMessage(errorMessage.value))

  const failedTypes = computed(() =>
    status.value === 'COMPLETED' || status.value === 'FAILED' ? parsed.value.failedTypes : [],
  )

  const isPartial = computed(
    () => status.value === 'COMPLETED' && parsed.value.kind === 'partial',
  )

  const isFullFailure = computed(() => status.value === 'FAILED')

  const needsReviewTypes = computed<VideoBlockType[]>(() => {
    const blocks = video.value?.blocks ?? []
    return blocks.filter((b) => needsReview(b.content)).map((b) => b.type)
  })

  return {
    kind: computed(() => parsed.value.kind),
    failedTypes,
    needsReviewTypes,
    isPartial,
    isFullFailure,
    rawMessage: computed(() => parsed.value.raw),
  }
}
