<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, BookOpen, Users, FileText } from 'lucide-vue-next'
import { useModule } from '../../composables/queries/use-module'
import { usePages } from '@/features/pages/composables/queries/use-pages'
import PageCard from '@/features/pages/presentation/components/page-card.vue'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
import type { Page } from '@/features/pages/types/pages.types'

const route = useRoute()
const router = useRouter()
const moduleId = computed(() => Number(route.params.id))

const { data: module, isLoading: isLoadingModule } = useModule(moduleId.value)

const pageParams = computed(() => ({
  moduleId: moduleId.value,
  page: 1,
  limit: 100,
}))

const { data: pagesResponse, isLoading: isLoadingPages } = usePages(pageParams)

const pages = computed(() => pagesResponse.value?.records || [])

const goBack = () => {
  router.push('/modules')
}

const handlePageClick = (page: Page) => {
  router.push(`/modules/${moduleId.value}/pages/${page.id}`)
}
</script>

<template>
  <div class="space-y-6">
    <button
      @click="goBack"
      class="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
    >
      <ArrowLeft class="size-4" />
      <span>Volver a Mis Módulos</span>
    </button>

    <div v-if="isLoadingModule" class="rounded-lg border border-border bg-card p-6">
      <div class="flex items-start gap-4">
        <Skeleton class="w-20 h-20 rounded-lg" />
        <div class="flex-1 space-y-3">
          <Skeleton class="h-8 w-3/4" />
          <Skeleton class="h-4 w-full" />
          <Skeleton class="h-4 w-2/3" />
        </div>
      </div>
    </div>

    <div v-else-if="module" class="rounded-lg border border-border bg-card p-6">
      <div class="flex items-start gap-4">
        <div class="flex-shrink-0 w-20 h-20 rounded-lg bg-[#C8102E] flex items-center justify-center overflow-hidden">
          <img
            v-if="module.logoUrl"
            :src="module.logoUrl"
            :alt="module.title"
            class="w-full h-full object-cover"
          />
          <BookOpen v-else class="size-10 text-white" />
        </div>
        <div class="flex-1 min-w-0">
          <h1 class="text-2xl font-bold text-card-foreground mb-2">
            {{ module.title }}
          </h1>
          <p v-if="module.description" class="text-muted-foreground mb-4">
            {{ module.description }}
          </p>
          <div class="flex items-center gap-6">
            <div class="flex items-center gap-2 text-sm text-muted-foreground">
              <Users class="size-4" />
              <span>32 estudiantes</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText class="size-4" />
              <span>{{ pages.length }} {{ pages.length === 1 ? 'página' : 'páginas' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pages Section -->
    <div class="space-y-4">
      <h2 class="text-xl font-bold text-foreground">Páginas del Módulo</h2>

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
          :on-click="handlePageClick"
        />
      </div>
    </div>
  </div>
</template>

