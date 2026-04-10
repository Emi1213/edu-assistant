import type {
  ActivityType,
  CreateActivityPayload,
  CreateActivityMultipleChoiceDto,
  CreateActivityTrueFalseDto,
  CreateActivityFillBlankDto,
  CreateActivityMatchDto,
} from '../types'

export type GeneratedActivityPreview = {
  type: string
  question: string
  options?: string[]
  correctAnswer?: number
  correctAnswerBoolean?: boolean
  explanation?: string
  sentence?: string
  correctAnswerText?: string
  acceptableAnswers?: string[]
  pairs?: { left: string; right: string }[]
}

export function isActivityResponse(data: unknown): data is { activity: unknown } {
  return data != null && typeof data === 'object' && 'activity' in data
}

export function mapApiActivityToPreview(
  activity: Record<string, unknown>,
  requestedType: string
): GeneratedActivityPreview | null {
  const type = requestedType || (typeof activity.type === 'string' ? activity.type : 'MULTIPLE_CHOICE')

  if (type === 'TRUE_FALSE') {
    const statement = typeof activity.statement === 'string' ? activity.statement : ''
    if (!statement) return null
    return {
      type: 'TRUE_FALSE',
      question: statement,
      correctAnswerBoolean: typeof activity.correctAnswer === 'boolean' ? activity.correctAnswer : true,
      explanation: typeof activity.explanation === 'string' ? activity.explanation : undefined,
    }
  }

  if (type === 'FILL_BLANK') {
    const sentence = typeof activity.sentence === 'string' ? activity.sentence : ''
    if (!sentence) return null
    const acceptableAnswers = Array.isArray(activity.acceptableAnswers)
      ? (activity.acceptableAnswers as string[]).filter((s): s is string => typeof s === 'string')
      : []
    return {
      type: 'FILL_BLANK',
      question: sentence,
      sentence,
      correctAnswerText: typeof activity.correctAnswer === 'string' ? activity.correctAnswer : '',
      acceptableAnswers: acceptableAnswers.length ? acceptableAnswers : undefined,
      explanation: typeof activity.explanation === 'string' ? activity.explanation : undefined,
    }
  }

  if (type === 'MATCH') {
    const instructions = typeof activity.instructions === 'string' ? activity.instructions : ''
    if (!instructions) return null
    const pairs = Array.isArray(activity.pairs)
      ? (activity.pairs as Array<{ left?: string; right?: string }>)
          .map((p) => ({
            left: typeof p?.left === 'string' ? p.left : '',
            right: typeof p?.right === 'string' ? p.right : '',
          }))
          .filter((p) => p.left || p.right)
      : []
    return {
      type: 'MATCH',
      question: instructions,
      pairs: pairs.length ? pairs : undefined,
      explanation: typeof activity.explanation === 'string' ? activity.explanation : undefined,
    }
  }

  const question = typeof activity.question === 'string' ? activity.question : ''
  if (!question) return null
  let options = Array.isArray(activity.options)
    ? (activity.options as string[]).filter((s): s is string => typeof s === 'string')
    : []
  while (options.length < 4) options.push('')
  options = options.slice(0, 4)
  return {
    type: 'MULTIPLE_CHOICE',
    question,
    options,
    correctAnswer: typeof activity.correctAnswer === 'number' ? activity.correctAnswer : 0,
    explanation: typeof activity.explanation === 'string' ? activity.explanation : undefined,
  }
}

