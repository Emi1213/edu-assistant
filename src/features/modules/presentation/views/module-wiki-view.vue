<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, BookOpen, Users, Plus } from 'lucide-vue-next'
import { useModule } from '../../composables/queries/use-module'
import { usePagesTable } from '@/features/pages/composables/use-pages-table'
import { usePagesList } from '@/features/pages/composables/use-pages-list'
import { useRoles } from '@/features/auth/composables/use-roles'
import { useExtractRelations } from '@/features/content-generation/composables/mutations/use-extract-relations'
import { useToast } from '@/shared/composables/use-toast'
import { toFullAssetUrl } from '@/shared/utils/image.utils'
import PageCard from '@/features/pages/presentation/components/page-card.vue'
import CreatePageDialog from '@/features/pages/presentation/components/create-page-dialog.vue'
import UpdatePageDialog from '@/features/pages/presentation/components/update-page-dialog.vue'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
import type { Page } from '@/features/pages/types'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const moduleId = computed(() => Number(route.params.id))

const { data: module, isLoading: isLoadingModule } = useModule(moduleId.value)
const { canEdit } = useRoles()

const { pages, isLoadingPages } = usePagesTable(moduleId)

const {
  isDialogOpen,
  pageTitle,
  isPublished,
  isCreating,
  openDialog,
  closeDialog,
  handleCreate,
  pageToUpdate,
  openUpdatePage,
  closeUpdatePage,
} = usePagesList(moduleId.value)

const { mutate: extractRelations } = useExtractRelations()
const generatingRelationsPageId = ref<number | null>(null)

const goBack = () => {
  router.push('/modules')
}

const handleGenerateRelations = (page: Page) => {
  generatingRelationsPageId.value = page.id
  extractRelations(
    { pageId: page.id },
    {
      onSuccess: (data) => {
        generatingRelationsPageId.value = null
        const relations = data?.relations ?? []
        try {
          sessionStorage.setItem(`page-relations-${page.id}`, JSON.stringify(relations))
        } catch {
          /* ignore */
        }
        router.push({
          path: `/modules/${moduleId.value}/pages/${page.id}/edit`,
          query: { applyRelations: '1' },
          state: { relations } as Record<string, unknown> as import('vue-router').HistoryState,
        })
      },
      onError: () => {
        generatingRelationsPageId.value = null
        toast.error('Error al extraer relaciones')
      },
    }
  )
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
    <div class="space-y-4 min-w-0">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 class="text-lg sm:text-xl font-bold text-foreground">Páginas del Módulo</h2>
        <button
          v-if="canEdit()"
          @click="openDialog"
          class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 hover:shadow-md transition-all duration-200 w-full sm:w-auto"
        >
          <Plus class="size-4" />
          <span>Nueva Página</span>
        </button>
      </div>

      <div v-if="isLoadingPages" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="i in 4"
          :key="i"
          class="rounded-lg border border-border bg-card p-5"
        >
          <Skeleton class="h-6 w-3/4 mb-3" />
          <Skeleton class="h-4 w-full mb-2" />
          <Skeleton class="h-4 w-2/3" />
        </div>
      </div>

      <div v-else-if="pages.length === 0" class="rounded-md bg-card px-6 py-12 text-center">
        <p class="text-muted-foreground">No hay páginas disponibles</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PageCard
          v-for="page in pages"
          :key="page.id"
          :page="page"
          :to="{ name: 'page-detail', params: { id: moduleId, pageId: page.id } }"
          :generating-relations-page-id="generatingRelationsPageId"
          :on-update-page="canEdit() ? openUpdatePage : undefined"
          :on-generate-relations="canEdit() ? handleGenerateRelations : undefined"
        />
      </div>
    </div>

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

    <UpdatePageDialog
      v-if="pageToUpdate"
      :key="pageToUpdate.id"
      :visible="true"
      :page="pageToUpdate"
      @close="closeUpdatePage"
    />
  </div>
</template>

