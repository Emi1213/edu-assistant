import type { VideoDto } from '../types/video.types'
import { useReorderVideos } from './use-reorder-videos'

export function useVideosListReorder(moduleId: number) {
  const { mutate: reorderVideos, isPending: isReorderingVideos } = useReorderVideos(moduleId)

  function reorderByDrag(movedVideo: VideoDto, targetVideo: VideoDto) {
    reorderVideos({
      id: movedVideo.id,
      orderIndex: targetVideo.orderIndex,
    })
  }

  return { reorderByDrag, isReorderingVideos }
}