export function buildCreatePayloadFromForm(
  form: CreateActivityPayload,
  matchColumnLeft: string,
  matchColumnRight: string
): { payload?: CreateActivityPayload; error?: string } {
  if (form.type === 'MULTIPLE_CHOICE') {
    const o = form.options as CreateActivityMultipleChoiceDto
    if (!o.question.trim()) return { error: 'Escribe la pregunta' }
    const raw = o.options.map((s) => s.trim()) as [string, string, string, string]
    if (raw.some((x) => !x)) return { error: 'Las cuatro opciones son obligatorias' }
    if (o.correctAnswer < 0 || o.correctAnswer > 3) return { error: 'La respuesta correcta debe ser entre 1 y 4' }
    return {
      payload: {
        type: 'MULTIPLE_CHOICE',
        options: {
          question: o.question.trim(),
          options: raw,
          correctAnswer: o.correctAnswer,
          explanation: o.explanation.trim(),
        },
        difficulty: form.difficulty,
        isApprovedByTeacher: form.isApprovedByTeacher,
      },
    }
  }

  if (form.type === 'TRUE_FALSE') {
    const o = form.options as CreateActivityTrueFalseDto
    if (!o.statement.trim()) return { error: 'Escribe la afirmación' }
    return {
      payload: {
        type: 'TRUE_FALSE',
        options: {
          statement: o.statement.trim(),
          correctAnswer: o.correctAnswer,
          explanation: o.explanation.trim(),
        },
        difficulty: form.difficulty,
        isApprovedByTeacher: form.isApprovedByTeacher,
      },
    }
  }

  if (form.type === 'FILL_BLANK') {
    const o = form.options as CreateActivityFillBlankDto
    if (!o.sentence.trim()) return { error: 'Escribe el enunciado' }
    if (!o.sentence.includes('___')) return { error: 'El enunciado debe incluir ___ donde va la respuesta' }
    if (!o.correctAnswer.trim()) return { error: 'Escribe la respuesta correcta' }
    const correct = o.correctAnswer.trim()
    let acc = o.acceptableAnswers.map((s) => s.trim()).filter(Boolean).slice(0, 3)
    if (acc.length < 1) acc = [correct]
    if (acc.length > 3) return { error: 'Como máximo 3 respuestas aceptables' }
    return {
      payload: {
        type: 'FILL_BLANK',
        options: {
          sentence: o.sentence.trim(),
          correctAnswer: correct,
          acceptableAnswers: acc,
          explanation: o.explanation.trim(),
        },
        difficulty: form.difficulty,
        isApprovedByTeacher: form.isApprovedByTeacher,
      },
    }
  }

  if (form.type === 'MATCH') {
    const o = form.options as CreateActivityMatchDto
    if (!o.instructions.trim()) return { error: 'Escribe las instrucciones' }
    const leftLines = matchColumnLeft.split('\n').map((s) => s.trim()).filter(Boolean)
    const rightLines = matchColumnRight.split('\n').map((s) => s.trim()).filter(Boolean)
    const n = Math.max(leftLines.length, rightLines.length)
    const pairs = Array.from({ length: n }, (_, i) => ({
      left: leftLines[i] ?? '',
      right: rightLines[i] ?? '',
    })).filter((p) => p.left && p.right)
    if (pairs.length < 1) return { error: 'Añade al menos un par en las dos columnas' }
    return {
      payload: {
        type: 'MATCH',
        options: {
          instructions: o.instructions.trim(),
          pairs,
          explanation: o.explanation?.trim() || undefined,
        },
        difficulty: form.difficulty,
        isApprovedByTeacher: form.isApprovedByTeacher,
      },
    }
  }

  return { error: 'Tipo de actividad no soportado' }
}

export function buildCreatePayloadFromPreview(
  preview: GeneratedActivityPreview,
  requestedType: ActivityType,
  difficulty: number
): { payload?: CreateActivityPayload; error?: string } {
  const type = (requestedType || preview.type || 'MULTIPLE_CHOICE') as ActivityType
  const isApprovedByTeacher = false

  if (type === 'MULTIPLE_CHOICE') {
    if (!preview.question.trim() || !preview.options || preview.options.length < 4) {
      return { error: 'Faltan datos para opción múltiple' }
    }
    if (typeof preview.correctAnswer !== 'number') return { error: 'Falta la respuesta correcta' }
    const opts = preview.options.slice(0, 4).map((s) => s.trim()) as [string, string, string, string]
    if (opts.some((s) => !s)) return { error: 'Las cuatro opciones son obligatorias' }
    return {
      payload: {
        type: 'MULTIPLE_CHOICE',
        options: {
          question: preview.question.trim(),
          options: opts,
          correctAnswer: Math.min(3, Math.max(0, preview.correctAnswer)),
          explanation: (preview.explanation ?? '').trim(),
        },
        difficulty,
        isApprovedByTeacher,
      },
    }
  }

  if (type === 'TRUE_FALSE') {
    if (!preview.question.trim()) return { error: 'Falta la afirmación' }
    return {
      payload: {
        type: 'TRUE_FALSE',
        options: {
          statement: preview.question.trim(),
          correctAnswer: preview.correctAnswerBoolean ?? true,
          explanation: (preview.explanation ?? '').trim(),
        },
        difficulty,
        isApprovedByTeacher,
      },
    }
  }

  if (type === 'FILL_BLANK') {
    const sentence = (preview.sentence ?? preview.question).trim()
    if (!sentence || !sentence.includes('___')) return { error: 'El enunciado debe incluir ___' }
    const correct = (preview.correctAnswerText ?? '').trim()
    if (!correct) return { error: 'Falta la respuesta correcta' }
    let acc = (preview.acceptableAnswers ?? []).map((s) => s.trim()).filter(Boolean).slice(0, 3)
    if (acc.length < 1) acc = [correct]
    return {
      payload: {
        type: 'FILL_BLANK',
        options: {
          sentence,
          correctAnswer: correct,
          acceptableAnswers: acc,
          explanation: (preview.explanation ?? '').trim(),
        },
        difficulty,
        isApprovedByTeacher,
      },
    }
  }

  if (type === 'MATCH') {
    if (!preview.question.trim() || !preview.pairs?.length) return { error: 'Faltan instrucciones o pares' }
    return {
      payload: {
        type: 'MATCH',
        options: {
          instructions: preview.question.trim(),
          pairs: preview.pairs.map((p) => ({
            left: p.left.trim(),
            right: p.right.trim(),
          })),
          explanation: preview.explanation?.trim() || undefined,
        },
        difficulty,
        isApprovedByTeacher,
      },
    }
  }

  return { error: 'No se pudo construir la actividad' }
}
