<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import { useModuleForm } from '../../composables/use-module-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  TargetLevel, 
  Audience, 
  ContentLength, 
  Tone,
  TargetLevelLabels,
  AudienceLabels,
  ContentLengthLabels,
  ToneLabels,
  LANGUAGE_OPTIONS,
} from '../../constants/modules.constants'
import type { CreateModule, Module, UpdateModule } from '../../types/modules.types'
import { uploadFile } from '@/shared/services/files.service'
import { useToast } from '@/shared/composables/use-toast'
import { toFullAssetUrl } from '@/shared/utils/image.utils'
import { ImagePlus, Loader2, X } from 'lucide-vue-next'

const props = defineProps<{
  onSubmit: (data: CreateModule | UpdateModule) => Promise<void>
  onCancel?: () => void
  initialData?: Partial<CreateModule> | Partial<Module>
}>()

const toast = useToast()
const { formData, errors, loading, handleSubmit, validateField } =
  useModuleForm(props.initialData)

const fileInputRef = ref<HTMLInputElement | null>(null)
const isUploadingLogo = ref(false)
/** Vista previa local (blob URL) mientras se sube o nada más elegir el archivo */
const logoObjectUrl = ref<string | null>(null)

const logoPreviewUrl = computed(() => {
  if (logoObjectUrl.value) return logoObjectUrl.value
  const url = formData.logoUrl?.trim()
  return url ? toFullAssetUrl(url) : null
})

function openFilePicker() {
  fileInputRef.value?.click()
}

async function onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file || !file.type.startsWith('image/')) {
    toast.error('Selecciona un archivo de imagen válido')
    return
  }
  if (logoObjectUrl.value) {
    URL.revokeObjectURL(logoObjectUrl.value)
    logoObjectUrl.value = null
  }
  logoObjectUrl.value = URL.createObjectURL(file)
  isUploadingLogo.value = true
  input.value = ''
  try {
    const result = await uploadFile(file)
    if (result?.url) {
      formData.logoUrl = result.url
      if (logoObjectUrl.value) {
        URL.revokeObjectURL(logoObjectUrl.value)
        logoObjectUrl.value = null
      }
    } else {
      toast.error('No se pudo subir la imagen')
    }
  } catch (err) {
    toast.error(err instanceof Error ? err.message : 'Error al subir la imagen')
    if (logoObjectUrl.value) {
      URL.revokeObjectURL(logoObjectUrl.value)
      logoObjectUrl.value = null
    }
  } finally {
    isUploadingLogo.value = false
  }
}

function removeLogo() {
  if (logoObjectUrl.value) {
    URL.revokeObjectURL(logoObjectUrl.value)
    logoObjectUrl.value = null
  }
  formData.logoUrl = ''
}

onBeforeUnmount(() => {
  if (logoObjectUrl.value) {
    URL.revokeObjectURL(logoObjectUrl.value)
  }
})
</script>

