import type { VideoDto } from '../types/video.types'

export function sortVideosByOrderIndex(list: VideoDto[]): VideoDto[] {
  return [...list].sort((a, b) => {
    const byOrder = a.orderIndex - b.orderIndex
    return byOrder !== 0 ? byOrder : a.id - b.id
  })
}
