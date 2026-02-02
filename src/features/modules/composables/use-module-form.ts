import { ref, watchEffect } from 'vue'
import { useForm } from '@/shared/composables/use-form'
import { z } from "zod"
import { Audience, ContentLength, TargetLevel, Tone, defaultAiConfiguration } from '../constants/modules.constants'
import type { CreateModule, Module, UpdateModule } from '../types/modules.types'

export const moduleFormSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  isPublic: z.boolean().default(false),
  allowSelfEnroll: z.boolean().default(false),
  logoUrl: z.string().optional().default(''),
  aiConfiguration: z.object({
    language: z.string().min(1, 'El idioma es requerido').default('es'),
    targetLevel: z.nativeEnum(TargetLevel).default(TargetLevel.BASIC),
    audience: z.nativeEnum(Audience).default(Audience.UNIVERSITY),
    learningObjectives: z.array(z.string()).default([]),
    contentLength: z.nativeEnum(ContentLength).default(ContentLength.MEDIUM),
    tone: z.nativeEnum(Tone).default(Tone.EDUCATIONAL),
  }).default(defaultAiConfiguration),
})

export type ModuleFormData = z.infer<typeof moduleFormSchema>

export function useModuleForm(
  initialData?: Partial<CreateModule> | Partial<Module> | Partial<UpdateModule>
) {
  const loading = ref(false)

  const {
    formData,
    errors,
    handleSubmit: originalHandleSubmit,
    validateField,
    resetForm,
  } = useForm<ModuleFormData>(moduleFormSchema, initialData as Partial<ModuleFormData>)

  watchEffect(() => {
    if (!formData.aiConfiguration) {
      formData.aiConfiguration = { ...defaultAiConfiguration }
    }
  })

  const handleSubmit = (
    onValid: (data: CreateModule | UpdateModule) => Promise<void>
  ) => {
    return originalHandleSubmit(async (data: ModuleFormData) => {
      if (loading.value) return
      loading.value = true
      try {
        await onValid(data as CreateModule | UpdateModule)
      } finally {
        loading.value = false
      }
    })
  }

  return {
    formData,
    errors,
    loading,
    handleSubmit,
    validateField,
    resetForm,
  }
}
