<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Settings, Bot, Mail, Plus, Trash2, Loader2, Save } from 'lucide-vue-next'
import { useAiConfig } from '../../composables/use-ai-config'
import { useTeachersEmails } from '../../composables/use-teachers-emails'
import { useToast } from '@/shared/composables/use-toast'

const toast = useToast()

const {
  configQuery,
  modelsResponsesQuery,
  modelsEmbeddingsQuery,
  modelsImagesQuery,
  updateMutation: updateAiConfig,
} = useAiConfig()

const { emailsQuery, updateMutation: updateEmails } = useTeachersEmails()

const responsesModel = ref('')
const embeddingsModel = ref('')
const imagesModel = ref('')
const emailsList = ref<string[]>([])
const newEmail = ref('')

watch(
  () => configQuery.data.value,
  (data) => {
    if (data) {
      responsesModel.value = data.responses
      embeddingsModel.value = data.embeddings
      imagesModel.value = data.images
    }
  },
  { immediate: true }
)

watch(
  () => emailsQuery.data.value,
  (data) => {
    emailsList.value = data ? [...data] : []
  },
  { immediate: true }
)

const canSaveAiConfig = computed(() => {
  const c = configQuery.data.value
  if (!c) return false
  return (
    responsesModel.value !== c.responses ||
    embeddingsModel.value !== c.embeddings ||
    imagesModel.value !== c.images
  )
})

const saveAiConfig = () => {
  updateAiConfig.mutate(
    {
      responses: responsesModel.value,
      embeddings: embeddingsModel.value,
      images: imagesModel.value,
    },
    {
      onSuccess: () => toast.success('Configuración de IA guardada'),
      onError: (e) => toast.error(e instanceof Error ? e.message : 'Error al guardar'),
    }
  )
}

const addEmail = () => {
  const email = newEmail.value.trim().toLowerCase()
  if (!email) return
  if (emailsList.value.includes(email)) {
    toast.warning('Ese correo ya está en la lista')
    return
  }
  emailsList.value = [...emailsList.value, email]
  newEmail.value = ''
}

const removeEmail = (index: number) => {
  emailsList.value = emailsList.value.filter((_, i) => i !== index)
}

const canSaveEmails = computed(() => {
  const current = emailsQuery.data.value ?? []
  if (emailsList.value.length !== current.length) return true
  const sortedCurrent = [...current].sort()
  const sortedNew = [...emailsList.value].sort()
  return sortedCurrent.some((e, i) => e !== sortedNew[i])
})

const saveEmails = () => {
  updateEmails.mutate(emailsList.value, {
    onSuccess: () => toast.success('Correos de profesores guardados'),
    onError: (e) => toast.error(e instanceof Error ? e.message : 'Error al guardar'),
  })
}
</script>

<template>
  <div class="space-y-8 max-w-3xl">
    <div class="flex items-center gap-2">
      <Settings class="size-6 text-primary" />
      <h1 class="text-2xl font-bold text-foreground">Configuración (Admin)</h1>
    </div>

    <!-- Configuración IA -->
    <section class="rounded-lg border border-border bg-card p-6">
      <div class="flex items-center gap-2 mb-4">
        <Bot class="size-5 text-primary" />
        <h2 class="text-lg font-semibold text-foreground">Modelos de IA</h2>
      </div>
      <p class="text-sm text-muted-foreground mb-4">
        Modelos usados para respuestas, embeddings e imágenes. Los cambios se guardan en memoria (se pierden al reiniciar el servidor).
      </p>

      <div v-if="configQuery.isLoading.value" class="text-sm text-muted-foreground">
        Cargando...
      </div>
      <div v-else-if="configQuery.error.value" class="text-sm text-destructive">
        Error al cargar la configuración.
      </div>
      <div v-else class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-foreground mb-1">Respuestas / Chat</label>
          <select
            v-model="responsesModel"
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            :disabled="modelsResponsesQuery.isLoading.value"
          >
            <option
              v-for="m in (modelsResponsesQuery.data.value ?? [])"
              :key="m"
              :value="m"
            >
              {{ m }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-foreground mb-1">Embeddings</label>
          <select
            v-model="embeddingsModel"
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            :disabled="modelsEmbeddingsQuery.isLoading.value"
          >
            <option
              v-for="m in (modelsEmbeddingsQuery.data.value ?? [])"
              :key="m"
              :value="m"
            >
              {{ m }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-foreground mb-1">Imágenes</label>
          <select
            v-model="imagesModel"
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            :disabled="modelsImagesQuery.isLoading.value"
          >
            <option
              v-for="m in (modelsImagesQuery.data.value ?? [])"
              :key="m"
              :value="m"
            >
              {{ m }}
            </option>
          </select>
        </div>
        <button
          type="button"
          @click="saveAiConfig"
          :disabled="!canSaveAiConfig || updateAiConfig.isPending.value"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          <Loader2 v-if="updateAiConfig.isPending.value" class="size-4 animate-spin" />
          <Save v-else class="size-4" />
          Guardar configuración IA
        </button>
      </div>
    </section>

    <!-- Correos de profesores -->
    <section class="rounded-lg border border-border bg-card p-6">
      <div class="flex items-center gap-2 mb-4">
        <Mail class="size-5 text-primary" />
        <h2 class="text-lg font-semibold text-foreground">Correos como profesor</h2>
      </div>
      <p class="text-sm text-muted-foreground mb-4">
        Los correos que agregues aquí serán tratados con rol de profesor al autenticarse. Solo se guarda la lista de correos (no se obtienen usuarios de la app).
      </p>

      <div v-if="emailsQuery.isLoading.value" class="text-sm text-muted-foreground">
        Cargando...
      </div>
      <div v-else-if="emailsQuery.error.value" class="text-sm text-destructive">
        Error al cargar los correos.
      </div>
      <div v-else class="space-y-4">
        <div class="flex gap-2">
          <input
            v-model="newEmail"
            type="email"
            placeholder="correo@ejemplo.com"
            class="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
            @keydown.enter.prevent="addEmail"
          />
          <button
            type="button"
            @click="addEmail"
            class="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-muted hover:bg-muted/80 rounded-lg"
          >
            <Plus class="size-4" />
            Agregar
          </button>
        </div>
        <ul v-if="emailsList.length > 0" class="space-y-2">
          <li
            v-for="(email, index) in emailsList"
            :key="email"
            class="flex items-center justify-between rounded-md border border-border bg-muted/30 px-3 py-2 text-sm"
          >
            <span class="text-foreground">{{ email }}</span>
            <button
              type="button"
              @click="removeEmail(index)"
              class="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded"
              title="Quitar"
            >
              <Trash2 class="size-4" />
            </button>
          </li>
        </ul>
        <p v-else class="text-sm text-muted-foreground">
          No hay correos configurados. Agrega al menos uno para que se traten como profesores.
        </p>
        <button
          type="button"
          @click="saveEmails"
          :disabled="!canSaveEmails || updateEmails.isPending.value"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          <Loader2 v-if="updateEmails.isPending.value" class="size-4 animate-spin" />
          <Save v-else class="size-4" />
          Guardar correos de profesores
        </button>
      </div>
    </section>
  </div>
</template>
