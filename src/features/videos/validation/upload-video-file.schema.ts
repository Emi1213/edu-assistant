import { z } from 'zod'
import {
  ACCEPTED_VIDEO_MIME_TYPES,
  MAX_VIDEO_FILE_SIZE_BYTES,
} from '../constants/video-upload.constants'

export const uploadVideoFileSchema = z.object({
  moduleId: z.number().int().positive(),
  title: z.string().trim().min(3, 'Mínimo 3 caracteres').max(200, 'Máximo 200 caracteres'),
  outputLanguage: z.enum(['auto', 'es', 'en']).default('auto'),
  file: z
    .instanceof(File, { message: 'Seleccioná un archivo' })
    .refine((f) => f.size <= MAX_VIDEO_FILE_SIZE_BYTES, 'El archivo supera 500 MB')
    .refine(
      (f) => ACCEPTED_VIDEO_MIME_TYPES.includes(f.type),
      'Formato de archivo no soportado',
    ),
})

export type UploadVideoFileFormValues = z.infer<typeof uploadVideoFileSchema>
