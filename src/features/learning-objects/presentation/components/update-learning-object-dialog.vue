<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Loader2, X } from 'lucide-vue-next'
import { useUpdateLearningObject } from '../../composables/mutations/use-update-learning-object'
import { useToast } from '@/shared/composables/use-toast'
import type { LearningObject } from '../../types'

const props = defineProps<{
  visible: boolean
  learningObject: LearningObject | null
}>()

const emit = defineEmits<{
  close: []
}>()

const toast = useToast()
const editForm = ref({
  title: '',
  keywords: [] as string[],
  isPublished: false,
  hasManualEdits: false,
})

const keywordInput = ref('')

const loId = computed(() => props.learningObject?.id ?? 0)
const { mutate: updateLO, isPending } = useUpdateLearningObject(loId)

watch(
  () => props.learningObject,
  (lo) => {
    if (lo) {
      editForm.value = {
        title: lo.title || '',
        keywords: lo.keywords ? [...lo.keywords] : [],
        isPublished: !!lo.isPublished,
        hasManualEdits: false,
      }
    }
  },
  { immediate: true, deep: true }
)

const addKeyword = () => {
  const k = keywordInput.value.trim().toLowerCase()
  if (k && !editForm.value.keywords.includes(k)) {
    editForm.value.keywords.push(k)
    keywordInput.value = ''
  }
}

const removeKeyword = (index: number) => {
  editForm.value.keywords.splice(index, 1)
}

const handleUpdate = () => {
  if (!props.learningObject || isPending.value) return

  updateLO(
    {
      title: editForm.value.title.trim(),
      keywords: editForm.value.keywords,
      isPublished: editForm.value.isPublished,
      hasManualEdits: true,
    },
    {
      onSuccess: () => {
        toast.success('Cambios guardados con éxito')
        emit('close')
      },
      onError: (error) => {
        toast.error(error.message || 'Error al actualizar el objeto de aprendizaje')
      },
    }
  )
}

const canSave = computed(() => {
  return editForm.value.title.trim().length > 0 && !isPending.value
})
</script>

<template>
  <Dialog :open="visible" @update:open="$emit('close')">
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Editar Objeto de Aprendizaje</DialogTitle>
        <DialogDescription>
          Actualiza los detalles básicos de este objeto de aprendizaje.
        </DialogDescription>
      </DialogHeader>

      <div class="grid gap-6 py-4">
        <div class="grid gap-2">
          <Label for="lo-title">Título del objeto de aprendizaje *</Label>
          <Input
            id="lo-title"
            v-model="editForm.title"
            placeholder="Ej: Introducción a Vue.js"
            :disabled="isPending"
          />
        </div>

        <div class="grid gap-2">
          <Label>Palabras Clave</Label>
          <div class="flex gap-2">
            <Input
              v-model="keywordInput"
              placeholder="Añadir etiqueta..."
              :disabled="isPending"
              @keydown.enter.prevent="addKeyword"
            />
            <Button type="button" variant="outline" @click="addKeyword" :disabled="isPending">
              Añadir
            </Button>
          </div>
          <div class="flex flex-wrap gap-2 mt-2">
            <span
              v-for="(k, i) in editForm.keywords"
              :key="i"
              class="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-md"
            >
              {{ k }}
              <button @click="removeKeyword(i)" class="hover:text-primary/70">
                <X class="size-3" />
              </button>
            </span>
          </div>
        </div>

        <div class="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
          <div class="space-y-0.5">
            <Label for="lo-is-published">Estado de Publicación</Label>
            <p class="text-xs text-muted-foreground">
              {{ editForm.isPublished ? 'Visible para estudiantes' : 'Solo visible para profesores' }}
            </p>
          </div>
          <Switch
            id="lo-is-published"
            :model-value="editForm.isPublished"
            @update:model-value="editForm.isPublished = $event"
            :disabled="isPending"
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="$emit('close')" :disabled="isPending">
          Cancelar
        </Button>
        <Button @click="handleUpdate" :disabled="!canSave">
          <Loader2 v-if="isPending" class="mr-2 h-4 w-4 animate-spin" />
          Guardar Cambios
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
