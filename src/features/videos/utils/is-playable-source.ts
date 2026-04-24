import type { SourceKind } from '../types/video.types'

export const isPlayableSource = (kind: SourceKind): boolean => kind === 'YOUTUBE_URL'
