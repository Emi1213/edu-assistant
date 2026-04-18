import { VIDEO_BLOCK_TYPES } from '../constants/video-block-type.constants'
import {
  FULL_FAILURE_PREFIX,
  PARTIAL_ERROR_PREFIX,
} from '../constants/video-error.constants'
import type { VideoBlockType } from '../types/video-block.types'

export type VideoErrorKind = 'none' | 'partial' | 'full' | 'generic'

export interface ParsedVideoError {
  kind: VideoErrorKind
  failedTypes: VideoBlockType[]
  raw: string | null
}

const EMPTY: ParsedVideoError = { kind: 'none', failedTypes: [], raw: null }

function extractTypes(body: string): VideoBlockType[] {
  const known = new Set<string>(VIDEO_BLOCK_TYPES)
  return body
    .split(',')
    .map((s) => s.trim())
    .filter((s): s is VideoBlockType => known.has(s))
}

export function parseVideoErrorMessage(
  errorMessage: string | null | undefined,
): ParsedVideoError {
  if (!errorMessage) return EMPTY

  if (errorMessage.startsWith(PARTIAL_ERROR_PREFIX)) {
    const body = errorMessage.slice(PARTIAL_ERROR_PREFIX.length)
    const failedTypes = extractTypes(body)
    return { kind: 'partial', failedTypes, raw: errorMessage }
  }

  if (errorMessage.startsWith(FULL_FAILURE_PREFIX)) {
    const body = errorMessage.slice(FULL_FAILURE_PREFIX.length)
    const failedTypes = extractTypes(body)
    return { kind: 'full', failedTypes, raw: errorMessage }
  }

  return { kind: 'generic', failedTypes: [], raw: errorMessage }
}
