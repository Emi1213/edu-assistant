<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Plus, Sparkles, Loader2, X, ClipboardList, Pencil, Trash2, CheckCircle2 } from 'lucide-vue-next'
import { useLearningObject } from '@/features/pages/composables/queries/use-page'
import { useActivities } from '@/features/activities/composables/queries/use-activities'
import { useCreateActivity } from '@/features/activities/composables/mutations/use-create-activity'
import { useUpdateActivity } from '@/features/activities/composables/mutations/use-update-activity'
import { useDeleteActivity } from '@/features/activities/composables/mutations/use-delete-activity'
import { useCreateActivityAttempt } from '@/features/activities/composables/mutations/use-create-activity-attempt'
import { useGenerateActivity } from '@/features/content-generation/composables/mutations/use-generate-activity'
import { useRoles } from '@/features/auth/composables/use-roles'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
import type {
  ActivityType,
  Activity,
  ActivityOptionsByType,
  CreateActivityPayload,
  CreateActivityAttemptPayload,
  UpdateActivityPayload,
  MultipleChoiceActivityOptions,
  TrueFalseActivityOptions,
  FillBlankActivityOptions,
  MatchActivityOptions,
  ActivityAttemptResponse,
} from '@/features/activities/types'
import type { ActivityType as GenActivityType } from '@/features/content-generation/types'
import { LANGUAGE_OPTIONS } from '@/features/modules/constants/modules.constants'
import { getActivityTypeLabel, getDefaultOptionsForType } from '@/features/activities/constants/activity.constants'
import { getOptionsAndCorrectAnswer, toEditOptionsShape, buildUpdatePayloadFromEditForm } from '@/features/activities/utils/activity-payload.utils'
import { useToast } from '@/shared/composables/use-toast'

const route = useRoute()
const router = useRouter()
const learningObjectId = computed(() => Number(route.params.learningObjectId))
const moduleId = computed(() => Number(route.params.id))

const { data: learningObject, isLoading: isLoadingLearningObject } = useLearningObject(learningObjectId.value)
const { data: activitiesData, isLoading: isLoadingActivities, refetch: refetchActivities } = useActivities(learningObjectId.value)
const { canEdit, isStudent } = useRoles()
const toast = useToast()

const { mutate: updateActivity, isPending: isUpdating } = useUpdateActivity(learningObjectId.value)
const { mutate: deleteActivity, isPending: isDeleting } = useDeleteActivity(learningObjectId.value)
const { mutate: createAttempt, isPending: isSubmittingAttempt } = useCreateActivityAttempt()

const activities = computed(() => activitiesData.value ?? [])

const goBackToPage = () => {
  router.push(`/modules/${moduleId.value}/learning-objects/${learningObjectId.value}`)
}

const showCreateModal = ref(false)
const createForm = ref<CreateActivityPayload>({
  type: 'MULTIPLE_CHOICE',
  question: '',
  options: { options: ['', '', '', ''], correctAnswer: 0 } as MultipleChoiceActivityOptions,
  difficulty: 2,
  isApprovedByTeacher: false,
})
const { mutate: createActivity, isPending: isCreating } = useCreateActivity(learningObjectId.value)

function openCreateModal() {
  createForm.value = {
    type: 'MULTIPLE_CHOICE',
    question: '',
    options: getDefaultOptionsForType('MULTIPLE_CHOICE'),
    difficulty: 2,
    isApprovedByTeacher: false,
  }
  showCreateModal.value = true
}

function closeCreateModal() {
  showCreateModal.value = false
}

function submitCreateActivity() {
  const form = createForm.value
  if (!form.question.trim()) {
    toast.error('Escribe la pregunta')
    return
  }
  if (form.type === 'MULTIPLE_CHOICE' && form.options && 'options' in form.options) {
    const opts = (form.options as MultipleChoiceActivityOptions).options.filter(Boolean)
    if (opts.length < 2) {
      toast.error('Añade al menos dos opciones')
      return
    }
    createActivity(
      {
        ...form,
        options: { options: opts, correctAnswer: (form.options as MultipleChoiceActivityOptions).correctAnswer },
      },
      {
        onSuccess: () => { toast.success('Actividad creada'); closeCreateModal() },
        onError: (err: Error) => { toast.error(err.message || 'Error al crear la actividad') },
      }
    )
    return
  }
  if (form.type === 'TRUE_FALSE' && form.options && 'correctAnswer' in form.options) {
    createActivity(
      {
        type: 'TRUE_FALSE',
        question: form.question.trim(),
        options: { correctAnswer: (form.options as TrueFalseActivityOptions).correctAnswer },
        difficulty: form.difficulty,
        isApprovedByTeacher: form.isApprovedByTeacher,
      },
      {
        onSuccess: () => { toast.success('Actividad creada'); closeCreateModal() },
        onError: (err: Error) => { toast.error(err.message || 'Error al crear la actividad') },
      }
    )
    return
  }
  if (form.type === 'FILL_BLANK' || form.type === 'MATCH') {
    createActivity(
      {
        type: form.type,
        question: form.question.trim(),
        options: form.options as FillBlankActivityOptions | MatchActivityOptions,
        explanation: form.explanation,
        difficulty: form.difficulty,
        isApprovedByTeacher: form.isApprovedByTeacher,
      },
      {
        onSuccess: () => { toast.success('Actividad creada'); closeCreateModal() },
        onError: (err: Error) => { toast.error(err.message || 'Error al crear la actividad') },
      }
    )
    return
  }
  createActivity(
    {
      type: form.type,
      question: form.question.trim(),
      options: form.options,
      explanation: form.explanation,
      difficulty: form.difficulty,
      isApprovedByTeacher: form.isApprovedByTeacher,
    },
    {
      onSuccess: () => { toast.success('Actividad creada'); closeCreateModal() },
      onError: (err: Error) => { toast.error(err.message || 'Error al crear la actividad') },
    }
  )
}

