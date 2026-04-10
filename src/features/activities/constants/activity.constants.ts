import type {
  ActivityType,
  ActivityOptionsByType,
  CreateActivityOptionsDto,
} from '../types'

export const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  MULTIPLE_CHOICE: 'Opción múltiple',
  TRUE_FALSE: 'Verdadero / Falso',
  FILL_BLANK: 'Completar espacios',
  MATCH: 'Emparejar',
}

export function getActivityTypeLabel(type: string): string {
  return ACTIVITY_TYPE_LABELS[type] ?? type
}

export function getDefaultOptionsForType(t: ActivityType): ActivityOptionsByType {
  switch (t) {
    case 'MULTIPLE_CHOICE':
      return { options: ['', '', '', ''], correctAnswer: 0 }
    case 'TRUE_FALSE':
      return { correctAnswer: true }
    case 'FILL_BLANK':
      return { blanks: [], correctAnswers: [] }
    case 'MATCH':
      return { leftItems: [], rightItems: [], correctPairs: [] }
    default:
      return { options: ['', '', '', ''], correctAnswer: 0 }
  }
}

export function getDefaultCreateOptionsForType(t: ActivityType): CreateActivityOptionsDto {
  switch (t) {
    case 'MULTIPLE_CHOICE':
      return {
        question: '',
        options: ['', '', '', ''] as [string, string, string, string],
        correctAnswer: 0,
        explanation: '',
      }
    case 'TRUE_FALSE':
      return {
        statement: '',
        correctAnswer: true,
        explanation: '',
      }
    case 'FILL_BLANK':
      return {
        sentence: '',
        correctAnswer: '',
        acceptableAnswers: [],
        explanation: '',
      }
    case 'MATCH':
      return {
        instructions: '',
        pairs: [],
        explanation: '',
      }
    default:
      return {
        question: '',
        options: ['', '', '', ''] as [string, string, string, string],
        correctAnswer: 0,
        explanation: '',
      }
  }
}
