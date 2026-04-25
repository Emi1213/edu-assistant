<template>
  <Dialog :open="isOpen" @update:open="onOpenChange">
    <DialogContent class="sm:max-w-[560px]">
      <DialogHeader>
        <DialogTitle>Crear Nuevo Video</DialogTitle>
        <DialogDescription>
          Agregá un video desde YouTube o subí un archivo.
        </DialogDescription>
      </DialogHeader>

      <form class="space-y-4" @submit.prevent="onSubmit">
        <div class="grid gap-2">
          <Label for="video-title">Título *</Label>
          <Input
            id="video-title"
            :model-value="title"
            @update:model-value="(e: string | number) => (title = typeof e === 'string' ? e : String(e))"
            placeholder="Ej: Introducción a los Algoritmos"
            :disabled="isSubmitting"
          />
          <p v-if="fieldErrors.title" class="text-xs text-destructive">{{ fieldErrors.title }}</p>
        </div>

        <OutputLanguageSelect v-model="outputLanguage" />

        <div>
          <div class="flex gap-2 border-b mb-3">
            <button
              type="button"
              class="px-3 py-2 text-sm font-medium border-b-2 -mb-px"
              :class="activeTab === 'youtube' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'"
              @click="activeTab = 'youtube'"
            >
              YouTube
            </button>
            <button
              type="button"
              class="px-3 py-2 text-sm font-medium border-b-2 -mb-px"
              :class="activeTab === 'upload' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'"
              @click="activeTab = 'upload'"
            >
              Archivo
            </button>
          </div>

          <CreateVideoYoutubeForm
            v-if="activeTab === 'youtube'"
            v-model="youtubeUrl"
            :error="fieldErrors.url"
          />
          <CreateVideoUploadForm
            v-else
            v-model="file"
            :error="fieldErrors.file"
            :progress="uploadProgress"
          />
        </div>
      </form>

      <DialogFooter>
        <Button type="button" variant="ghost" :disabled="isSubmitting" @click="onCancel">
          Cancelar
        </Button>
        <Button type="button" :disabled="isSubmitting" @click="onSubmit">
          <Loader2 v-if="isSubmitting" class="size-4 animate-spin mr-2" />
          {{ isSubmitting ? 'Creando...' : 'Crear Video' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-vue-next'
import OutputLanguageSelect from './output-language-select.vue'
import CreateVideoYoutubeForm from './create-video-youtube-form.vue'
import CreateVideoUploadForm from './create-video-upload-form.vue'
import { useVideoCreator } from '../../composables/use-video-creator'
import { useCreateVideoFromUrl } from '../../composables/use-create-video-from-url'
import { useUploadVideoFile } from '../../composables/use-upload-video-file'
import { createVideoFromUrlSchema } from '../../validation/create-video-from-url.schema'
import { uploadVideoFileSchema } from '../../validation/upload-video-file.schema'

const props = defineProps<{ moduleId: number; isOpen: boolean }>()
const emit = defineEmits<{ 'update:isOpen': [value: boolean]; created: [] }>()

const creator = useVideoCreator()
const { activeTab, title, outputLanguage, youtubeUrl, file, reset } = creator

const createFromUrl = useCreateVideoFromUrl()
const uploadFile = useUploadVideoFile()
const uploadProgress = uploadFile.progress

const fieldErrors = ref<{ title?: string; url?: string; file?: string }>({})
const isSubmitting = ref(false)

watch(
  () => props.isOpen,
  (v) => {
    if (v) {
      reset()
      fieldErrors.value = {}
    }
  },
)

function onOpenChange(v: boolean) {
  emit('update:isOpen', v)
}

function onCancel() {
  emit('update:isOpen', false)
}

async function onSubmit() {
  fieldErrors.value = {}
  isSubmitting.value = true
  try {
    if (activeTab.value === 'youtube') {
      const parsed = createVideoFromUrlSchema.safeParse({
        moduleId: props.moduleId,
        title: title.value,
        url: youtubeUrl.value,
        outputLanguage: outputLanguage.value,
      })
      if (!parsed.success) {
        const flat = parsed.error.flatten().fieldErrors
        fieldErrors.value = {
          title: flat.title?.[0],
          url: flat.url?.[0],
        }
        return
      }
      await createFromUrl.mutateAsync(parsed.data)
    } else {
      if (!file.value) {
        fieldErrors.value = { file: 'Seleccioná un archivo' }
        return
      }
      const parsed = uploadVideoFileSchema.safeParse({
        moduleId: props.moduleId,
        title: title.value,
        outputLanguage: outputLanguage.value,
        file: file.value,
      })
      if (!parsed.success) {
        const flat = parsed.error.flatten().fieldErrors
        fieldErrors.value = {
          title: flat.title?.[0],
          file: flat.file?.[0],
        }
        return
      }
      await uploadFile.mutateAsync(parsed.data)
    }
    emit('created')
    emit('update:isOpen', false)
  } finally {
    isSubmitting.value = false
  }
}
</script>