const showGenerateModal = ref(false)
const generateForm = ref({
  type: 'MULTIPLE_CHOICE' as GenActivityType,
  language: 'es',
  difficulty: 2,
  instructions: '',
})

const generatedPreview = ref<{
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
} | null>(null)
const { mutate: generateActivity, isPending: isGeneratingActivity } = useGenerateActivity()

function openGenerateModal() {
  generateForm.value = { type: 'MULTIPLE_CHOICE' as GenActivityType, language: 'es', difficulty: 2, instructions: '' }
  generatedPreview.value = null
  showGenerateModal.value = true
}

function closeGenerateModal() {
  showGenerateModal.value = false
  generatedPreview.value = null
}

function discardGeneratedPreview() {
  generatedPreview.value = null
  toast.info('Vista previa descartada. Puedes generar otra.')
}

function mapApiActivityToPreview(activity: Record<string, unknown>, requestedType: string): typeof generatedPreview.value {
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
      ? (activity.pairs as Array<{ left?: string; right?: string }>).map((p) => ({
          left: typeof p?.left === 'string' ? p.left : '',
          right: typeof p?.right === 'string' ? p.right : '',
        })).filter((p) => p.left || p.right)
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
  const options = Array.isArray(activity.options) ? (activity.options as string[]).filter((s): s is string => typeof s === 'string') : []
  return {
    type: 'MULTIPLE_CHOICE',
    question,
    options: options.length >= 2 ? options : undefined,
    correctAnswer: typeof activity.correctAnswer === 'number' ? activity.correctAnswer : undefined,
    explanation: typeof activity.explanation === 'string' ? activity.explanation : undefined,
  }
}

function handleGenerateActivity() {
  if (!learningObject.value) return
  generateActivity(
    {
      learningObjectId: learningObject.value.id,
      type: generateForm.value.type,
      language: generateForm.value.language,
      difficulty: generateForm.value.difficulty,
      instructions: generateForm.value.instructions || undefined,
    },
    {
      onSuccess: (data: unknown) => {
        const raw = data && typeof data === 'object' && 'activity' in data ? (data as { activity: unknown }).activity : data
        const one = Array.isArray(raw) ? raw[0] : raw
        const activity = one && typeof one === 'object' && one !== null ? (one as Record<string, unknown>) : null
        if (activity) {
          const preview = mapApiActivityToPreview(activity, generateForm.value.type)
          if (preview) {
            generatedPreview.value = preview
            toast.success('Vista previa lista. Revisa y guarda o descarta.')
          } else {
            toast.warning('La respuesta no tiene el formato esperado para este tipo.')
          }
        } else {
          toast.success('Actividad generada.')
          refetchActivities()
          closeGenerateModal()
        }
      },
      onError: (err: Error) => {
        toast.error(err.message || 'Error al generar la actividad')
      },
    }
  )
}

function saveGeneratedPreview() {
  const preview = generatedPreview.value
  if (!preview?.question.trim()) return
  const type = (generateForm.value.type || preview.type || 'MULTIPLE_CHOICE') as ActivityType
  const payload: CreateActivityPayload = {
    type,
    question: preview.question.trim(),
    difficulty: generateForm.value.difficulty,
    isApprovedByTeacher: false,
  }
  if (preview.explanation) payload.explanation = preview.explanation

  if (type === 'MULTIPLE_CHOICE' && preview.options && preview.options.length >= 2 && typeof preview.correctAnswer === 'number') {
    payload.options = { options: preview.options, correctAnswer: preview.correctAnswer }
  } else if (type === 'TRUE_FALSE') {
    payload.options = { correctAnswer: preview.correctAnswerBoolean ?? true }
  } else if (type === 'FILL_BLANK') {
    const correctAnswers = [
      ...(preview.correctAnswerText ? [preview.correctAnswerText] : []),
      ...(preview.acceptableAnswers || []),
    ].filter(Boolean)
    if (correctAnswers.length) payload.options = { correctAnswers }
  } else if (type === 'MATCH' && preview.pairs && preview.pairs.length > 0) {
    payload.options = {
      leftItems: preview.pairs.map((p) => p.left).filter(Boolean),
      rightItems: preview.pairs.map((p) => p.right).filter(Boolean),
    }
  }

  createActivity(payload, {
    onSuccess: () => {
      toast.success('Actividad guardada.')
      generatedPreview.value = null
      refetchActivities()
      closeGenerateModal()
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Error al guardar la actividad')
    },
  })
}

