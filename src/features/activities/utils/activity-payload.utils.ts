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
} {
  const opts = act.options
  if (!opts || typeof opts !== 'object') return { options: {} }
  switch (act.type) {
    case 'MULTIPLE_CHOICE': {
      const mc = opts as unknown as MultipleChoiceActivityOptions
      return {
        options: {
          options: mc.options ?? [],
          correctAnswer: mc.correctAnswer ?? 0,
        },
      }
    }
    case 'TRUE_FALSE': {
      const tf = opts as unknown as TrueFalseActivityOptions
      return {
        options: {
          correctAnswer: tf.correctAnswer ?? true,
        },
      }
    }
    case 'FILL_BLANK': {
      const fb = opts as unknown as (FillBlankActivityOptions & { acceptableAnswers?: string[]; correctAnswer?: string })
      const acceptableAnswers = fb.acceptableAnswers ?? fb.correctAnswers ?? []
      return {
        options: {
          correctAnswer: fb.correctAnswer ?? (acceptableAnswers.length > 0 ? acceptableAnswers[0] : ''),
          acceptableAnswers,
        },
      }
    }
    case 'MATCH': {
      const m = opts as unknown as (MatchActivityOptions & { pairs?: { left: string; right: string }[] })
      const pairs = m.pairs ?? []
      return {
        options: {
          pairs,
        },
      }
    }
    default:
      return { options: opts as Record<string, unknown> }
  }
}

export function toEditOptionsShape(
  type: ActivityType,
  options: Record<string, unknown>
): ActivityOptionsByType {
  switch (type) {
    case 'MULTIPLE_CHOICE': {
      const opts = (options.options as string[]) ?? []
      const correctAnswer = (options.correctAnswer as number) ?? 0
      return {
        options: opts.length ? opts : ['', '', '', ''],
        correctAnswer: typeof correctAnswer === 'number' ? correctAnswer : 0,
      }
    }
    case 'TRUE_FALSE': {
      const correctAnswer = (options.correctAnswer as boolean) ?? true
      return { correctAnswer: typeof correctAnswer === 'boolean' ? correctAnswer : true }
    }
    case 'FILL_BLANK': {
      const acceptableAnswers = (options.acceptableAnswers as string[]) ?? (options.correctAnswers as string[]) ?? []
      return { correctAnswers: acceptableAnswers }
    }
    case 'MATCH': {
      const pairs = (options.pairs as { left: string; right: string }[]) ?? []
      return {
        leftItems: pairs.map((p) => p.left),
        rightItems: pairs.map((p) => p.right),
      }
    }
    default:
      return { options: [], correctAnswer: 0 } as MultipleChoiceActivityOptions
  }
}

export function buildUpdatePayloadFromEditForm(editForm: {
  type: ActivityType
  options: ActivityOptionsByType
}): Pick<UpdateActivityPayload, 'options'> {
  const type = editForm.type
  const opts = editForm.options
  switch (type) {
    case 'MULTIPLE_CHOICE': {
      const mc = opts as MultipleChoiceActivityOptions
      const optionsList = mc.options?.filter(Boolean) ?? []
      return {
        options: {
          options: optionsList.length >= 2 ? optionsList : mc.options ?? [],
          correctAnswer: mc.correctAnswer ?? 0,
        },
      }
    }
    case 'TRUE_FALSE': {
      const tf = opts as TrueFalseActivityOptions
      return {
        options: {
          correctAnswer: tf.correctAnswer ?? true,
        },
      }
    }
    case 'FILL_BLANK': {
      const fb = opts as FillBlankActivityOptions
      const list = fb.correctAnswers ?? []
      return {
        options: {
          correctAnswer: list.length > 0 ? list[0] : '',
          acceptableAnswers: list,
        },
      }
    }
    case 'MATCH': {
      const m = opts as MatchActivityOptions
      const left = m.leftItems ?? []
      const right = m.rightItems ?? []
      const pairs = left.map((l, i) => ({
        left: l,
        right: right[i] ?? '',
      }))
      return {
        options: {
          pairs,
        },
      }
    }
    default:
      return { options: {} }
  }
}
