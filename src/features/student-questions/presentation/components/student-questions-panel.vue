<script setup lang="ts">
import { toRef } from 'vue'
import {
  MessageCircleQuestion,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Eye,
  EyeOff,
  Reply,
} from 'lucide-vue-next'
import { useStudentQuestionsPanel } from '../../composables/use-student-questions-panel'
import ConfirmationDialog from '@/shared/components/confirmation-dialog.vue'
import type { StudentQuestion } from '../../types'

interface Props {
  learningObjectId: number
  studentQuestions: StudentQuestion[] | null | undefined
  isProfessor?: boolean
  embedded?: boolean
}

const props = withDefaults(defineProps<Props>(), { isProfessor: false, embedded: false })
const questionsRef = toRef(props, 'studentQuestions')

const {
  isCollapsed,
  isCreating,
  editingId,
  newQuestion,
  newIsPublic,
  editQuestion,
  editIsPublic,
  isCreatingQuestion,
  isUpdatingQuestion,
  isDeletingQuestion,
  showDeleteDialog,
  questionsList,
  canEditQuestion,
  isProfessor,
  toggleCollapse,
  startCreating,
  cancelCreating,
  saveNewQuestion,
  startEditing,
  cancelEditing,
  saveEdit,
  openDeleteDialog,
  cancelDelete,
  confirmDelete,
  formatDate,
  replyingToQuestionId,
  newReplyText,
  editingReplyId,
  editReplyText,
  showDeleteReplyDialog,
  isCreatingReply,
  isUpdatingReply,
  isDeletingReply,
  startReplying,
  cancelReplying,
  saveNewReply,
  startEditingReply,
  cancelEditingReply,
  saveEditReply,
  openDeleteReplyDialog,
  cancelDeleteReply,
  confirmDeleteReply,
  getReplies,
} = useStudentQuestionsPanel(props.learningObjectId, questionsRef, props.isProfessor)
</script>