const showEditModal = ref(false)
const activityToEdit = ref<Activity | null>(null)
type EditFormShape = {
  activityId?: number
  type: ActivityType
  question: string
  options: ActivityOptionsByType
  explanation?: string
  difficulty: number
  isApprovedByTeacher: boolean
  usedAsExample: boolean
}
const editForm = ref<EditFormShape>({
  type: 'MULTIPLE_CHOICE',
  question: '',
  options: { options: ['', '', '', ''], correctAnswer: 0 },
  difficulty: 2,
  isApprovedByTeacher: false,
  usedAsExample: false,
})

function openEditModal(act: Activity) {
  activityToEdit.value = act
  const { options } = getOptionsAndCorrectAnswer(act)
  editForm.value = {
    activityId: act.id,
    type: act.type,
    question: act.question,
    options: toEditOptionsShape(act.type, options),
    explanation: typeof act.explanation === 'string' ? act.explanation : '',
    difficulty: act.difficulty,
    isApprovedByTeacher: act.isApprovedByTeacher,
    usedAsExample: act.usedAsExample,
  }
  showEditModal.value = true
}

function closeEditModal() {
  showEditModal.value = false
  activityToEdit.value = null
}

function submitUpdateActivity() {
  const id = editForm.value.activityId
  if (id == null || !learningObject.value) return
  const { options } = buildUpdatePayloadFromEditForm(editForm.value)
  const payload: UpdateActivityPayload = {
    type: editForm.value.type,
    question: editForm.value.question?.trim(),
    options,
    explanation: editForm.value.explanation,
    difficulty: editForm.value.difficulty,
    isApprovedByTeacher: editForm.value.isApprovedByTeacher,
    usedAsExample: editForm.value.usedAsExample,
  }
  updateActivity(
    { activityId: id, payload },
    {
      onSuccess: () => {
        toast.success('Actividad actualizada.')
        closeEditModal()
        refetchActivities()
      },
      onError: (err: Error) => toast.error(err.message || 'Error al actualizar'),
    }
  )
}

const activityToDelete = ref<Activity | null>(null)

function confirmDelete(act: Activity) {
  activityToDelete.value = act
}

function closeDeleteConfirm() {
  activityToDelete.value = null
}

function doDeleteActivity() {
  const act = activityToDelete.value
  if (!act || !learningObject.value) return
  deleteActivity(act.id, {
    onSuccess: () => {
      toast.success('Actividad eliminada.')
      closeDeleteConfirm()
      refetchActivities()
    },
    onError: (err: Error) => toast.error(err.message || 'Error al eliminar'),
  })
}

const activityToAttempt = ref<Activity | null>(null)
const attemptAnswer = ref<{
  selectedOption?: number
  answer?: boolean
  fillAnswer?: string
  matchPairs?: [number, number][]
}>({})
const attemptResult = ref<ActivityAttemptResponse | null>(null)

function openAttemptModal(act: Activity) {
  activityToAttempt.value = act
  attemptResult.value = null
  if (act.type === 'MULTIPLE_CHOICE') attemptAnswer.value = { selectedOption: 0 }
  else if (act.type === 'TRUE_FALSE') attemptAnswer.value = { answer: true }
  else if (act.type === 'FILL_BLANK') attemptAnswer.value = { fillAnswer: '' }
  else if (act.type === 'MATCH') {
    const opts = act.options as MatchActivityOptions
    const n = Math.max(opts.leftItems?.length ?? 0, opts.rightItems?.length ?? 0)
    attemptAnswer.value = { matchPairs: Array.from({ length: n }, (_, i) => [i, i] as [number, number]) }
  } else attemptAnswer.value = {}
  showAttemptModal.value = true
}

const showAttemptModal = ref(false)

function closeAttemptModal() {
  showAttemptModal.value = false
  activityToAttempt.value = null
  attemptResult.value = null
  attemptAnswer.value = {}
}

function submitAttempt() {
  const act = activityToAttempt.value
  if (!act || !learningObject.value) return
  let studentAnswer: CreateActivityAttemptPayload['studentAnswer']
  if (act.type === 'MULTIPLE_CHOICE' && typeof attemptAnswer.value.selectedOption === 'number') {
    studentAnswer = { selectedOption: attemptAnswer.value.selectedOption }
  } else if (act.type === 'TRUE_FALSE' && typeof attemptAnswer.value.answer === 'boolean') {
    studentAnswer = { answer: attemptAnswer.value.answer }
  } else if (act.type === 'FILL_BLANK' && attemptAnswer.value.fillAnswer != null) {
    studentAnswer = { answer: attemptAnswer.value.fillAnswer }
  } else if (act.type === 'MATCH' && attemptAnswer.value.matchPairs) {
    studentAnswer = { matches: attemptAnswer.value.matchPairs }
  } else {
    toast.error('Completa tu respuesta.')
    return
  }
  createAttempt(
    { activityId: act.id, payload: { studentAnswer } },
    {
      onSuccess: (data) => {
        if (data) attemptResult.value = data
        toast.success(data?.isCorrect ? '¡Correcto!' : 'Incorrecto. Revisa la explicación.')
      },
      onError: (err: Error) => toast.error(err.message || 'Error al enviar'),
    }
  )
}
</script>

