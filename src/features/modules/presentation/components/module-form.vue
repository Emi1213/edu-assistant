<script setup lang="ts">
import { computed } from 'vue'
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
  ToneLabels
} from '../../constants/modules.constants'
import type { CreateModule, Module, UpdateModule } from '../../types/modules.types'

const props = defineProps<{
  onSubmit: (data: CreateModule | UpdateModule) => Promise<void>
  onCancel?: () => void
  initialData?: Partial<CreateModule> | Partial<Module>
}>()

const { formData, errors, loading, handleSubmit, validateField } =
  useModuleForm(props.initialData)

const learningObjectivesText = computed(() => {
  return formData.aiConfiguration.learningObjectives?.join('\n') || ''
})

const handleLearningObjectivesInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement
  const value = target.value
  formData.aiConfiguration.learningObjectives = value
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
}
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
      <label for="logoUrl" class="block text-sm font-medium mb-2 text-foreground">
        URL del Logo
      </label>
      <Input
        id="logoUrl"
        v-model="formData.logoUrl"
        placeholder="https://example.com/logo.png"
        type="url"
      />
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

    <div class="space-y-3 pt-4 border-t">
      <h4 class="text-sm font-semibold text-foreground">Configuración de IA</h4>
      
      <div>
        <label for="language" class="block text-sm font-medium mb-2 text-foreground">
          Idioma
        </label>
        <Input
          id="language"
          v-model="formData.aiConfiguration.language"
          placeholder="es"
        />
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
        <label for="learningObjectives" class="block text-sm font-medium mb-2 text-foreground">
          Objetivos de Aprendizaje
        </label>
        <textarea
          id="learningObjectives"
          :value="learningObjectivesText"
          @input="handleLearningObjectivesInput"
          placeholder="Ingrese un objetivo por línea"
          :class="[
            'flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50',
          ]"
          rows="4"
        />
        <p class="text-xs text-muted-foreground mt-1">
          Ingrese un objetivo de aprendizaje por línea
        </p>
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
