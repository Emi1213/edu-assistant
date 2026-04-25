import { z } from 'zod'

const summaryContent = z.object({
  title: z.string().trim().min(1, 'Requerido'),
  summary: z.string().trim().min(1, 'Requerido'),
  examples: z.array(z.string().trim().min(3, 'Mínimo 3 caracteres')),
  keyConcepts: z.array(z.string().trim().min(3, 'Mínimo 3 caracteres')),
  whatYouLearn: z.array(z.string().trim().min(3, 'Mínimo 3 caracteres')),
})

const flashcardsContent = z.object({
  items: z
    .array(
      z.object({
        front: z.string().trim().min(1, 'Requerido'),
        back: z.string().trim().min(1, 'Requerido'),
      }),
    )
    .min(1, 'Al menos una flashcard'),
})

const quizContent = z.object({
  questions: z
    .array(
      z.object({
        question: z.string().trim().min(1, 'Requerido'),
        options: z.array(z.string().trim().min(1, 'Requerido')).length(4, '4 opciones'),
        correctAnswer: z.number().int().min(0).max(3),
        explanation: z.string().trim().min(1, 'Requerido'),
      }),
    )
    .min(1, 'Al menos una pregunta'),
})

const glossaryContent = z.object({
  terms: z
    .array(
      z.object({
        term: z.string().trim().min(1, 'Requerido'),
        definition: z.string().trim().min(1, 'Requerido'),
      }),
    )
    .min(1, 'Al menos un término'),
})

export const summaryContentSchema = summaryContent
export const flashcardsContentSchema = flashcardsContent
export const quizContentSchema = quizContent
export const glossaryContentSchema = glossaryContent
