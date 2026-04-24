import type { VideoBlockType, VideoBlockContent } from './video-block.types'

export interface UpsertVideoBlockPayload {
  id?: number
  orderIndex?: number
  type: VideoBlockType
  content: VideoBlockContent
  tipTapContent: null
}

export interface UpdateVideoContentPayload {
  blocks: UpsertVideoBlockPayload[]
}
