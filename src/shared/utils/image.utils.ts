export function toImageDataUrl(base64: string | null | undefined): string {
  if (base64 == null || base64 === '') return ''
  if (base64.startsWith('data:')) return base64
  return `data:image/png;base64,${base64}`
}

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export function toFullAssetUrl(pathOrUrl: string | null | undefined): string {
  if (pathOrUrl == null || pathOrUrl === '') return ''
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) return pathOrUrl
  const base = apiBaseUrl.replace(/\/$/, '')
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
  return `${base}${path}`
}
