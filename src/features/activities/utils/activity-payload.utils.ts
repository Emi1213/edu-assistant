import type {
  Activity,
  ActivityType,
  ActivityOptionsByType,
  UpdateActivityPayload,
  MultipleChoiceActivityOptions,
  TrueFalseActivityOptions,
  FillBlankActivityOptions,
  MatchActivityOptions,
} from '../types'

export function getOptionsAndCorrectAnswer(act: Activity): {
  options: Record<string, unknown>
  correctAnswer?: UpdateActivityPayload['correctAnswer']
} {
  const opts = act.options
  if (!opts || typeof opts !== 'object') return { options: {} }
  switch (act.type) {
    case 'MULTIPLE_CHOICE': {
      const mc = opts as MultipleChoiceActivityOptions
      return { options: { options: mc.options ?? [] }, correctAnswer: mc.correctAnswer }
    }
    case 'TRUE_FALSE': {
      const tf = opts as TrueFalseActivityOptions
      return { options: {}, correctAnswer: tf.correctAnswer }
    }
    case 'FILL_BLANK': {
      const fb = opts as FillBlankActivityOptions
      const correctAnswers = fb.correctAnswers ?? []
      return {
        options: { correctAnswers },
        correctAnswer: correctAnswers.length === 1 ? correctAnswers[0] : correctAnswers,
      }
    }
    case 'MATCH': {
      const m = opts as MatchActivityOptions
      return {
        options: { leftItems: m.leftItems ?? [], rightItems: m.rightItems ?? [] },
        correctAnswer: m.correctPairs ?? [],
      }
    }
    default:
      return { options: opts as Record<string, unknown> }
  }
}

export function toEditOptionsShape(
  type: ActivityType,
  options: Record<string, unknown>,
  correctAnswer?: UpdateActivityPayload['correctAnswer']
): ActivityOptionsByType {
  switch (type) {
    case 'MULTIPLE_CHOICE': {
      const opts = (options.options as string[]) ?? []
      return { options: opts.length ? opts : ['', '', '', ''], correctAnswer: typeof correctAnswer === 'number' ? correctAnswer : 0 }
    }
    case 'TRUE_FALSE':
      return { correctAnswer: typeof correctAnswer === 'boolean' ? correctAnswer : true }
    case 'FILL_BLANK':
      return { correctAnswers: (options.correctAnswers as string[]) ?? [] }
    case 'MATCH':
      return {
        leftItems: (options.leftItems as string[]) ?? [],
        rightItems: (options.rightItems as string[]) ?? [],
      }
    default:
      return { options: [], correctAnswer: 0 }
  }
}

export function buildUpdatePayloadFromEditForm(editForm: {
  type: ActivityType
  options: ActivityOptionsByType
}): Pick<UpdateActivityPayload, 'options' | 'correctAnswer'> {
  const type = editForm.type
  const opts = editForm.options
  switch (type) {
    case 'MULTIPLE_CHOICE': {
      const mc = opts as MultipleChoiceActivityOptions
      const optionsList = mc.options?.filter(Boolean) ?? []
      return {
        options: { options: optionsList.length >= 2 ? optionsList : mc.options ?? [] },
        correctAnswer: mc.correctAnswer ?? 0,
      }
    }
    case 'TRUE_FALSE':
      return { options: {}, correctAnswer: (opts as TrueFalseActivityOptions).correctAnswer ?? true }
    case 'FILL_BLANK': {
      const fb = opts as FillBlankActivityOptions
      const list = fb.correctAnswers ?? []
      return { options: { correctAnswers: list }, correctAnswer: list.length === 1 ? list[0] : list }
    }
    case 'MATCH': {
      const m = opts as MatchActivityOptions
      const left = m.leftItems ?? []
      const right = m.rightItems ?? []
      return { options: { leftItems: left, rightItems: right }, correctAnswer: left.map((_, i) => [i, i] as [number, number]) }
    }
    default:
      return { options: {}, correctAnswer: undefined }
  }
}
