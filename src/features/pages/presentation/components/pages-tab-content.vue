<script setup lang="ts">
import type { LearningObject } from '@/features/learning-objects/types/learning-object.types'
import { useExtractRelations } from '@/features/content-generation/composables/mutations/use-extract-relations'
import { useToast } from '@/shared/composables/use-toast'
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import PageCard from './page-card.vue'
import UpdatePageDialog from './update-page-dialog.vue'
import type { Page } from '../../types'

const props = defineProps<{
  learningObjects: LearningObject[]
  moduleId: number
  canEdit: boolean
}>()

const router = useRouter()
const toast = useToast()

const pages = computed(() => props.learningObjects as Page[])

const pageToUpdate = ref<Page | null>(null)

const openUpdatePage = (page: Page) => {
  pageToUpdate.value = page
}

const closeUpdatePage = () => {
  pageToUpdate.value = null
}

const { mutate: extractRelations } = useExtractRelations()
const generatingRelationsPageId = ref<number | null>(null)

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
          path: `/modules/${props.moduleId}/pages/${page.id}/edit`,
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
  <div class="space-y-4 min-w-0">
    <div v-if="pages.length === 0" class="rounded-md bg-card px-6 py-12 text-center">
      <p class="text-muted-foreground">No hay páginas disponibles</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <PageCard
        v-for="page in pages"
        :key="page.id"
        :page="page"
        :to="{ name: 'page-detail', params: { id: moduleId, pageId: page.id } }"
        :generating-relations-page-id="generatingRelationsPageId"
        :on-update-page="canEdit ? openUpdatePage : undefined"
        :on-generate-relations="canEdit ? handleGenerateRelations : undefined"
      />
    </div>

    <UpdatePageDialog
      v-if="pageToUpdate"
      :key="pageToUpdate.id"
      :visible="true"
      :page="pageToUpdate"
      @close="closeUpdatePage"
    />
  </div>
</template>
