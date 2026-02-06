<script setup lang="ts">
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
import { Loader2 } from 'lucide-vue-next'

const props = defineProps<{
  visible: boolean
  title: string
  isPublished: boolean
  isCreating: boolean
}>()

const emit = defineEmits<{
  'update:title': [value: string]
  'update:isPublished': [value: boolean]
  close: []
  create: []
}>()

const handleOpenChange = (open: boolean) => {
  if (!open) {
    emit('close')
  }
}
</script>

<template>
  <Dialog :open="visible" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Crear Nueva Página</DialogTitle>
        <DialogDescription>
          Ingresa el título de la página. Podrás agregar contenido después de crearla.
        </DialogDescription>
      </DialogHeader>

      <div class="grid gap-4 py-4">
        <div class="grid gap-2">
          <Label for="page-title">Título de la página *</Label>
          <Input
            id="page-title"
            :model-value="title"
            @update:model-value="emit('update:title', $event)"
            placeholder="Ej: Introducción a la Programación"
            :disabled="isCreating"
            @keyup.enter="emit('create')"
          />
        </div>

        <div class="flex items-center justify-between space-x-2 rounded-lg border border-border p-4">
          <div class="space-y-0.5">
            <Label for="is-published">Publicar inmediatamente</Label>
            <p class="text-sm text-muted-foreground">
              La página estará visible para los estudiantes
            </p>
          </div>
          <Switch
            id="is-published"
            :checked="isPublished"
            @update:checked="emit('update:isPublished', $event)"
            :disabled="isCreating"
          />
        </div>
      </div>

      <DialogFooter>
        <Button
          type="button"
          @click="emit('close')"
          variant="ghost"
          :disabled="isCreating"
        >
          Cancelar
        </Button>
        <Button
          type="button"
          @click="emit('create')"
          :disabled="isCreating || !title.trim()"
        >
          <Loader2 v-if="isCreating" class="size-4 animate-spin mr-2" />
          {{ isCreating ? 'Creando...' : 'Crear Página' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
