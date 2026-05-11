<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePublicLearningObject } from '../../composables/queries/use-public-learning-object'
import PageContentRenderer from '../components/learning-object-content-renderer.vue'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'

const route = useRoute()
const learningObjectId = computed(() => Number(route.params.learningObjectId))

const { data: learningObject, isLoading, isError } = usePublicLearningObject(learningObjectId)
</script>

<template>
  <div class="min-h-svh bg-background text-foreground">
    <header class="border-b border-border bg-card px-4 py-3 sm:px-6">
      <p class="text-xs sm:text-sm text-muted-foreground">
        Vista pública · Cualquier persona con este enlace puede leer esta página.
      </p>
    </header>

    <main class="mx-auto max-w-[min(100%,1200px)] px-4 py-6 sm:px-6 sm:py-8 min-w-0">
      <div v-if="isLoading" class="space-y-4">
        <Skeleton class="h-10 w-3/4" />
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-2/3" />
      </div>

      <div v-else-if="learningObject" class="wiki-page">
        <div class="page-header">
          <h1 class="page-title text-xl sm:text-2xl lg:text-3xl break-words">
            {{ learningObject.title }}
          </h1>
          <div v-if="learningObject.keywords?.length" class="flex flex-wrap gap-2 mt-3">
            <span v-for="keyword in learningObject.keywords" :key="keyword" class="keyword-badge">
              {{ keyword }}
            </span>
          </div>
        </div>
        <div class="page-content-wrapper">
          <PageContentRenderer :learning-object="learningObject" internal-link-mode="public" />
        </div>
      </div>

      <div v-else class="rounded-md bg-card px-6 py-12 text-center">
        <p class="text-muted-foreground">
          {{ isError ? 'No se pudo cargar el contenido.' : 'Página no encontrada o no disponible.' }}
        </p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.wiki-page {
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
}

.page-header {
  background-color: var(--card);
  padding: 2rem 2rem 1.5rem;
  border-radius: 0;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.875rem;
  line-height: 1.2;
  font-weight: 700;
  color: var(--foreground);
  letter-spacing: -0.02em;
}

@media (min-width: 1024px) {
  .page-title {
    font-size: 3rem;
  }
}

.keyword-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.8125rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  background-color: var(--muted);
  color: var(--muted-foreground);
}

.page-content-wrapper {
  background-color: transparent;
  padding: 0 0.25rem 0.5rem;
}
</style>