<template>
  <div class="space-y-6 pt-4 sm:pt-8 pb-8 sm:pb-12 min-w-0">
    <div class="flex items-center justify-between">
      <button
        @click="goBackToPage"
        class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-all w-full sm:w-auto"
      >
        <ArrowLeft class="size-4 shrink-0" />
        <span>Volver al objeto de aprendizaje</span>
      </button>
    </div>

    <div v-if="isLoadingLearningObject" class="space-y-4">
      <Skeleton class="h-10 w-3/4" />
      <Skeleton class="h-32 w-full" />
    </div>

    <template v-else-if="learningObject">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 min-w-0">
        <h1 class="text-xl sm:text-2xl font-bold flex items-center gap-2 break-words">
          <ClipboardList class="size-6 sm:size-7 text-primary shrink-0" />
          Actividades
        </h1>
        <p class="text-sm text-muted-foreground truncate sm:max-w-xs">{{ learningObject.title }}</p>
      </div>

      <div v-if="canEdit()" class="flex flex-wrap gap-2 sm:gap-3">
        <Button @click="openCreateModal" class="gap-2">
          <Plus class="size-4" />
          Crear actividad 
        </Button>
        <Button variant="outline" @click="openGenerateModal" class="gap-2" :disabled="isGeneratingActivity">
          <Loader2 v-if="isGeneratingActivity" class="size-4 animate-spin" />
          <Sparkles v-else class="size-4" />
          {{ isGeneratingActivity ? 'Generando...' : 'Generar con IA' }}
        </Button>
      </div>

      <div v-if="isLoadingActivities" class="py-8">
        <Skeleton class="h-24 w-full mb-3" />
        <Skeleton class="h-24 w-full mb-3" />
        <Skeleton class="h-24 w-full" />
      </div>
      <div v-else-if="activities.length === 0" class="py-12 text-center rounded-lg border border-dashed border-border text-muted-foreground">
        <ClipboardList class="size-12 mx-auto mb-3 opacity-50" />
        <p>No hay actividades aún.</p>
        <p v-if="canEdit()" class="text-sm mt-1">Crea una manualmente o genera una con IA.</p>
      </div>
      <ul v-else class="space-y-4 min-w-0">
        <li
          v-for="act in activities"
          :key="act.id"
          class="p-4 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors min-w-0"
        >
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div class="min-w-0 flex-1">
              <span class="text-xs font-medium text-muted-foreground">{{ getActivityTypeLabel(act.type) }} · Dificultad {{ act.difficulty }}</span>
              <p class="mt-1 font-medium text-foreground">{{ act.question }}</p>
              <div v-if="act.options && 'options' in act.options && Array.isArray((act.options as { options: string[] }).options)" class="mt-2 text-sm text-muted-foreground">
                <span v-for="(opt, i) in (act.options as { options: string[] }).options" :key="i" :class="{ 'text-primary font-medium': i === act.selectedOption }">
                  {{ i + 1 }}. {{ opt }}
                </span>
              </div>
              <div v-else-if="act.options && 'correctAnswer' in act.options" class="mt-2 text-sm text-muted-foreground">
                Respuesta correcta: {{ (act.options as { correctAnswer: boolean }).correctAnswer ? 'Verdadero' : 'Falso' }}
              </div>
            </div>
            <div class="flex flex-wrap items-center gap-2 shrink-0">
              <template v-if="canEdit()">
                <Button type="button" variant="ghost" size="sm" class="gap-1" :disabled="isUpdating" @click="openEditModal(act)">
                  <Pencil class="size-4" />
                  Editar
                </Button>
                <Button type="button" variant="ghost" size="sm" class="gap-1 text-destructive hover:text-destructive" :disabled="isDeleting" @click="confirmDelete(act)">
                  <Trash2 class="size-4" />
                  Eliminar
                </Button>
              </template>
              <Button v-else-if="isStudent" type="button" variant="outline" size="sm" class="gap-1 w-full sm:w-auto" @click="openAttemptModal(act)">
                <CheckCircle2 class="size-4" />
                Realizar
              </Button>
            </div>
          </div>
        </li>
      </ul>
    </template>

    <div v-else class="rounded-md bg-card px-6 py-12 text-center">
      <p class="text-muted-foreground">Objeto de aprendizaje no encontrado</p>
    </div>

    <Teleport to="body">
      <div
        v-if="showCreateModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click.self="closeCreateModal"
      >
        <div class="bg-card rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold">Crear actividad</h2>
            <button type="button" class="text-muted-foreground hover:text-foreground" @click="closeCreateModal">
              <X class="size-5" />
            </button>
          </div>
          <form class="space-y-4" @submit.prevent="submitCreateActivity">
            <div class="space-y-2">
              <Label>Tipo</Label>
              <select
                v-model="createForm.type"
                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                @change="createForm.options = getDefaultOptionsForType(createForm.type)"
              >
                <option value="MULTIPLE_CHOICE">Opción múltiple</option>
                <option value="TRUE_FALSE">Verdadero / Falso</option>
                <option value="FILL_BLANK">Completar espacios</option>
                <option value="MATCH">Emparejar</option>
              </select>
            </div>
            <div class="space-y-2">
              <Label>Pregunta / Enunciado</Label>
              <textarea
                v-model="createForm.question"
                rows="2"
                class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                placeholder="Ej: ¿La respiración celular ocurre en las mitocondrias?"
              />
            </div>
            <template v-if="createForm.type === 'MULTIPLE_CHOICE' && createForm.options && 'options' in createForm.options">
              <div class="space-y-2">
                <Label>Opciones (indica cuál es la correcta abajo)</Label>
                <div class="space-y-2">
                  <Input
                    v-for="(_, i) in (createForm.options as MultipleChoiceActivityOptions).options"
                    :key="i"
                    v-model="(createForm.options as MultipleChoiceActivityOptions).options[i]"
                    :placeholder="`Opción ${i + 1}`"
                  />
                </div>
                <div class="flex items-center gap-2 mt-2">
                  <Label class="text-sm">Correcta:</Label>
                  <select
                    v-model.number="(createForm.options as MultipleChoiceActivityOptions).correctAnswer"
                    class="flex h-9 rounded-md border border-input bg-transparent px-2 text-sm"
                  >
                    <option v-for="(_, i) in (createForm.options as MultipleChoiceActivityOptions).options" :key="i" :value="i">{{ i + 1 }}</option>
                  </select>
                </div>
              </div>
            </template>
            <template v-else-if="createForm.type === 'TRUE_FALSE' && createForm.options && 'correctAnswer' in createForm.options">
              <div class="space-y-2">
                <Label>Respuesta correcta</Label>
                <div class="flex gap-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" :value="true" v-model="(createForm.options as TrueFalseActivityOptions).correctAnswer" />
                    <span>Verdadero</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" :value="false" v-model="(createForm.options as TrueFalseActivityOptions).correctAnswer" />
                    <span>Falso</span>
                  </label>
                </div>
              </div>
            </template>
            <template v-else-if="createForm.type === 'FILL_BLANK' && createForm.options">
              <div class="space-y-2">
                <Label>Respuestas correctas (una por línea o separadas por coma)</Label>
                <textarea
                  :value="(createForm.options as FillBlankActivityOptions).correctAnswers?.join('\n') ?? ''"
                  @input="(e: Event) => { const o = createForm.options as FillBlankActivityOptions; if (!o.correctAnswers) o.correctAnswers = []; o.correctAnswers = (e.target as HTMLTextAreaElement).value.split(/[\n,]/).map(s => s.trim()).filter(Boolean) }"
                  rows="3"
                  class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  placeholder="respuesta1&#10;respuesta2"
                />
              </div>
            </template>
            <template v-else-if="createForm.type === 'MATCH' && createForm.options">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label>Columna izquierda (una por línea)</Label>
                  <textarea
                    :value="(createForm.options as MatchActivityOptions).leftItems?.join('\n') ?? ''"
                    @input="(e: Event) => { const o = createForm.options as MatchActivityOptions; o.leftItems = (e.target as HTMLTextAreaElement).value.split('\n').map(s => s.trim()).filter(Boolean) }"
                    rows="4"
                    class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  />
                </div>
                <div class="space-y-2">
                  <Label>Columna derecha (una por línea, mismo orden correcto)</Label>
                  <textarea
                    :value="(createForm.options as MatchActivityOptions).rightItems?.join('\n') ?? ''"
                    @input="(e: Event) => { const o = createForm.options as MatchActivityOptions; o.rightItems = (e.target as HTMLTextAreaElement).value.split('\n').map(s => s.trim()).filter(Boolean) }"
                    rows="4"
                    class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </template>
            <div class="space-y-2">
              <Label>Explicación (opcional)</Label>
              <textarea
                v-model="createForm.explanation"
                rows="2"
                class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                placeholder="Ej: Ocurre principalmente en la mitocondria."
              />
            </div>
            <div class="space-y-2">
              <Label>Dificultad (1-5)</Label>
              <Input v-model.number="createForm.difficulty" type="number" min="1" max="5" />
            </div>
            <div class="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" @click="closeCreateModal">Cancelar</Button>
              <Button type="submit" :disabled="isCreating">{{ isCreating ? 'Creando...' : 'Crear' }}</Button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal generar con IA -->
    <Teleport to="body">
      <div
        v-if="showGenerateModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click.self="closeGenerateModal"
      >
        <div class="bg-card rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold flex items-center gap-2">
              <Sparkles class="size-5 text-primary" />
              {{ generatedPreview ? 'Vista previa de la actividad' : 'Generar actividad con IA' }}
            </h2>
            <button type="button" class="text-muted-foreground hover:text-foreground" :disabled="isGeneratingActivity" @click="closeGenerateModal">
              <X class="size-5" />
            </button>
          </div>

          <!-- Vista previa por tipo: opción múltiple, V/F, completar, emparejar -->
          <div v-if="generatedPreview" class="space-y-4">
            <div class="p-4 rounded-lg border border-border bg-muted/30 space-y-3">
              <p class="text-sm font-medium text-muted-foreground">
                {{ generatedPreview.type === 'MULTIPLE_CHOICE' ? 'Pregunta' : generatedPreview.type === 'TRUE_FALSE' ? 'Afirmación' : generatedPreview.type === 'FILL_BLANK' ? 'Enunciado' : 'Instrucciones' }}
              </p>
              <p class="text-foreground">{{ generatedPreview.question }}</p>

              <!-- Opción múltiple -->
              <div v-if="generatedPreview.type === 'MULTIPLE_CHOICE' && generatedPreview.options?.length" class="mt-3">
                <p class="text-sm font-medium text-muted-foreground mb-2">Opciones</p>
                <ul class="space-y-2">
                  <li
                    v-for="(opt, i) in generatedPreview.options"
                    :key="i"
                    class="pl-3 py-1.5 rounded-md text-sm"
                    :class="i === generatedPreview.correctAnswer ? 'bg-primary/15 text-primary font-medium border border-primary/30' : 'bg-background border border-border'"
                  >
                    <span class="text-muted-foreground mr-2">{{ String.fromCharCode(65 + i) }}.</span>
                    {{ opt }}
                    <span v-if="i === generatedPreview.correctAnswer" class="ml-2 text-xs">(correcta)</span>
                  </li>
                </ul>
              </div>

              <!-- Verdadero / Falso -->
              <div v-if="generatedPreview.type === 'TRUE_FALSE'" class="mt-3">
                <p class="text-sm font-medium text-muted-foreground">Respuesta correcta</p>
                <p class="text-foreground font-medium">{{ generatedPreview.correctAnswerBoolean ? 'Verdadero' : 'Falso' }}</p>
              </div>

              <!-- Completar espacios -->
              <div v-if="generatedPreview.type === 'FILL_BLANK'" class="mt-3 space-y-2">
                <div v-if="generatedPreview.correctAnswerText">
                  <p class="text-sm font-medium text-muted-foreground">Respuesta correcta</p>
                  <p class="text-foreground">{{ generatedPreview.correctAnswerText }}</p>
                </div>
                <div v-if="generatedPreview.acceptableAnswers?.length">
                  <p class="text-sm font-medium text-muted-foreground">Otras aceptables</p>
                  <p class="text-sm text-foreground">{{ generatedPreview.acceptableAnswers.join(', ') }}</p>
                </div>
              </div>

              <!-- Emparejar -->
              <div v-if="generatedPreview.type === 'MATCH' && generatedPreview.pairs?.length" class="mt-3">
                <p class="text-sm font-medium text-muted-foreground mb-2">Parejas</p>
                <ul class="space-y-1.5 text-sm">
                  <li
                    v-for="(pair, idx) in generatedPreview.pairs"
                    :key="idx"
                    class="flex items-center gap-2 py-1"
                  >
                    <span class="text-foreground font-medium">{{ pair.left }}</span>
                    <span class="text-muted-foreground">→</span>
                    <span class="text-foreground">{{ pair.right }}</span>
                  </li>
                </ul>
              </div>

              <div v-if="generatedPreview.explanation" class="mt-3 pt-3 border-t border-border">
                <p class="text-sm font-medium text-muted-foreground mb-1">Explicación</p>
                <p class="text-sm text-foreground">{{ generatedPreview.explanation }}</p>
              </div>
            </div>
            <div class="flex flex-wrap gap-2 justify-end">
              <Button type="button" variant="outline" @click="discardGeneratedPreview">
                Descartar
              </Button>
              <Button :disabled="isCreating" @click="saveGeneratedPreview">
                <Loader2 v-if="isCreating" class="size-4 animate-spin mr-2" />
                Guardar actividad
              </Button>
            </div>
          </div>

          <!-- Formulario para generar -->
          <div v-else class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label>Tipo</Label>
                <select v-model="generateForm.type" class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                  <option value="MULTIPLE_CHOICE">Opción múltiple</option>
                  <option value="TRUE_FALSE">Verdadero / Falso</option>
                  <option value="FILL_BLANK">Completar espacios</option>
                  <option value="MATCH">Emparejar</option>
                </select>
              </div>
              <div class="space-y-2">
                <Label>Dificultad (1-5)</Label>
                <Input v-model.number="generateForm.difficulty" type="number" min="1" max="5" />
              </div>
            </div>
            <div class="space-y-2">
              <Label>Idioma</Label>
              <select
                v-model="generateForm.language"
                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <option
                  v-for="opt in LANGUAGE_OPTIONS"
                  :key="opt.value"
                  :value="opt.value"
                >
                  {{ opt.label }}
                </option>
              </select>
            </div>
            <div class="space-y-2">
              <Label>Instrucciones (opcional)</Label>
              <textarea
                v-model="generateForm.instructions"
                rows="2"
                class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                placeholder="Ej: Que sea sobre el ejemplo de código del final."
              />
            </div>
            <div class="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" :disabled="isGeneratingActivity" @click="closeGenerateModal">Cancelar</Button>
              <Button :disabled="isGeneratingActivity" @click="handleGenerateActivity">
                <Loader2 v-if="isGeneratingActivity" class="size-4 animate-spin mr-2" />
                {{ isGeneratingActivity ? 'Generando...' : 'Generar' }}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal editar actividad (solo profesor): mismo formulario que crear por tipo -->
    <Teleport to="body">
      <div
        v-if="showEditModal && activityToEdit"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click.self="closeEditModal"
      >
        <div class="bg-card rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold">Editar actividad</h2>
            <button type="button" class="text-muted-foreground hover:text-foreground" :disabled="isUpdating" @click="closeEditModal">
              <X class="size-5" />
            </button>
          </div>
          <form class="space-y-4" @submit.prevent="submitUpdateActivity">
            <div class="space-y-2">
              <Label>Tipo</Label>
              <select
                v-model="editForm.type"
                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                @change="editForm.options = getDefaultOptionsForType(editForm.type)"
              >
                <option value="MULTIPLE_CHOICE">Opción múltiple</option>
                <option value="TRUE_FALSE">Verdadero / Falso</option>
                <option value="FILL_BLANK">Completar espacios</option>
                <option value="MATCH">Emparejar</option>
              </select>
            </div>
            <div class="space-y-2">
              <Label>Pregunta / Enunciado</Label>
              <textarea
                v-model="editForm.question"
                rows="2"
                class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                placeholder="Ej: ¿La respiración celular ocurre en las mitocondrias?"
              />
            </div>
            <template v-if="editForm.type === 'MULTIPLE_CHOICE' && editForm.options && 'options' in editForm.options">
              <div class="space-y-2">
                <Label>Opciones (indica cuál es la correcta abajo)</Label>
                <div class="space-y-2">
                  <Input
                    v-for="(_, i) in (editForm.options as MultipleChoiceActivityOptions).options"
                    :key="i"
                    v-model="(editForm.options as MultipleChoiceActivityOptions).options[i]"
                    :placeholder="`Opción ${i + 1}`"
                  />
                </div>
                <div class="flex items-center gap-2 mt-2">
                  <Label class="text-sm">Correcta:</Label>
                  <select
                    v-model.number="(editForm.options as MultipleChoiceActivityOptions).correctAnswer"
                    class="flex h-9 rounded-md border border-input bg-transparent px-2 text-sm"
                  >
                    <option v-for="(_, i) in (editForm.options as MultipleChoiceActivityOptions).options" :key="i" :value="i">{{ i + 1 }}</option>
                  </select>
                </div>
              </div>
            </template>
            <template v-else-if="editForm.type === 'TRUE_FALSE' && editForm.options && 'correctAnswer' in editForm.options">
              <div class="space-y-2">
                <Label>Respuesta correcta</Label>
                <div class="flex gap-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" :value="true" v-model="(editForm.options as TrueFalseActivityOptions).correctAnswer" />
                    <span>Verdadero</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" :value="false" v-model="(editForm.options as TrueFalseActivityOptions).correctAnswer" />
                    <span>Falso</span>
                  </label>
                </div>
              </div>
            </template>
            <template v-else-if="editForm.type === 'FILL_BLANK' && editForm.options">
              <div class="space-y-2">
                <Label>Respuestas correctas (una por línea o separadas por coma)</Label>
                <textarea
                  :value="(editForm.options as FillBlankActivityOptions).correctAnswers?.join('\n') ?? ''"
                  @input="(e: Event) => { const o = editForm.options as FillBlankActivityOptions; if (!o.correctAnswers) o.correctAnswers = []; o.correctAnswers = (e.target as HTMLTextAreaElement).value.split(/[\n,]/).map(s => s.trim()).filter(Boolean) }"
                  rows="3"
                  class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  placeholder="respuesta1&#10;respuesta2"
                />
              </div>
            </template>
            <template v-else-if="editForm.type === 'MATCH' && editForm.options">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label>Columna izquierda (una por línea)</Label>
                  <textarea
                    :value="(editForm.options as MatchActivityOptions).leftItems?.join('\n') ?? ''"
                    @input="(e: Event) => { const o = editForm.options as MatchActivityOptions; o.leftItems = (e.target as HTMLTextAreaElement).value.split('\n').map(s => s.trim()).filter(Boolean) }"
                    rows="4"
                    class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  />
                </div>
                <div class="space-y-2">
                  <Label>Columna derecha (una por línea, mismo orden correcto)</Label>
                  <textarea
                    :value="(editForm.options as MatchActivityOptions).rightItems?.join('\n') ?? ''"
                    @input="(e: Event) => { const o = editForm.options as MatchActivityOptions; o.rightItems = (e.target as HTMLTextAreaElement).value.split('\n').map(s => s.trim()).filter(Boolean) }"
                    rows="4"
                    class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </template>
            <div class="space-y-2">
              <Label>Explicación (opcional)</Label>
              <textarea
                v-model="editForm.explanation"
                rows="2"
                class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                placeholder="Ej: Ocurre principalmente en la mitocondria."
              />
            </div>
            <div class="space-y-2">
              <Label>Dificultad (1-5)</Label>
              <Input v-model.number="editForm.difficulty" type="number" min="1" max="5" />
            </div>
            <div class="flex items-center gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="editForm.isApprovedByTeacher" type="checkbox" class="rounded border-input" />
                <span class="text-sm">Aprobada por profesor</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="editForm.usedAsExample" type="checkbox" class="rounded border-input" />
                <span class="text-sm">Usar como ejemplo</span>
              </label>
            </div>
            <div class="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" :disabled="isUpdating" @click="closeEditModal">Cancelar</Button>
              <Button type="submit" :disabled="isUpdating">
                <Loader2 v-if="isUpdating" class="size-4 animate-spin mr-2" />
                Guardar cambios
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Confirmar eliminar actividad -->
    <Teleport to="body">
      <div
        v-if="activityToDelete"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click.self="closeDeleteConfirm"
      >
        <div class="bg-card rounded-xl shadow-2xl w-full max-w-sm mx-4 p-4 sm:p-6">
          <h2 class="text-lg font-bold mb-2">Eliminar actividad</h2>
          <p class="text-muted-foreground text-sm mb-4">¿Eliminar esta actividad? Esta acción no se puede deshacer.</p>
          <div class="flex justify-end gap-2">
            <Button type="button" variant="outline" :disabled="isDeleting" @click="closeDeleteConfirm">Cancelar</Button>
            <Button variant="destructive" :disabled="isDeleting" @click="doDeleteActivity">
              <Loader2 v-if="isDeleting" class="size-4 animate-spin mr-2" />
              Eliminar
            </Button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal realizar actividad (estudiantes) -->
    <Teleport to="body">
      <div
        v-if="showAttemptModal && activityToAttempt"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click.self="closeAttemptModal"
      >
        <div
          class="bg-card rounded-xl shadow-2xl w-full mx-4 max-h-[90vh] overflow-y-auto p-4 sm:p-6"
          :class="activityToAttempt?.type === 'MATCH' ? 'max-w-4xl' : 'max-w-lg'"
        >
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold">Realizar actividad</h2>
            <button type="button" class="text-muted-foreground hover:text-foreground" :disabled="isSubmittingAttempt" @click="closeAttemptModal">
              <X class="size-5" />
            </button>
          </div>
          <p class="text-sm text-muted-foreground mb-2">{{ getActivityTypeLabel(activityToAttempt.type) }}</p>
          <p class="font-medium text-foreground mb-4">{{ activityToAttempt.question }}</p>

          <div v-if="!attemptResult" class="space-y-4">
            <!-- Opción múltiple -->
            <div v-if="activityToAttempt.type === 'MULTIPLE_CHOICE' && activityToAttempt.options && 'options' in activityToAttempt.options" class="space-y-2">
              <Label>Elige una opción</Label>
              <ul class="space-y-2">
                <li
                  v-for="(opt, i) in (activityToAttempt.options as MultipleChoiceActivityOptions).options"
                  :key="i"
                  class="flex items-center gap-2"
                >
                  <input
                    :id="`opt-${activityToAttempt.id}-${i}`"
                    v-model="attemptAnswer.selectedOption"
                    type="radio"
                    :value="i"
                    name="mc-option"
                  />
                  <label :for="`opt-${activityToAttempt.id}-${i}`" class="cursor-pointer text-sm">{{ opt }}</label>
                </li>
              </ul>
            </div>
            <!-- Verdadero / Falso -->
            <div v-else-if="activityToAttempt.type === 'TRUE_FALSE'" class="space-y-2">
              <Label>Verdadero o Falso</Label>
              <div class="flex gap-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input v-model="attemptAnswer.answer" type="radio" :value="true" name="tf-option" />
                  <span>Verdadero</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input v-model="attemptAnswer.answer" type="radio" :value="false" name="tf-option" />
                  <span>Falso</span>
                </label>
              </div>
            </div>
            <!-- Completar espacio -->
            <div v-else-if="activityToAttempt.type === 'FILL_BLANK'" class="space-y-2">
              <Label>Tu respuesta</Label>
              <Input v-model="attemptAnswer.fillAnswer" placeholder="Escribe la palabra o frase" />
            </div>
            <!-- Emparejar: lista izquierda → select derecha; matchPairs[idx] = [leftIdx, rightIdx] -->
            <div v-else-if="activityToAttempt.type === 'MATCH' && activityToAttempt.options && 'leftItems' in activityToAttempt.options" class="space-y-3">
              <Label>Empareja cada elemento</Label>
              <div
                v-for="(left, idx) in (activityToAttempt.options as MatchActivityOptions).leftItems"
                :key="idx"
                class="flex items-center gap-3 min-w-0"
              >
                <span class="text-sm font-medium min-w-0 flex-1 shrink-0 max-w-[45%] break-words">{{ left }}</span>
                <span class="text-muted-foreground shrink-0">→</span>
                <select
                  :value="(attemptAnswer.matchPairs || [])[idx]?.[1] ?? 0"
                  class="flex h-9 min-w-0 flex-1 max-w-[45%] rounded-md border border-input bg-transparent px-2 text-sm"
                  @change="(e) => {
                    const rightIdx = Number((e.target as HTMLSelectElement).value)
                    if (!attemptAnswer.matchPairs) return
                    const next = [...attemptAnswer.matchPairs]
                    next[idx] = [idx, rightIdx]
                    attemptAnswer.matchPairs = next
                  }"
                >
                  <option v-for="(right, ri) in (activityToAttempt.options as MatchActivityOptions).rightItems" :key="ri" :value="ri">
                    {{ right }}
                  </option>
                </select>
              </div>
            </div>

            <div class="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" :disabled="isSubmittingAttempt" @click="closeAttemptModal">Cancelar</Button>
              <Button :disabled="isSubmittingAttempt" @click="submitAttempt">
                <Loader2 v-if="isSubmittingAttempt" class="size-4 animate-spin mr-2" />
                Enviar respuesta
              </Button>
            </div>
          </div>

          <!-- Resultado del intento -->
          <div v-else-if="attemptResult" class="space-y-4">
            <div
              class="p-4 rounded-lg border"
              :class="attemptResult.isCorrect ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-destructive/10 border-destructive/30 text-destructive'"
            >
              <p class="font-medium">{{ attemptResult.isCorrect ? '¡Correcto!' : 'Incorrecto' }}</p>
              <p class="text-sm opacity-90">Intento {{ attemptResult.attemptNumber }}</p>
            </div>
            <div v-if="typeof activityToAttempt.explanation === 'string' && activityToAttempt.explanation" class="text-sm text-muted-foreground border-t pt-3">
              {{ activityToAttempt.explanation }}
            </div>
            <div class="flex justify-end">
              <Button @click="closeAttemptModal">Cerrar</Button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
