import type { ActivityType, ActivityOptionsByType } from '../types'

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
