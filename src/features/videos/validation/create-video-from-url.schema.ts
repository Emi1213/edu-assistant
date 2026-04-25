import { z } from 'zod'
import { YOUTUBE_URL_REGEX } from '../utils/extract-youtube-id'

export const createVideoFromUrlSchema = z.object({
  moduleId: z.number().int().positive(),
  title: z.string().trim().min(3, 'Mínimo 3 caracteres').max(200, 'Máximo 200 caracteres'),
  url: z
    .string()
    .trim()
    .url('URL inválida')
    .regex(YOUTUBE_URL_REGEX, 'URL de YouTube inválida'),
  outputLanguage: z.enum(['auto', 'es', 'en']).default('auto'),
})

export type CreateVideoFromUrlFormValues = z.infer<typeof createVideoFromUrlSchema>
