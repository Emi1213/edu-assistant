<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, UserPlus, Trash2, Loader2, Users } from 'lucide-vue-next'
import { useModule } from '@/features/modules/composables/queries/use-module'
import { useRoles } from '@/features/auth/composables/use-roles'
import { useGetModuleEnrollments } from '../../composables/queries/useEnrollmentQueries'
import { useDeleteEnrollmentMutation } from '../../composables/mutations/useDeleteEnrollmentMutation'
import { useUpdateEnrollmentMutation } from '../../composables/mutations/useUpdateEnrollmentMutation'
import { useBulkEnrollMutation } from '../../composables/mutations/useBulkEnrollMutation'
import { useToast } from '@/shared/composables/use-toast'
import type { EnrollmentStudent } from '../../types/enrollments.types'
import AddStudentsModal from '../components/add-students-modal.vue'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'

const route = useRoute()
const router = useRouter()
const moduleId = computed(() => Number(route.params.id))
const { data: module, isLoading: isLoadingModule } = useModule(moduleId.value)
const { canEdit } = useRoles()
const toast = useToast()
const showAddModal = ref(false)

const { data: enrollments, isLoading: isLoadingEnrollments } = useGetModuleEnrollments(moduleId)
const enrolledList = computed(() => enrollments.value ?? [])

const deleteMutation = useDeleteEnrollmentMutation()
const updateMutation = useUpdateEnrollmentMutation()
const bulkEnrollMutation = useBulkEnrollMutation()

function goBack() {
  router.push(`/modules/${moduleId.value}/wiki`)
}

function handleRemove(enrollment: EnrollmentStudent) {
  deleteMutation.mutate(enrollment.id, {
    onSuccess: () => toast.success('Estudiante eliminado del módulo'),
    onError: (err: Error) => toast.error(err?.message ?? 'Error al eliminar'),
  })
}

function handleToggleActive(enrollment: EnrollmentStudent) {
  updateMutation.mutate(
    { id: enrollment.id, payload: { isActive: !enrollment.isActive } },
    {
      onSuccess: () => toast.success(enrollment.isActive ? 'Estudiante desactivado' : 'Estudiante activado'),
      onError: (err: Error) => toast.error(err?.message ?? 'Error al actualizar'),
    }
  )
}

function handleAddStudents(selectedIds: number[]) {
  if (selectedIds.length === 0) return
  bulkEnrollMutation.mutate(
    { moduleId: moduleId.value, studentIds: selectedIds },
    {
      onSuccess: () => {
        toast.success('Estudiantes inscritos correctamente')
        showAddModal.value = false
      },
      onError: (err: Error) => toast.error(err?.message ?? 'Error al inscribir'),
    }
  )
}
</script>

<template>
  <div class="space-y-6 pt-4 sm:pt-8 min-w-0">
    <button
      type="button"
      class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 hover:shadow-md transition-all duration-200 w-full sm:w-auto"
      @click="goBack"
    >
      <ArrowLeft class="size-4 shrink-0" />
      Volver al módulo
    </button>

    <div v-if="isLoadingModule" class="rounded-lg border border-border bg-card p-4 sm:p-6">
      <div class="flex items-start gap-4">
        <Skeleton class="h-8 w-3/4" />
        <Skeleton class="h-4 w-full" />
      </div>
    </div>

    <div v-else-if="module" class="rounded-lg border border-border bg-card p-4 sm:p-6 min-w-0">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 class="text-lg font-bold text-foreground flex items-center gap-2">
          <Users class="size-5" />
          Estudiantes inscritos
          <span v-if="!isLoadingEnrollments" class="text-sm font-normal text-muted-foreground">
            ({{ enrolledList.length }})
          </span>
        </h2>
        <button
          v-if="canEdit()"
          type="button"
          class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors w-full sm:w-auto"
          @click="showAddModal = true"
        >
          <UserPlus class="size-4" />
          Agregar estudiantes
        </button>
      </div>

      <div v-if="isLoadingEnrollments" class="flex items-center gap-2 text-muted-foreground py-6">
        <Loader2 class="size-4 animate-spin" />
        <span>Cargando lista...</span>
      </div>

      <div v-else-if="enrolledList.length === 0" class="py-8 text-center text-muted-foreground text-sm">
        No hay estudiantes inscritos. Usa "Agregar estudiantes" para inscribir.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border text-left text-muted-foreground">
              <th class="pb-2 pr-2 font-medium">Nombre</th>
              <th class="pb-2 pr-2 font-medium hidden sm:table-cell">Email</th>
              <th class="pb-2 pr-2 font-medium">Estado</th>
              <th v-if="canEdit()" class="pb-2 pl-2 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="e in enrolledList"
              :key="e.id"
              class="border-b border-border/70 hover:bg-muted/30 transition-colors"
            >
              <td class="py-3 pr-2">
                <span class="font-medium text-foreground">
                  {{ (e.user?.displayName ?? `${e.user?.name ?? ''} ${e.user?.lastName ?? ''}`.trim()) || '—' }}
                </span>
              </td>
              <td class="py-3 pr-2 hidden sm:table-cell text-muted-foreground">
                {{ e.user?.email ?? '—' }}
              </td>
              <td class="py-3 pr-2">
                <span
                  class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="e.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-muted text-muted-foreground'"
                >
                  {{ e.isActive ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td v-if="canEdit()" class="py-3 pl-2 text-right">
                <div class="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    class="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    :title="e.isActive ? 'Desactivar' : 'Activar'"
                    :disabled="updateMutation.isPending.value"
                    @click="handleToggleActive(e)"
                  >
                    <Loader2 v-if="updateMutation.isPending.value" class="size-4 animate-spin" />
                    <span v-else class="text-xs font-medium">{{ e.isActive ? 'Desactivar' : 'Activar' }}</span>
                  </button>
                  <button
                    type="button"
                    class="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                    title="Eliminar del módulo"
                    :disabled="deleteMutation.isPending.value"
                    @click="handleRemove(e)"
                  >
                    <Trash2 class="size-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <AddStudentsModal
        :open="showAddModal"
        :module-id="moduleId"
        :already-enrolled-ids="enrolledList.map((e) => e.user?.id).filter((id): id is number => id != null)"
        :is-loading="bulkEnrollMutation.isPending.value"
        @close="showAddModal = false"
        @add="handleAddStudents"
      />
    </div>
  </div>
</template>
