export const MAX_VIDEO_FILE_SIZE_BYTES = 500 * 1024 * 1024

export const ACCEPTED_VIDEO_MIME_TYPES: readonly string[] = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-matroska',
  'video/mp2t',
] as const

export const ACCEPTED_VIDEO_EXTENSIONS = 'mp4, webm, mov, avi, mkv, m4v'
