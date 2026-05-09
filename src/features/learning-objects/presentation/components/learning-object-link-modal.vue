<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { toRefs, type Ref, computed } from 'vue'
import { useLearningObjectEditorLinkModal } from '../../composables/editor/use-learning-object-editor-learning-object-link-modal'
import { Search, Loader2 } from 'lucide-vue-next'

interface Props {
  editor: Editor | undefined
  learningObjectId: number
  moduleId: number
}

const props = defineProps<Props>()

const { editor, learningObjectId, moduleId } = toRefs(props)

const {
  showPageLinkModal,
  searchQuery,
  pageLinkForm,
  isFetching,
  modulePages,
  openPageLinkModal,
  closePageLinkModal,
  submitPageLink,
} = useLearningObjectEditorLinkModal(
  editor as Ref<Editor | undefined>,
  learningObjectId as Ref<number>,
  moduleId as Ref<number>
)

const selectedPageTitle = computed(() => {
  if (!pageLinkForm.value.targetLearningObjectId) return ''
  return modulePages.value.find(p => p.id === pageLinkForm.value.targetLearningObjectId)?.title || ''
})

defineExpose({
  open: openPageLinkModal
})
</script>

<template>
  <Teleport to="body">
    <div v-if="showPageLinkModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div class="bg-card rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6 animate-scale-in border border-border">
        <h3 class="text-xl font-bold mb-4 text-foreground">Enlazar Objeto de Aprendizaje</h3>
        
        <div class="space-y-4 mb-6">
          <div>
            <label class="block text-sm font-medium mb-1.5 text-foreground">Texto a mostrar</label>
            <input 
              v-model="pageLinkForm.mentionText" 
              placeholder="Ej. Ver más sobre este tema"
              class="w-full p-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" 
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1.5 text-foreground">Buscar objeto de aprendizaje</label>
            <div class="relative">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input 
                v-model="searchQuery" 
                type="text"
                placeholder="Buscar por título..."
                class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <div v-if="isFetching" class="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 class="size-4 animate-spin text-primary" />
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1.5 text-foreground">Seleccionar objeto</label>
            <div class="grid gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
              <button
                v-for="p in modulePages"
                :key="p.id"
                @click="pageLinkForm.targetLearningObjectId = p.id"
                class="flex flex-col items-start p-3 rounded-lg border text-left transition-all hover:border-primary/50 hover:bg-primary/5"
                :class="pageLinkForm.targetLearningObjectId === p.id ? 'border-primary bg-primary/10 ring-1 ring-primary' : 'border-border bg-card'"
              >
                <span class="font-medium text-sm text-foreground">{{ p.title }}</span>
              </button>
              
              <div v-if="modulePages.length === 0 && !isFetching" class="py-8 text-center text-muted-foreground bg-muted/30 rounded-lg">
                No se encontraron objetos de aprendizaje.
              </div>
            </div>
          </div>

          <div v-if="selectedPageTitle" class="p-3 bg-primary/5 rounded-lg border border-primary/20">
            <p class="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wider">Seleccionado:</p>
            <p class="text-sm font-semibold text-primary">{{ selectedPageTitle }}</p>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-8">
          <button 
            @click="closePageLinkModal" 
            class="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all"
          >
            Cancelar
          </button>
          <button
            @click="submitPageLink"
            :disabled="!pageLinkForm.mentionText || !pageLinkForm.targetLearningObjectId"
            class="px-5 py-2 bg-primary text-primary-foreground rounded-lg font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 hover:shadow-lg transition-all"
          >
            Confirmar Enlace
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: var(--muted-foreground);
}
</style>
