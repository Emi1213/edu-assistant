export function resolveVideoSource(sourceUrl: string | null | undefined): string | null {
  if (!sourceUrl) return null
  const trimmed = sourceUrl.trim()
  if (!trimmed) return null
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? ''
  const base = baseUrl.replace(/\/$/, '')
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return base ? `${base}${path}` : path
}
