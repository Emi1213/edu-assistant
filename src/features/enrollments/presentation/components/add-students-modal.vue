<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { debouncedRef } from '@vueuse/core'
import { X, Search, Loader2, UserPlus } from 'lucide-vue-next'
import { useStudents } from '@/features/users/composables/queries/use-students'

const props = defineProps<{
  open: boolean
  moduleId: number
  alreadyEnrolledIds: number[]
  isLoading: boolean
}>()

const emit = defineEmits<{
  close: []
  add: [studentIds: number[]]
}>()

const search = ref('')
const searchDebounced = debouncedRef(search, 350)
const selectedIds = ref<Set<number>>(new Set())

const queryParams = computed(() => {
  if (!props.open) return undefined
  const term = searchDebounced.value.trim() || undefined
  return { page: 1, limit: 20, search: term }
})

const { data: studentsResponse, isLoading: isLoadingStudents } = useStudents(queryParams)

const students = computed(() => studentsResponse.value ?? [])
const selectableStudents = computed(() =>
  students.value.filter((s) => !props.alreadyEnrolledIds.includes(s.id))
)

function toggle(id: number) {
  const next = new Set(selectedIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  selectedIds.value = next
}

function submit() {
  emit('add', Array.from(selectedIds.value))
}

function close() {
  search.value = ''
  selectedIds.value = new Set()
  emit('close')
}

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      search.value = ''
      selectedIds.value = new Set()
    }
  }
)
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      @click.self="close()"
    >
      <div
        class="bg-card rounded-xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
        @click.stop
      >
        <div class="flex items-center justify-between p-4 border-b border-border shrink-0">
          <h2 class="text-lg font-bold text-foreground flex items-center gap-2">
            <UserPlus class="size-5" />
            Agregar estudiantes
          </h2>
          <button
            type="button"
            class="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            @click="close()"
          >
            <X class="size-5" />
          </button>
        </div>

        <div class="p-4 border-b border-border shrink-0">
          <label class="block text-sm font-medium text-foreground mb-2">Buscar por nombre, apellido o email</label>
          <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              v-model="search"
              type="text"
              placeholder="Ej: Juan Pérez"
              class="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div class="flex-1 overflow-y-auto min-h-0 p-4">
          <div v-if="isLoadingStudents" class="flex items-center justify-center gap-2 py-8 text-muted-foreground">
            <Loader2 class="size-5 animate-spin" />
            <span>Buscando estudiantes...</span>
          </div>
          <div v-else-if="selectableStudents.length === 0" class="py-8 text-center text-muted-foreground text-sm">
            {{ search.trim() ? 'No se encontraron estudiantes con ese criterio.' : 'No hay más estudiantes disponibles para agregar.' }}
          </div>
          <ul v-else class="space-y-1">
            <li
              v-for="s in selectableStudents"
              :key="s.id"
              class="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
              :class="{ 'ring-2 ring-primary bg-primary/5': selectedIds.has(s.id) }"
              @click="toggle(s.id)"
            >
              <input
                type="checkbox"
                :checked="selectedIds.has(s.id)"
                class="rounded border-border"
                @click.stop
                @change="toggle(s.id)"
              />
              <div class="min-w-0 flex-1">
                <p class="font-medium text-foreground truncate">
                  {{ (s.displayName ?? `${s.name ?? ''} ${s.lastName ?? ''}`.trim()) || s.email }}
                </p>
                <p class="text-xs text-muted-foreground truncate">{{ s.email }}</p>
              </div>
            </li>
          </ul>
        </div>

        <div class="flex items-center justify-end gap-3 p-4 border-t border-border shrink-0">
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg"
            @click="close()"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="selectedIds.size === 0 || isLoading"
            @click="submit()"
          >
            <Loader2 v-if="isLoading" class="size-4 animate-spin" />
            <UserPlus v-else class="size-4" />
            Inscribir ({{ selectedIds.size }})
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
