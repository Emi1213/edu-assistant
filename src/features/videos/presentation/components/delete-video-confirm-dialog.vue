<template>
  <Dialog :open="isOpen" @update:open="emit('update:isOpen', $event)">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle class="video-display-serif text-xl">Eliminar video</DialogTitle>
        <DialogDescription>
          Esta acción eliminará el video, su transcripción y todo el contenido generado. No se puede deshacer.
        </DialogDescription>
      </DialogHeader>
      <p v-if="title" class="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm">
        <span class="text-xs uppercase tracking-widest text-muted-foreground mr-2">Video</span>
        <span class="video-display-serif font-semibold text-foreground">{{ title }}</span>
      </p>
      <DialogFooter>
        <Button type="button" variant="ghost" :disabled="isSubmitting" @click="emit('update:isOpen', false)">
          Cancelar
        </Button>
        <Button
          type="button"
          variant="destructive"
          :disabled="isSubmitting"
          @click="emit('confirm')"
        >
          <Loader2 v-if="isSubmitting" class="size-4 animate-spin mr-2" />
          {{ isSubmitting ? 'Eliminando...' : 'Eliminar definitivamente' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-vue-next'

defineProps<{ isOpen: boolean; isSubmitting: boolean; title?: string }>()
const emit = defineEmits<{ 'update:isOpen': [v: boolean]; confirm: [] }>()
</script>
