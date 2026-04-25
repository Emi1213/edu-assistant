<script setup lang="ts">
import { ref } from 'vue'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Sparkles, Loader2 } from 'lucide-vue-next'

const { open, isLoading } = defineProps<{
  open: boolean
  isLoading: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'regenerate', instructions: string): void
}>()

const instructions = ref('')

const handleRegenerate = () => {
  emit('regenerate', instructions.value)
}
</script>

<template>
  <Dialog :open="open" @update:open="(val) => emit('update:open', val)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Regenerar Contenido con IA</DialogTitle>
        <DialogDescription>
          Ingresa instrucciones específicas para que la IA mejore el contenido.
        </DialogDescription>
      </DialogHeader>
      
      <div class="py-4">
        <textarea
          v-model="instructions"
          class="w-full min-h-[120px] p-3 border rounded-md"
          placeholder="Ej. Enfócate más en ejemplos prácticos, simplifica el lenguaje..."
        ></textarea>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="emit('update:open', false)">Cancelar</Button>
        <Button :disabled="isLoading || !instructions.trim()" @click="handleRegenerate" class="flex items-center gap-2">
          <Loader2 v-if="isLoading" class="size-4 animate-spin" />
          <Sparkles v-else class="size-4" />
          {{ isLoading ? 'Regenerando...' : 'Regenerar Contenido' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