<template>
  <form @submit.prevent="handleSubmit(props.onSubmit)" class="space-y-4">
    <div>
      <label for="title" class="block text-sm font-medium mb-2 text-foreground">
        Título
      </label>
      <Input
        id="title"
        v-model="formData.title"
        placeholder="Ingrese el título del módulo"
        @blur="() => validateField('title')"
        :class="{ 'border-destructive': errors.title }"
      />
      <p v-if="errors.title" class="text-xs text-destructive mt-1">
        {{ errors.title }}
      </p>
    </div>

    <div>
      <label for="description" class="block text-sm font-medium mb-2 text-foreground">
        Descripción
      </label>
      <textarea
        id="description"
        v-model="formData.description"
        placeholder="Ingrese la descripción del módulo"
        @blur="() => validateField('description')"
        :class="[
          'flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50',
          errors.description ? 'border-destructive' : ''
        ]"
        rows="4"
      />
      <p v-if="errors.description" class="text-xs text-destructive mt-1">
        {{ errors.description }}
      </p>
    </div>

    <div>
      <label class="block text-sm font-medium mb-2 text-foreground">
        Logo del módulo
      </label>
      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        class="sr-only"
        aria-label="Seleccionar imagen"
        @change="onFileSelected"
      />
      <div class="flex flex-wrap items-start gap-4">
        <div
          class="relative flex flex-col items-center justify-center w-28 h-28 rounded-lg border-2 border-dashed border-border bg-muted/50 text-muted-foreground hover:border-primary/50 hover:bg-muted transition-colors cursor-pointer overflow-hidden"
          @click="openFilePicker"
          @keydown.enter.space.prevent="openFilePicker"
          role="button"
          tabindex="0"
          aria-label="Seleccionar imagen para el logo"
        >
          <ImagePlus v-if="!logoPreviewUrl && !isUploadingLogo" class="size-8 mb-1" />
          <Loader2 v-else-if="isUploadingLogo" class="size-8 mb-1 animate-spin" />
          <img
            v-else-if="logoPreviewUrl"
            :src="logoPreviewUrl"
            alt="Vista previa del logo"
            class="absolute inset-0 w-full h-full object-cover rounded-md"
          />
          <span class="relative z-10 text-xs text-center px-1">
            {{ isUploadingLogo ? 'Subiendo...' : logoPreviewUrl ? 'Cambiar' : 'Elegir imagen' }}
          </span>
        </div>
        <div v-if="logoPreviewUrl" class="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            class="text-muted-foreground"
            :disabled="isUploadingLogo"
            @click="removeLogo"
          >
            <X class="size-4 mr-1" />
            Quitar logo
          </Button>
        </div>
      </div>
      <p class="text-xs text-muted-foreground mt-1">
        Se subirá la imagen al servidor y se usará su URL al crear o actualizar el módulo.
      </p>
    </div>

    <div class="flex items-center gap-2">
      <input
        id="isPublic"
        v-model="formData.isPublic"
        type="checkbox"
        class="h-4 w-4 rounded border-input"
      />
      <label for="isPublic" class="text-sm font-medium text-foreground">
        Módulo público
      </label>
    </div>

    <div class="flex items-center gap-2">
      <input
        id="allowSelfEnroll"
        v-model="formData.allowSelfEnroll"
        type="checkbox"
        class="h-4 w-4 rounded border-input"
      />
      <label for="allowSelfEnroll" class="text-sm font-medium text-foreground">
        Permitir auto-inscripción
      </label>
    </div>

    <div class="flex items-center gap-2">
      <input
        id="allowSelfUnenroll"
        v-model="formData.allowSelfUnenroll"
        type="checkbox"
        class="h-4 w-4 rounded border-input"
      />
      <label for="allowSelfUnenroll" class="text-sm font-medium text-foreground">
        Permitir auto-baja
      </label>
    </div>

    <div v-if="initialData" class="flex items-center gap-2">
      <input
        id="isActive"
        v-model="formData.isActive"
        type="checkbox"
        class="h-4 w-4 rounded border-input"
      />
      <label for="isActive" class="text-sm font-medium text-foreground">
        Módulo activo
      </label>
    </div>

    <div class="space-y-3 pt-4 border-t">
      <h4 class="text-sm font-semibold text-foreground">Configuración de IA</h4>
      
      <div>
        <label for="language" class="block text-sm font-medium mb-2 text-foreground">
          Idioma
        </label>
        <select
          id="language"
          v-model="formData.aiConfiguration.language"
          class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <option
            v-for="opt in LANGUAGE_OPTIONS"
            :key="opt.value"
            :value="opt.value"
          >
            {{ opt.label }}
          </option>
        </select>
      </div>

      <div>
        <label for="targetLevel" class="block text-sm font-medium mb-2 text-foreground">
          Nivel objetivo
        </label>
        <select
          id="targetLevel"
          v-model="formData.aiConfiguration.targetLevel"
          class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <option 
            v-for="(label, key) in TargetLevelLabels" 
            :key="key"
            :value="TargetLevel[key as keyof typeof TargetLevel]"
          >
            {{ label }}
          </option>
        </select>
      </div>

      <div>
        <label for="audience" class="block text-sm font-medium mb-2 text-foreground">
          Audiencia
        </label>
        <select
          id="audience"
          v-model="formData.aiConfiguration.audience"
          class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <option 
            v-for="(label, key) in AudienceLabels" 
            :key="key"
            :value="Audience[key as keyof typeof Audience]"
          >
            {{ label }}
          </option>
        </select>
      </div>

      <div>
        <label for="contentLength" class="block text-sm font-medium mb-2 text-foreground">
          Longitud del contenido
        </label>
        <select
          id="contentLength"
          v-model="formData.aiConfiguration.contentLength"
          class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <option 
            v-for="(label, key) in ContentLengthLabels" 
            :key="key"
            :value="ContentLength[key as keyof typeof ContentLength]"
          >
            {{ label }}
          </option>
        </select>
      </div>

      <div>
        <label for="tone" class="block text-sm font-medium mb-2 text-foreground">
          Tono
        </label>
        <select
          id="tone"
          v-model="formData.aiConfiguration.tone"
          class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <option 
            v-for="(label, key) in ToneLabels" 
            :key="key"
            :value="Tone[key as keyof typeof Tone]"
          >
            {{ label }}
          </option>
        </select>
      </div>
    </div>

    <div class="flex justify-end gap-3 pt-4 border-t">
      <Button
        v-if="props.onCancel"
        type="button"
        variant="outline"
        @click="props.onCancel"
        :disabled="loading"
      >
        Cancelar
      </Button>
      <Button type="submit" :disabled="loading">
        {{ loading ? 'Guardando...' : 'Guardar' }}
      </Button>
    </div>
  </form>
</template>
