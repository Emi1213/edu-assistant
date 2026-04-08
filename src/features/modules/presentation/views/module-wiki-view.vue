<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, BookOpen, Users } from 'lucide-vue-next'
import { useModule } from '../../composables/queries/use-module'
import { useRoles } from '@/features/auth/composables/use-roles'
import { usePageCreator } from '@/features/pages/composables/use-page-creator'
import { useLearningObjectTypes } from '@/features/learning-objects/composables/queries/use-learning-object-types'
import { toFullAssetUrl } from '@/shared/utils/image.utils'
import CreatePageDialog from '@/features/pages/presentation/components/create-page-dialog.vue'
import LearningObjectsTabs from '@/features/learning-objects/presentation/components/learning-objects-tabs.vue'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'

const route = useRoute()
const router = useRouter()
const moduleId = computed(() => Number(route.params.id))

const { data: module, isLoading: isLoadingModule } = useModule(moduleId.value)
const { canEdit } = useRoles()

const { data: typesData } = useLearningObjectTypes()

const types = computed(() => typesData.value ?? [])

const {
  isDialogOpen,
  pageTitle,
  isPublished,
  isCreating,
  openDialog,
  closeDialog,
  handleCreate,
} = usePageCreator(moduleId.value)

const goBack = () => {
  router.push('/modules')
}
</script>

<template>
  <div class="space-y-6 pt-4 sm:pt-8 min-w-0">
    <button
      @click="goBack"
      class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 hover:shadow-md transition-all duration-200 w-full sm:w-auto"
    >
      <ArrowLeft class="size-4 shrink-0" />
      <span>Volver a Mis Módulos</span>
    </button>

    <div v-if="isLoadingModule" class="rounded-lg border border-border bg-card p-4 sm:p-6">
      <div class="flex items-start gap-4">
        <Skeleton class="w-16 h-16 sm:w-20 sm:h-20 rounded-lg shrink-0" />
        <div class="flex-1 space-y-3">
          <Skeleton class="h-8 w-3/4" />
          <Skeleton class="h-4 w-full" />
          <Skeleton class="h-4 w-2/3" />
        </div>
      </div>
    </div>

    <div v-else-if="module" class="rounded-lg border border-border bg-card p-4 sm:p-6">
      <div class="flex flex-col sm:flex-row sm:items-start gap-4">
        <div class="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-[#233a83] flex items-center justify-center overflow-hidden">
          <img
            v-if="module.logoUrl"
            :src="toFullAssetUrl(module.logoUrl)"
            :alt="module.title"
            class="w-full h-full object-cover"
          />
          <BookOpen v-else class="size-8 sm:size-10 text-white" />
        </div>
        <div class="flex-1 min-w-0">
          <h1 class="text-xl sm:text-2xl font-bold text-card-foreground mb-2 break-words">
            {{ module.title }}
          </h1>
          <p v-if="module.description" class="text-sm sm:text-base text-muted-foreground mb-4 break-words">
            {{ module.description }}
          </p>
          <div v-if="canEdit()" class="flex flex-wrap items-center gap-3">
            <router-link
              :to="{ name: 'module-students', params: { id: module.id } }"
              class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Users class="size-4" />
              Inscribir estudiantes
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <LearningObjectsTabs
      :types="types"
      :can-edit="canEdit()"
      :module-id="moduleId"
      @create="(typeId) => openDialog(typeId)"
    />

    <CreatePageDialog
      :visible="isDialogOpen"
      :title="pageTitle"
      :is-published="isPublished"
      :is-creating="isCreating"
      @update:title="pageTitle = $event"
      @update:is-published="isPublished = $event"
      @close="closeDialog"
      @create="handleCreate"
    />
  </div>
</template>
