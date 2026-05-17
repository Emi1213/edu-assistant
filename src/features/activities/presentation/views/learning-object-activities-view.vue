<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Plus, Sparkles, Loader2, ClipboardList, Pencil, Trash2, CheckCircle2 } from 'lucide-vue-next'
import { useLearningObject } from '@/features/learning-objects/composables/queries/use-learning-object'
import { useActivities } from '@/features/activities/composables/queries/use-activities'
import { useCreateActivity } from '@/features/activities/composables/mutations/use-create-activity'
import { useUpdateActivity } from '@/features/activities/composables/mutations/use-update-activity'
import { useDeleteActivity } from '@/features/activities/composables/mutations/use-delete-activity'
import { useCreateActivityAttempt } from '@/features/activities/composables/mutations/use-create-activity-attempt'
import { useGenerateActivity } from '@/features/content-generation/composables/mutations/use-generate-activity'
import { useActivitiesCreateGenerate } from '@/features/activities/composables/use-activities-create-generate'
import { useActivitiesEditDelete } from '@/features/activities/composables/use-activities-edit-delete'
import { useActivitiesAttempt } from '@/features/activities/composables/use-activities-attempt'
import { useRoles } from '@/features/auth/composables/use-roles'
import { useModule } from '@/features/modules/composables/queries/use-module'
import { useAuthStore } from '@/features/auth/context/auth-store'
import ActivityCreateModal from '@/features/activities/presentation/components/activity-create-modal.vue'
import ActivityGenerateModal from '@/features/activities/presentation/components/activity-generate-modal.vue'
import ActivityEditModal from '@/features/activities/presentation/components/activity-edit-modal.vue'
import ActivityAttemptModal from '@/features/activities/presentation/components/activity-attempt-modal.vue'
import { Button } from '@/components/ui/button'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
import { LANGUAGE_OPTIONS } from '@/features/modules/constants/modules.constants'
import { MODULES_ROUTES_NAMES } from '@/features/modules/routes/modules-routes'
import { getActivityTypeLabel } from '@/features/activities/constants/activity.constants'
import { useToast } from '@/shared/composables/use-toast'

const route = useRoute()
const router = useRouter()
const learningObjectId = computed(() => Number(route.params.learningObjectId))
const moduleId = computed(() => Number(route.params.id))

const { data: learningObject, isLoading: isLoadingLearningObject } = useLearningObject(learningObjectId)
const { data: activitiesData, isLoading: isLoadingActivities, refetch: refetchActivities } = useActivities(learningObjectId.value)
const { canEdit, isStudent, isTeacher, isAdmin } = useRoles()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const toast = useToast()

const { data: module } = useModule(moduleId.value)
const isOwnerReal = computed(() => module.value?.teacherId === user.value?.id)
const isActingAsStudent = computed(() => isStudent.value || ((isTeacher.value || isAdmin.value) && !isOwnerReal.value))
const canManage = computed(() => (canEdit() && isOwnerReal.value) || isAdmin.value)

const { mutate: updateActivity, isPending: isUpdating } = useUpdateActivity(learningObjectId.value)
const { mutate: deleteActivity, isPending: isDeleting } = useDeleteActivity(learningObjectId.value)
const { mutate: createAttempt, isPending: isSubmittingAttempt } = useCreateActivityAttempt()

const activities = computed(() => activitiesData.value ?? [])

const goBackToPage = () => {
  const detailRouteName =
    route.name === MODULES_ROUTES_NAMES.PAGE_DETAIL
      ? MODULES_ROUTES_NAMES.PAGE_DETAIL
      : MODULES_ROUTES_NAMES.LEARNING_OBJECT_DETAIL
  router.push({
    name: detailRouteName,
    params: {
      id: moduleId.value,
      learningObjectId: learningObjectId.value,
    },
  })
}

const { mutate: createActivity, isPending: isCreating } = useCreateActivity(learningObjectId.value)
const { mutate: generateActivity, isPending: isGeneratingActivity } = useGenerateActivity()
const {
  showCreateModal,
  createForm,
  matchColumnLeft,
  matchColumnRight,
  openCreateModal,
  onCreateTypeChange,
  closeCreateModal,
  submitCreateActivity,
  showGenerateModal,
  generateForm,
  generatedPreview,
  openGenerateModal,
  closeGenerateModal,
  discardGeneratedPreview,
  handleGenerateActivity,
  saveGeneratedPreview,
} = useActivitiesCreateGenerate({
  learningObjectId,
  createActivity,
  generateActivity,
  toast,
  refetchActivities,
})

const {
  showEditModal,
  activityToEdit,
  editForm,
  openEditModal,
  closeEditModal,
  submitUpdateActivity,
  activityToDelete,
  confirmDelete,
  closeDeleteConfirm,
  doDeleteActivity,
} = useActivitiesEditDelete({
  updateActivity,
  deleteActivity,
  refetchActivities,
  toast,
})

const {
  activityToAttempt,
  attemptAnswer,
  attemptResult,
  showAttemptModal,
  openAttemptModal,
  closeAttemptModal,
  submitAttempt,
} = useActivitiesAttempt({
  createAttempt,
  toast,
})
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

      <div v-if="canManage" class="flex flex-wrap gap-2 sm:gap-3">
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
        <p v-if="canManage" class="text-sm mt-1">Crea una manualmente o genera una con IA.</p>
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
              <template v-if="canManage">
                <Button type="button" variant="ghost" size="sm" class="gap-1" :disabled="isUpdating" @click="openEditModal(act)">
                  <Pencil class="size-4" />
                  Editar
                </Button>
                <Button type="button" variant="ghost" size="sm" class="gap-1 text-muted-foreground hover:text-primary hover:bg-primary/10" :disabled="isDeleting" @click="confirmDelete(act)">
                  <Trash2 class="size-4" />
                  Eliminar
                </Button>
              </template>
              <Button v-else-if="isActingAsStudent" type="button" variant="outline" size="sm" class="gap-1 w-full sm:w-auto" @click="openAttemptModal(act)">
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

    <ActivityCreateModal
      :show="showCreateModal"
      v-model:create-form="createForm"
      :match-column-left="matchColumnLeft"
      :match-column-right="matchColumnRight"
      :is-creating="isCreating"
      @close="closeCreateModal"
      @submit="submitCreateActivity"
      @type-change="onCreateTypeChange"
      @update:match-column-left="matchColumnLeft = $event"
      @update:match-column-right="matchColumnRight = $event"
    />

    <ActivityGenerateModal
      :show="showGenerateModal"
      v-model:generate-form="generateForm"
      :generated-preview="generatedPreview"
      :is-generating-activity="isGeneratingActivity"
      :is-creating="isCreating"
      :language-options="LANGUAGE_OPTIONS"
      @close="closeGenerateModal"
      @generate="handleGenerateActivity"
      @discard="discardGeneratedPreview"
      @save="saveGeneratedPreview"
    />

    <ActivityEditModal
      :show="showEditModal"
      :activity-to-edit="activityToEdit"
      :edit-form="editForm"
      :is-updating="isUpdating"
      @close="closeEditModal"
      @submit="submitUpdateActivity"
    />
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

    <ActivityAttemptModal
      :show="showAttemptModal"
      :activity-to-attempt="activityToAttempt"
      v-model:attempt-answer="attemptAnswer"
      :attempt-result="attemptResult"
      :is-submitting-attempt="isSubmittingAttempt"
      @close="closeAttemptModal"
      @submit="submitAttempt"
    />
  </div>
</template>
