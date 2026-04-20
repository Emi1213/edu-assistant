export const POLLING_INTERVAL_MS = 5000
export const PROCESSING_TIMEOUT_MS = 10 * 60 * 1000
export const PROCESSING_ESTIMATE_LABEL = '~2 minutos'

export const PROCESSING_STEPS: readonly string[] = [
  'Recibiendo',
  'Extrayendo audio',
  'Transcribiendo',
  'Generando contenido',
  'Finalizando',
] as const
