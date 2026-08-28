<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, BookOpen, Users, Sparkles, CheckCircle2, Clock, Loader2, X } from 'lucide-vue-next'
import { useModule } from '../../composables/queries/use-module'
import { useLearningObjectsList } from '@/features/learning-objects/composables/use-learning-objects-list'
import { useLearningObjectTypes } from '@/features/learning-objects/composables/queries/use-learning-object-types'
import { useRoles } from '@/features/auth/composables/use-roles'
import { useModuleProgress } from '@/features/modules/composables/use-module-progress'
import { useExtractRelations } from '@/features/content-generation/composables/mutations/use-extract-relations'
import { useToast } from '@/shared/composables/use-toast'
import { toFullAssetUrl } from '@/shared/utils/image.utils'
import LearningObjectsTabs from '@/features/learning-objects/presentation/components/learning-objects-tabs.vue'
import CreateLearningObjectDialog from '@/features/learning-objects/presentation/components/create-learning-object-dialog.vue'
import CreateVideoDialog from '@/features/videos/presentation/components/create-video-dialog.vue'
import UpdateLearningObjectDialog from '@/features/learning-objects/presentation/components/update-learning-object-dialog.vue'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
import type { LearningObject } from '@/features/learning-objects/types'
import { useUpdateLearningObject } from '@/features/learning-objects/composables/mutations/use-update-learning-object'
import { useAuthStore } from '@/features/auth/context/auth-store'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import ChatPanel from '@/features/chat/presentation/components/chat-panel.vue'
import { useCreateChatSession } from '@/features/chat/composables/mutations/use-create-chat-session'
import { Button } from '@/components/ui/button'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const moduleId = computed(() => Number(route.params.id))

const { data: module, isLoading: isLoadingModule } = useModule(moduleId.value)
const { canEdit, isStudent, isAdmin } = useRoles()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const isOwner = computed(() => module.value?.teacherId === user.value?.id)
const canManage = computed(() => (canEdit() && isOwner.value) || isAdmin.value)

const { showProgress, isCompleted, isStarted } = useModuleProgress(moduleId, isOwner)


const isChatOpen = ref(false)
const selectedLearningObjectId = ref<number | null>(null)
const chatSessionId = ref<number | null>(null)
const { mutate: createChatSession, isPending: isStartingSession } = useCreateChatSession(computed(() => selectedLearningObjectId.value ?? 0))

const { data: learningObjectTypes, isLoading: isLoadingTypes } = useLearningObjectTypes()
const types = computed(() => learningObjectTypes.value ?? [])

const isVideoDialogOpen = ref(false)

const openCreateDialog = (typeId: number) => {
  const type = types.value.find((t) => t.id === typeId)
  if (type?.name === 'VIDEO') {
    isVideoDialogOpen.value = true
    return
  }
  openDialog(typeId)
}

const {
  isDialogOpen,
  learningObjectTitle,
  isPublished,
  isCreating,
  openDialog,
  closeDialog,
  handleCreate,
  learningObjectToUpdate,
  openUpdateLearningObject,
  closeUpdateLearningObject,
} = useLearningObjectsList(moduleId.value)

const { mutate: extractRelations } = useExtractRelations()
const generatingRelationsLearningObjectId = ref<number | null>(null)

const publishingLoId = ref<number | null>(null)
const loToPublish = computed(() => publishingLoId.value ?? 0)
const { mutate: updateLO } = useUpdateLearningObject(loToPublish)

const handlePublishNow = (learningObject: LearningObject) => {
  publishingLoId.value = learningObject.id
  updateLO(
    { isPublished: true },
    {
      onSuccess: () => {
        toast.success(`"${learningObject.title}" publicado con éxito`)
        publishingLoId.value = null
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Error al publicar')
        publishingLoId.value = null
      },
    }
  )
}

const goBack = () => {
  router.push({ name: 'modules' })
}

const handleChat = (learningObject: LearningObject) => {
  if (selectedLearningObjectId.value !== learningObject.id) {
    chatSessionId.value = null
  }
  selectedLearningObjectId.value = learningObject.id
  isChatOpen.value = true
  
  if (!chatSessionId.value) {
    createChatSession({}, {
      onSuccess: (session) => {
        if (session) chatSessionId.value = session.id
      }
    })
  }
}

const handleGenerateRelations = (learningObject: LearningObject) => {
  generatingRelationsLearningObjectId.value = learningObject.id
  extractRelations(
    { learningObjectId: learningObject.id },
    {
      onSuccess: (data) => {
        generatingRelationsLearningObjectId.value = null
        const relations = data?.relations ?? []
        try {
          sessionStorage.setItem(`learning-object-relations-${learningObject.id}`, JSON.stringify(relations))
        } catch {
          /* ignore */
        }
        router.push({
          name: 'learning-object-edit',
          params: {
            id: moduleId.value,
            learningObjectId: learningObject.id,
          },
          query: { applyRelations: '1' },
          state: { relations } as Record<string, unknown> as import('vue-router').HistoryState,
        })
      },
      onError: () => {
        generatingRelationsLearningObjectId.value = null
        toast.error('Error al extraer relaciones')
      },
    }
  )
}
</script>

