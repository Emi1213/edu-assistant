export const YOUTUBE_URL_REGEX =
  /^https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[?&].*)?$/

export function extractYoutubeId(url: string): string | null {
  const match = url.trim().match(YOUTUBE_URL_REGEX)
  return match?.[1] ?? null
}
