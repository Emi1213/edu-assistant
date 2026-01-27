<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import { usePage } from '../../composables/queries/use-page'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'

const route = useRoute()
const router = useRouter()
const pageId = computed(() => Number(route.params.pageId))
const moduleId = computed(() => Number(route.params.id))

const { data: page, isLoading } = usePage(pageId.value)

const goBack = () => {
  router.push(`/modules/${moduleId.value}/wiki`)
}
</script>

<template>
  <div class="space-y-6">
    <button
      @click="goBack"
      class="flex items-center gap-2 text-muted-foreground hover:text-card-foreground transition-colors"
    >
      <ArrowLeft class="size-4" />
      <span>Volver al Módulo</span>
    </button>

    <div v-if="isLoading" class="space-y-4">
      <Skeleton class="h-10 w-3/4" />
      <Skeleton class="h-4 w-full" />
      <Skeleton class="h-4 w-full" />
      <Skeleton class="h-4 w-2/3" />
    </div>

    <div v-else-if="page" class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold text-card-foreground mb-4">
          {{ page.title }}
        </h1>
        <div v-if="page.keywords && page.keywords.length > 0" class="flex flex-wrap gap-2 mb-6">
          <span
            v-for="keyword in page.keywords"
            :key="keyword"
            class="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground"
          >
            {{ keyword }}
          </span>
        </div>
      </div>

      <div class="prose prose-slate dark:prose-invert max-w-none">
        <div 
          class="page-content"
          v-html="page.content"
        />
      </div>
    </div>

    <div v-else class="rounded-md bg-card px-6 py-12 text-center">
      <p class="text-muted-foreground">Página no encontrada</p>
    </div>
  </div>
</template>

<style scoped>
.page-content {
  color: var(--foreground);
}

.page-content :deep(h1) {
  font-size: 1.875rem;
  line-height: 2.25rem;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: var(--foreground);
}

.page-content :deep(h2) {
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 700;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: var(--foreground);
}

.page-content :deep(h3) {
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 600;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--foreground);
}

.page-content :deep(h4) {
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: var(--foreground);
}

.page-content :deep(p) {
  font-size: 1rem;
  line-height: 1.75rem;
  margin-bottom: 1rem;
  color: var(--foreground);
  opacity: 0.9;
}

.page-content :deep(ul),
.page-content :deep(ol) {
  margin-bottom: 1rem;
  margin-left: 1.5rem;
}

.page-content :deep(ul) {
  list-style-type: disc;
}

.page-content :deep(ol) {
  list-style-type: decimal;
}

.page-content :deep(li) {
  font-size: 1rem;
  color: var(--foreground);
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.page-content :deep(code) {
  background-color: var(--muted);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  color: var(--foreground);
}

.page-content :deep(pre) {
  background-color: var(--muted);
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.page-content :deep(pre code) {
  background-color: transparent;
  padding: 0;
}

.page-content :deep(blockquote) {
  border-left: 4px solid #C8102E;
  padding-left: 1rem;
  font-style: italic;
  margin: 1rem 0;
  color: var(--muted-foreground);
}

.page-content :deep(a) {
  color: #C8102E;
  text-decoration: underline;
}

.page-content :deep(a:hover) {
  text-decoration: underline;
}

.dark .page-content :deep(a) {
  color: rgb(248 113 113);
}

.page-content :deep(strong) {
  font-weight: 700;
  color: var(--foreground);
}

.page-content :deep(em) {
  font-style: italic;
}

.page-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.page-content :deep(th),
.page-content :deep(td) {
  border: 1px solid var(--border);
  padding: 0.5rem;
  text-align: left;
}

.page-content :deep(th) {
  background-color: var(--muted);
  font-weight: 600;
}

.page-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1rem 0;
}
</style>
