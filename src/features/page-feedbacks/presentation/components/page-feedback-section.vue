<script setup lang="ts">
import { MessageSquare, Edit2, Trash2, Save, X, Loader2 } from 'lucide-vue-next'
import { usePageFeedback } from '../../composables/use-page-feedback'
import { useRoles } from '@/features/auth/composables/use-roles'
import ConfirmationDialog from '@/shared/components/confirmation-dialog.vue'
import type { PageFeedback } from '../../types/page-feedbacks.types'
import type { Ref } from 'vue'

interface Props {
  pageId: number
  feedbacks: Ref<PageFeedback[]> | PageFeedback[] | null | undefined
}

const props = defineProps<Props>()
const { isStudent } = useRoles()

const {
  isEditing,
  feedbackContent,
  isCreating,
  isUpdating,
  isDeleting,
  showDeleteDialog,
  userFeedback,
  feedbacksValue,
  startEditing,
  cancelEditing,
  saveFeedback,
  openDeleteDialog,
  cancelDelete,
  confirmDelete,
} = usePageFeedback(props.pageId, props.feedbacks)
</script>

<template>
  <div class="page-feedback-section">
    <!-- Vista para ESTUDIANTES: Crear/editar su propio feedback -->
    <div v-if="isStudent">
      <div v-if="!userFeedback && !isEditing" class="bg-card border border-border rounded-lg p-4">
        <div class="flex items-center gap-2 mb-3">
          <MessageSquare class="size-5 text-primary" />
          <h3 class="text-base font-semibold text-foreground">Feedback de la página</h3>
        </div>
        <p class="text-sm text-muted-foreground mb-4">
          Comparte tu opinión sobre esta página para ayudar a mejorar el contenido.
        </p>
        <button
          @click="startEditing"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200"
        >
          <MessageSquare class="size-4" />
          <span>Agregar Feedback</span>
        </button>
      </div>

      <div v-else-if="userFeedback && !isEditing" class="bg-card border border-border rounded-lg p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <MessageSquare class="size-5 text-primary" />
            <h3 class="text-base font-semibold text-foreground">Tu Feedback</h3>
          </div>
          <div class="flex items-center gap-1">
            <button
              @click="startEditing"
              :disabled="isDeleting"
              class="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200 disabled:opacity-50"
              title="Editar"
            >
              <Edit2 class="size-4" />
            </button>
            <button
              @click="openDeleteDialog"
              :disabled="isDeleting"
              class="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-200 disabled:opacity-50"
              title="Eliminar"
            >
              <Trash2 class="size-4" />
            </button>
          </div>
        </div>
        <p class="text-sm text-foreground whitespace-pre-wrap">{{ userFeedback.feedback }}</p>
      </div>

      <div v-else-if="isEditing" class="bg-card border border-border rounded-lg p-4">
        <div class="flex items-center gap-2 mb-3">
          <MessageSquare class="size-5 text-primary" />
          <h3 class="text-base font-semibold text-foreground">
            {{ userFeedback ? 'Editar' : 'Agregar' }} Feedback
          </h3>
        </div>
        <textarea
          id="feedback-textarea"
          v-model="feedbackContent"
          placeholder="Escribe tu opinión sobre esta página..."
          :disabled="isCreating || isUpdating"
          class="w-full min-h-[120px] p-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:opacity-50 mb-3"
        />
        <div class="flex items-center justify-end gap-2">
          <button
            @click="cancelEditing"
            :disabled="isCreating || isUpdating"
            class="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            <X class="size-4 inline mr-1" />
            Cancelar
          </button>
          <button
            @click="saveFeedback"
            :disabled="isCreating || isUpdating || !feedbackContent.trim()"
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Loader2 v-if="isCreating || isUpdating" class="size-4 animate-spin" />
            <Save v-else class="size-4" />
            <span>{{ isCreating || isUpdating ? 'Guardando...' : 'Guardar' }}</span>
          </button>
        </div>
      </div>

      <ConfirmationDialog
        :visible="showDeleteDialog"
        title="Eliminar feedback"
        message="¿Estás seguro de que quieres eliminar tu feedback? Esta acción no se puede deshacer."
        @confirm="confirmDelete"
        @cancel="cancelDelete"
      />
    </div>

    <!-- Vista para PROFESORES: Solo lectura de todos los feedbacks -->
    <div v-else class="space-y-4">
      <div class="flex items-center gap-2 mb-4">
        <MessageSquare class="size-5 text-primary" />
        <h3 class="text-lg font-semibold text-foreground">Feedbacks de los estudiantes</h3>
      </div>
      
      <div v-if="feedbacksValue.length === 0" class="bg-card border border-border rounded-lg p-6 text-center">
        <MessageSquare class="size-8 text-muted-foreground mx-auto mb-2" />
        <p class="text-sm text-muted-foreground">
          Aún no hay feedbacks de los estudiantes para esta página.
        </p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="feedback in feedbacksValue"
          :key="feedback.id"
          class="bg-card border border-border rounded-lg p-4"
        >
          <div class="flex items-start justify-between mb-2">
            <div class="flex items-center gap-2">
              <div class="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span class="text-sm font-semibold text-primary">
                  {{ feedback.user.name.charAt(0).toUpperCase() }}
                </span>
              </div>
              <div>
                <p class="text-sm font-medium text-foreground">{{ feedback.user.name }}</p>
                <p class="text-xs text-muted-foreground">{{ feedback.user.email }}</p>
              </div>
            </div>
          </div>
          <p class="text-sm text-foreground whitespace-pre-wrap mt-2">{{ feedback.feedback }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
textarea {
  font-family: inherit;
  line-height: 1.5;
}
</style>
