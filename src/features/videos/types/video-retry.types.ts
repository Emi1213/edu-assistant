import type { VideoBlockType } from './video-block.types'

export interface RetryVideoPayload {
  contentTypes?: VideoBlockType[]
  instruction?: string
}