<template>
  <div
    class="student-questions-panel bg-card border border-border rounded-lg overflow-hidden transition-all duration-300"
    :class="{ collapsed: isCollapsed, 'panel-embedded': embedded }"
  >
    <div class="flex items-center justify-between p-4 border-b border-border bg-muted/30">
      <div class="flex items-center gap-2" :class="isCollapsed && !embedded ? 'flex-col' : ''">
        <MessageCircleQuestion class="size-5 text-primary flex-shrink-0" />
        <div v-if="embedded || !isCollapsed" class="flex items-center gap-2">
          <h3 class="text-lg font-semibold text-foreground">
            {{ isProfessor ? 'Preguntas de estudiantes' : 'Mis preguntas' }}
          </h3>
          <span class="text-sm text-muted-foreground">({{ questionsList.length }})</span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button
          v-if="!isProfessor && !isCreating && !isCollapsed"
          type="button"
          @click="startCreating"
          class="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200"
        >
          <Plus class="size-4" />
          <span class="hidden sm:inline">Nueva</span>
        </button>
        <button
          type="button"
          @click="toggleCollapse"
          class="p-2 hover:bg-muted rounded-lg transition-colors"
          :title="isCollapsed ? 'Expandir' : 'Colapsar'"
        >
          <component :is="isCollapsed ? ChevronRight : ChevronLeft" class="size-4 text-muted-foreground" />
        </button>
      </div>
    </div>

    <div v-show="!isCollapsed" class="p-6 transition-all duration-300">
      <!-- Crear pregunta (solo estudiantes) -->
      <div v-if="!isProfessor && isCreating" class="mb-4 p-4 bg-muted/30 border border-border rounded-lg space-y-3">
        <textarea
          id="new-student-question-textarea"
          v-model="newQuestion"
          placeholder="Escribe tu pregunta sobre el contenido..."
          :disabled="isCreatingQuestion"
          class="w-full min-h-[100px] p-3 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:opacity-50"
        />
        <label class="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
          <input v-model="newIsPublic" type="checkbox" class="rounded border-border" />
          <span>Visible para el profesor y otros estudiantes</span>
        </label>
        <div class="flex items-center justify-end gap-2">
          <button
            type="button"
            @click="cancelCreating"
            :disabled="isCreatingQuestion"
            class="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            <X class="size-4 inline mr-1" />
            Cancelar
          </button>
          <button
            type="button"
            @click="saveNewQuestion"
            :disabled="isCreatingQuestion || !newQuestion.trim()"
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Loader2 v-if="isCreatingQuestion" class="size-4 animate-spin" />
            <Save v-else class="size-4" />
            {{ isCreatingQuestion ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </div>

      <div v-if="questionsList.length === 0 && !isCreating" class="text-center py-12">
        <MessageCircleQuestion class="size-12 mx-auto text-muted-foreground/30 mb-3" />
        <p class="text-muted-foreground text-sm">
          {{ isProfessor ? 'No hay preguntas aún' : 'No tienes preguntas aún' }}
        </p>
        <p class="text-muted-foreground/60 text-xs mt-1">
          {{ isProfessor ? 'Los estudiantes pueden hacer preguntas sobre este objeto de aprendizaje.' : 'Haz una pregunta si algo no quedó claro.' }}
        </p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="q in questionsList"
          :key="q.id"
          class="group relative bg-background border border-border rounded-lg p-4 hover:border-primary/50 transition-all duration-200"
        >
          <!-- Modo edición (solo propio, estudiante) -->
          <div v-if="canEditQuestion(q) && editingId === q.id" class="space-y-3">
            <textarea
              :id="`edit-student-question-${q.id}`"
              v-model="editQuestion"
              :disabled="isUpdatingQuestion"
              class="w-full min-h-[100px] p-3 bg-muted/30 border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:opacity-50"
            />
            <label class="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              <input v-model="editIsPublic" type="checkbox" class="rounded border-border" />
              <span>Visible para el profesor y otros</span>
            </label>
            <div class="flex items-center justify-end gap-2">
              <button
                type="button"
                @click="cancelEditing"
                :disabled="isUpdatingQuestion"
                class="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted rounded-md transition-all duration-200 disabled:opacity-50"
              >
                <X class="size-3 inline mr-1" />
                Cancelar
              </button>
              <button
                type="button"
                @click="saveEdit(q.id)"
                :disabled="isUpdatingQuestion || !editQuestion.trim()"
                class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Loader2 v-if="isUpdatingQuestion" class="size-3 animate-spin" />
                <Save v-else class="size-3" />
                {{ isUpdatingQuestion ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </div>

          <!-- Vista lectura -->
          <div v-else>
            <div class="flex items-start justify-between gap-3 mb-2">
              <p class="text-sm text-foreground whitespace-pre-wrap flex-1">{{ q.question }}</p>
              <div
                v-if="canEditQuestion(q)"
                class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <button
                  type="button"
                  @click="startEditing(q)"
                  :disabled="isDeletingQuestion"
                  class="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-all duration-200 disabled:opacity-50"
                  title="Editar"
                >
                  <Edit2 class="size-4" />
                </button>
                <button
                  type="button"
                  @click="openDeleteDialog(q.id)"
                  :disabled="isDeletingQuestion"
                  class="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-all duration-200 disabled:opacity-50"
                  title="Eliminar"
                >
                  <Trash2 class="size-4" />
                </button>
              </div>
            </div>
            <div class="flex items-center gap-2 flex-wrap">
              <span
                class="inline-flex items-center gap-1 text-xs text-muted-foreground"
                :title="q.isPublic ? 'Visible para todos' : 'Solo tú y el profesor'"
              >
                <Eye v-if="q.isPublic" class="size-3.5" />
                <EyeOff v-else class="size-3.5" />
                {{ q.isPublic ? 'Pública' : 'Privada' }}
              </span>
              <span v-if="!isProfessor && q.user?.id" class="text-xs text-muted-foreground">
                {{ q.user.displayName || q.user.email }}
              </span>
              <span class="text-xs text-muted-foreground">{{ formatDate(q.createdAt) }}</span>
            </div>

            <!-- Respuestas: listado visible para todos -->
            <div v-if="getReplies(q).length > 0 || isProfessor" class="mt-4 pt-3 border-t border-border space-y-3">
              <div v-for="reply in getReplies(q)" :key="reply.id" class="pl-3 border-l-2 border-muted">
                <div v-if="editingReplyId === reply.id" class="space-y-2">
                  <textarea
                    :id="`edit-reply-${reply.id}`"
                    v-model="editReplyText"
                    :disabled="isUpdatingReply"
                    class="w-full min-h-[80px] p-2 text-sm bg-muted/30 border border-border rounded-md resize-none disabled:opacity-50"
                  />
                  <div class="flex gap-2">
                    <button
                      type="button"
                      @click="cancelEditingReply"
                      class="text-sm text-muted-foreground hover:bg-muted px-2 py-1 rounded"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      @click="saveEditReply(reply.id)"
                      :disabled="isUpdatingReply || !editReplyText.trim()"
                      class="text-sm bg-primary text-primary-foreground px-2 py-1 rounded disabled:opacity-50"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
                <div v-else>
                  <p class="text-sm text-foreground whitespace-pre-wrap">{{ reply.replyText }}</p>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-xs font-medium" :class="reply.isFromTeacher ? 'text-primary' : 'text-muted-foreground'">
                      {{ reply.isFromTeacher ? 'Profesor' : reply.user?.displayName || reply.user?.email }}
                    </span>
                    <span class="text-xs text-muted-foreground">{{ formatDate(reply.createdAt) }}</span>
                    
                    <!-- Solo el autor o el profesor pueden editar/borrar -->
                    <template v-if="isProfessor || (reply.user?.id === currentUserId)">
                      <button
                        type="button"
                        @click="startEditingReply(reply)"
                        class="text-xs text-muted-foreground hover:text-primary ml-2"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        @click="openDeleteReplyDialog(reply.id)"
                        :disabled="isDeletingReply"
                        class="text-xs text-muted-foreground hover:text-destructive"
                      >
                        Eliminar
                      </button>
                    </template>
                  </div>
                </div>
              </div>

              <!-- Formulario para nueva respuesta (Solo profesor por ahora, o según lógica de negocio) -->
              <template v-if="isProfessor">
                <div v-if="replyingToQuestionId === q.id" class="space-y-2">
                  <textarea
                    :id="`new-reply-${q.id}`"
                    v-model="newReplyText"
                    placeholder="Escribe tu respuesta..."
                    :disabled="isCreatingReply"
                    class="w-full min-h-[80px] p-2 text-sm bg-muted/30 border border-border rounded-md resize-none disabled:opacity-50"
                  />
                  <div class="flex gap-2">
                    <button
                      type="button"
                      @click="cancelReplying"
                      class="text-sm text-muted-foreground hover:bg-muted px-2 py-1 rounded"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      @click="saveNewReply(q.id)"
                      :disabled="isCreatingReply || !newReplyText.trim()"
                      class="text-sm bg-primary text-primary-foreground px-2 py-1 rounded disabled:opacity-50"
                    >
                      {{ isCreatingReply ? 'Guardando...' : 'Responder' }}
                    </button>
                  </div>
                </div>
                <button
                  v-else
                  type="button"
                  @click="startReplying(q.id)"
                  class="flex items-center gap-1.5 text-sm text-primary hover:underline"
                >
                  <Reply class="size-4" />
                  Responder
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ConfirmationDialog
    :visible="showDeleteDialog"
    title="Eliminar pregunta"
    message="¿Estás seguro de que quieres eliminar esta pregunta? Esta acción no se puede deshacer."
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />
  <ConfirmationDialog
    :visible="showDeleteReplyDialog"
    title="Eliminar respuesta"
    message="¿Estás seguro de que quieres eliminar esta respuesta?"
    @confirm="confirmDeleteReply"
    @cancel="cancelDeleteReply"
  />
</template>

<style scoped>
.student-questions-panel {
  transition: width 0.3s ease, min-width 0.3s ease;
}

.student-questions-panel.collapsed {
  width: 70px;
  min-width: 70px;
}

.student-questions-panel.panel-embedded.collapsed {
  width: 100%;
  min-width: 0;
}

textarea {
  font-family: inherit;
  line-height: 1.5;
}
</style>
