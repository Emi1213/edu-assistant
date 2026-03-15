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
import { useUpdatePage } from '../../composables/mutations/use-update-page'
import { useToast } from '@/shared/composables/use-toast'
import type { Page } from '../../types'

const props = defineProps<{
  visible: boolean
  page: Page | null
}>()

const emit = defineEmits<{
  close: []
}>()

const toast = useToast()
const editForm = ref({
  title: '',
  keywords: [] as string[],
  isPublished: true,
  hasManualEdits: false,
})
const newKeyword = ref('')

const pageId = computed(() => props.page?.id ?? 0)
const { mutate: updatePage, isPending: isUpdating } = useUpdatePage(pageId)

watch(
  () => [props.visible, props.page] as const,
  ([visible, page]) => {
    if (visible && page) {
      editForm.value = {
        title: page.title,
        keywords: [...(page.keywords ?? [])],
        isPublished: page.isPublished ?? true,
        hasManualEdits: (page as Page & { hasManualEdits?: boolean }).hasManualEdits ?? false,
      }
      newKeyword.value = ''
    }
  },
  { immediate: true }
)

function addKeyword() {
  const kw = newKeyword.value.trim()
  if (kw && !editForm.value.keywords.includes(kw)) {
    editForm.value.keywords.push(kw)
    newKeyword.value = ''
  }
}

function removeKeyword(index: number) {
  editForm.value.keywords.splice(index, 1)
}

function save() {
  if (!props.page) return
  updatePage(
    {
      title: editForm.value.title || undefined,
      keywords: editForm.value.keywords.length ? editForm.value.keywords : undefined,
      isPublished: editForm.value.isPublished,
      hasManualEdits: editForm.value.hasManualEdits,
    },
    {
      onSuccess: () => {
        toast.success('Página actualizada')
        emit('close')
      },
      onError: (err: Error) => toast.error(err.message || 'Error al actualizar'),
    }
  )
}

function handleOpenChange(open: boolean) {
  if (!open) emit('close')
}
</script>

<template>
  <Dialog :open="visible" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Actualizar página</DialogTitle>
        <DialogDescription>
          Título, palabras clave y opciones. Todo opcional.
        </DialogDescription>
      </DialogHeader>

      <div v-if="page" class="grid gap-4 py-4">
        <div class="space-y-2">
          <Label for="update-page-title">Título</Label>
          <Input
            id="update-page-title"
            v-model="editForm.title"
            placeholder="Título de la página"
          />
        </div>
        <div class="space-y-2">
          <Label>Palabras clave</Label>
          <div class="flex flex-wrap gap-2 mb-2">
            <span
              v-for="(kw, i) in editForm.keywords"
              :key="i"
              class="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary"
            >
              {{ kw }}
              <button type="button" class="hover:text-primary/80" @click="removeKeyword(i)" aria-label="Quitar">
                <X class="size-3" />
              </button>
            </span>
          </div>
          <div class="flex gap-2">
            <Input
              v-model="newKeyword"
              placeholder="Añadir palabra clave"
              class="flex-1"
              @keydown.enter.prevent="addKeyword"
            />
            <Button type="button" variant="outline" size="sm" @click="addKeyword">Añadir</Button>
          </div>
        </div>
        <div class="flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <Label for="update-page-published" class="cursor-pointer">Publicada</Label>
            <p class="text-xs text-muted-foreground">Visible para estudiantes</p>
          </div>
          <Switch
            id="update-page-published"
            :model-value="editForm.isPublished"
            @update:model-value="(v: boolean) => (editForm.isPublished = v)"
          />
        </div>
        <div class="flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <Label for="update-page-manual" class="cursor-pointer">Ediciones manuales</Label>
            <p class="text-xs text-muted-foreground">Marcar si se editó contenido a mano</p>
          </div>
          <Switch
            id="update-page-manual"
            :model-value="editForm.hasManualEdits"
            @update:model-value="(v: boolean) => (editForm.hasManualEdits = v)"
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="ghost" :disabled="isUpdating" @click="emit('close')">
          Cancelar
        </Button>
        <Button :disabled="isUpdating" @click="save">
          <Loader2 v-if="isUpdating" class="size-4 animate-spin mr-2" />
          {{ isUpdating ? 'Guardando...' : 'Guardar cambios' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