<template>
  <div class="space-y-6 pt-4 sm:pt-8 min-w-0">
    <button
      @click="goBack"
      class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 hover:shadow-md transition-all duration-200 w-full sm:w-auto"
    >
      <ArrowLeft class="size-4 shrink-0" />
      <span>Volver a Mis Módulos</span>
    </button>

    <div v-if="isLoadingModule" class="rounded-lg border border-border bg-card p-4 sm:p-6">
      <div class="flex items-start gap-4">
        <Skeleton class="w-16 h-16 sm:w-20 sm:h-20 rounded-lg shrink-0" />
        <div class="flex-1 space-y-3">
          <Skeleton class="h-8 w-3/4" />
          <Skeleton class="h-4 w-full" />
          <Skeleton class="h-4 w-2/3" />
        </div>
      </div>
    </div>

    <div v-else-if="module" class="rounded-lg border border-border bg-card p-4 sm:p-6">
      <div class="flex flex-col sm:flex-row sm:items-start gap-4">
        <div class="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-primary flex items-center justify-center overflow-hidden relative">
          <img
            v-if="module.logoUrl"
            :src="toFullAssetUrl(module.logoUrl)"
            :alt="module.title"
            class="w-full h-full object-cover"
          />
          <BookOpen v-else class="size-8 sm:size-10 text-primary-foreground" />

          <!-- Progress Indicator -->
          <div v-if="showProgress && (isCompleted || isStarted)" class="absolute -top-1 -right-1 bg-background rounded-full p-1 shadow-md border border-border z-10">
            <CheckCircle2 v-if="isCompleted" class="size-5 text-green-500 fill-green-500/10" />
            <Clock v-else-if="isStarted" class="size-5 text-orange-500 fill-orange-500/10" />
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <h1 class="text-xl sm:text-2xl font-bold text-card-foreground mb-2 break-words">
            {{ module.title }}
          </h1>
          <p v-if="module.description" class="text-sm sm:text-base text-muted-foreground mb-4 break-words">
            {{ module.description }}
          </p>
          <div v-if="canManage" class="flex flex-wrap items-center gap-3">
            <router-link
              :to="{ name: 'module-students', params: { id: module.id } }"
              class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Users class="size-4" />
              Inscribir estudiantes
            </router-link>
            
            <router-link
              :to="{ name: 'module-teacher-feedback', params: { id: module.id } }"
              class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Sparkles class="size-4" />
              Feedbacks Pedagógicos
            </router-link>
          </div>

          <div v-else-if="isStudent" class="flex flex-wrap items-center gap-3">
            <router-link
              :to="{ name: 'module-student-feedback', params: { id: module.id } }"
              class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Sparkles class="size-4" />
              Mi Feedback IA
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="space-y-4 min-w-0">
      <h2 class="text-lg sm:text-xl font-bold text-foreground">Objetos de Aprendizaje del Módulo</h2>

      <div v-if="isLoadingTypes" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="i in 4"
          :key="i"
          class="rounded-lg border border-border bg-card p-5"
        >
          <Skeleton class="h-6 w-3/4 mb-3" />
          <Skeleton class="h-4 w-full mb-2" />
          <Skeleton class="h-4 w-2/3" />
        </div>
      </div>

      <LearningObjectsTabs
        v-else-if="types.length > 0"
        :types="types"
        :module-id="moduleId"
        :can-edit="canManage"
        :generating-relations-learning-object-id="generatingRelationsLearningObjectId"
        :publishing-learning-object-id="publishingLoId"
        :on-update-learning-object="openUpdateLearningObject"
        :on-generate-relations="handleGenerateRelations"
        :on-publish-now="handlePublishNow"
        :on-chat="isStudent || !isOwner ? handleChat : undefined"
        @create="openCreateDialog"
      />

      <div v-else class="rounded-md bg-card px-6 py-12 text-center">
        <p class="text-muted-foreground">No hay tipos de objetos de aprendizaje configurados</p>
      </div>
    </div>

    <CreateLearningObjectDialog
      :visible="isDialogOpen"
      :title="learningObjectTitle"
      :is-published="isPublished"
      :is-creating="isCreating"
      @update:title="learningObjectTitle = $event"
      @update:is-published="isPublished = $event"
      @close="closeDialog"
      @create="handleCreate"
    />

    <CreateVideoDialog
      :module-id="moduleId"
      :is-open="isVideoDialogOpen"
      @update:is-open="isVideoDialogOpen = $event"
    />

    <UpdateLearningObjectDialog
      v-if="learningObjectToUpdate"
      :key="learningObjectToUpdate.id"
      :visible="true"
      :learning-object="learningObjectToUpdate"
      @close="closeUpdateLearningObject"
    />

    <Sheet :open="isChatOpen" @update:open="isChatOpen = $event">
      <SheetContent side="right" class="w-[400px] sm:w-[540px] p-0">
        <div v-if="isStartingSession" class="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
          <Loader2 class="size-10 text-primary animate-spin" />
          <p class="text-muted-foreground font-medium">Iniciando sesión con el asistente...</p>
        </div>
        <ChatPanel 
          v-else-if="chatSessionId !== null" 
          :session-id="chatSessionId"
          @close="isChatOpen = false" 
        />
        <div v-else class="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div class="size-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center">
            <X class="size-6" />
          </div>
          <p class="text-muted-foreground">No se pudo iniciar la sesión de chat. Intenta de nuevo.</p>
          <Button variant="outline" @click="() => handleChat({ id: selectedLearningObjectId } as LearningObject)">Reintentar</Button>
        </div>
      </SheetContent>
    </Sheet>

  </div>
</template>
