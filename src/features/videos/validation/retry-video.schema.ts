import { z } from 'zod'

export const retryVideoSchema = z.object({
  contentTypes: z
    .array(z.enum(['SUMMARY', 'FLASHCARDS', 'QUIZ', 'GLOSSARY']))
    .optional(),
  instruction: z.string().trim().max(500, 'Máximo 500 caracteres').optional(),
})

export type RetryVideoFormValues = z.infer<typeof retryVideoSchema>
