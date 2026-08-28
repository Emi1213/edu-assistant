import type { VideoDto } from '../types/video.types'
import { useReorderVideos } from './use-reorder-videos'

export function useVideosListReorder(moduleId: number) {
  const { mutate: reorderVideos, isPending: isReorderingVideos } = useReorderVideos(moduleId)

  function reorderByDrag(
    movedVideo: VideoDto,
    targetVideo: VideoDto,
    options?: { onSuccess?: () => void; onError?: (error: unknown) => void },
  ) {
    reorderVideos(
      {
        id: movedVideo.id,
        orderIndex: targetVideo.orderIndex,
      },
      options,
    )
  }

  return { reorderByDrag, isReorderingVideos }
}
