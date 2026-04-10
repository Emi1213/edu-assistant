import type {
  Activity,
  ActivityType,
  ActivityOptionsByType,
  UpdateActivityPayload,
  MultipleChoiceActivityOptions,
  TrueFalseActivityOptions,
  FillBlankActivityOptions,
  MatchActivityOptions,
  CreateActivityOptionsDto,
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
  question: string
  options: ActivityOptionsByType
  explanation?: string
  difficulty: number
  isApprovedByTeacher: boolean
  usedAsExample: boolean
}): UpdateActivityPayload {
  const type = editForm.type
  const opts = editForm.options
  const explanation = (editForm.explanation ?? '').trim()
  let options: CreateActivityOptionsDto
  switch (type) {
    case 'MULTIPLE_CHOICE': {
      const mc = opts as MultipleChoiceActivityOptions
      const raw = [...(mc.options ?? [])]
      while (raw.length < 4) raw.push('')
      const normalized = raw.slice(0, 4).map((s) => String(s ?? '').trim())
      options = {
        question: editForm.question.trim(),
        options: [
          normalized[0] ?? '',
          normalized[1] ?? '',
          normalized[2] ?? '',
          normalized[3] ?? '',
        ],
        correctAnswer: Math.min(3, Math.max(0, mc.correctAnswer ?? 0)),
        explanation,
      }
      break
    }
    case 'TRUE_FALSE': {
      const tf = opts as TrueFalseActivityOptions
      options = {
        statement: editForm.question.trim(),
        correctAnswer: tf.correctAnswer ?? true,
        explanation,
      }
      break
    }
    case 'FILL_BLANK': {
      const fb = opts as FillBlankActivityOptions
      const list = (fb.correctAnswers ?? []).map((s) => s.trim()).filter(Boolean).slice(0, 3)
      const correct = list[0] ?? ''
      options = {
        sentence: editForm.question.trim(),
        correctAnswer: correct,
        acceptableAnswers: list.length > 0 ? list : (correct ? [correct] : []),
        explanation,
      }
      break
    }
    case 'MATCH': {
      const m = opts as MatchActivityOptions
      const left = m.leftItems ?? []
      const right = m.rightItems ?? []
      const pairs = left.map((l, i) => ({
        left: l,
        right: right[i] ?? '',
      })).filter((p) => p.left.trim() && p.right.trim())
      options = {
        instructions: editForm.question.trim(),
        pairs,
        explanation: explanation || undefined,
      }
      break
    }
    default:
      options = {
        question: editForm.question.trim(),
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation,
      }
  }

  return {
    type: editForm.type,
    options,
    difficulty: editForm.difficulty,
    isApprovedByTeacher: editForm.isApprovedByTeacher,
    usedAsExample: editForm.usedAsExample,
  }
}
