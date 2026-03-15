<script setup lang="ts">
import { Code2, ImageIcon, Lightbulb } from 'lucide-vue-next'
import type { ContentGeneration, ContentGenerationBlock, CodeBlock, ImageSuggestionBlock, TextBlock } from '../../types'

interface Props {
  content: ContentGeneration
}

const props = defineProps<Props>()

const renderBlockContent = (block: ContentGenerationBlock) => {
  switch (block.type) {
    case 'TEXT':
      return (block.content as TextBlock).markdown
    case 'CODE':
      return block.content
    case 'IMAGE_SUGGESTION':
      return block.content
    default:
      return null
  }
}

const isCodeBlock = (block: ContentGenerationBlock): block is ContentGenerationBlock & { content: CodeBlock } => {
  return block.type === 'CODE'
}

const isImageSuggestionBlock = (block: ContentGenerationBlock): block is ContentGenerationBlock & { content: ImageSuggestionBlock } => {
  return block.type === 'IMAGE_SUGGESTION'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="space-y-4">
      <div>
        <h2 class="text-2xl font-bold text-foreground mb-3">
          {{ content.title }}
        </h2>
        
        <div v-if="content.keywords && content.keywords.length > 0" class="flex flex-wrap gap-2">
          <span
            v-for="keyword in content.keywords"
            :key="keyword"
            class="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary"
          >
            {{ keyword }}
          </span>
        </div>
      </div>
    </div>

    <!-- Blocks -->
    <div class="space-y-6">
      <div
        v-for="(block, index) in content.blocks"
        :key="index"
        class="rounded-lg border border-border bg-card overflow-hidden"
      >
        <!-- Text Block -->
        <div v-if="block.type === 'TEXT'" class="p-6">
          <div 
            class="prose prose-sm max-w-none"
            v-html="renderBlockContent(block)"
          />
        </div>

        <!-- Code Block -->
        <div v-else-if="isCodeBlock(block)" class="space-y-0">
          <div class="flex items-center gap-2 px-4 py-3 bg-muted border-b border-border">
            <Code2 class="size-4 text-muted-foreground" />
            <span class="text-sm font-medium text-foreground">
              {{ block.content.language || 'código' }}
            </span>
          </div>
          <pre class="p-4 overflow-x-auto bg-card"><code class="text-sm">{{ block.content.code }}</code></pre>
        </div>

        <!-- Image Suggestion Block -->
        <div v-else-if="isImageSuggestionBlock(block)" class="p-6">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <ImageIcon class="size-6 text-primary" />
            </div>
            <div class="flex-1 space-y-2">
              <div class="flex items-center gap-2">
                <Lightbulb class="size-4 text-primary" />
                <h4 class="text-sm font-semibold text-foreground">Sugerencia de Imagen</h4>
              </div>
              <p class="text-sm text-muted-foreground">
                <span class="font-medium text-foreground">Prompt:</span> {{ block.content.prompt }}
              </p>
              <p class="text-sm text-muted-foreground">
                <span class="font-medium text-foreground">Razón:</span> {{ block.content.reason }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prose :deep(h1) {
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 700;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  color: var(--foreground);
}

.prose :deep(h2) {
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 700;
  margin-top: 1.25rem;
  margin-bottom: 0.75rem;
  color: var(--foreground);
}

.prose :deep(h3) {
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: var(--foreground);
}

.prose :deep(p) {
  margin-bottom: 1rem;
  color: var(--foreground);
  line-height: 1.625;
}

.prose :deep(ul),
.prose :deep(ol) {
  margin-bottom: 1rem;
  margin-left: 1.5rem;
  color: var(--foreground);
}

.prose :deep(ul) {
  list-style-type: disc;
}

.prose :deep(ol) {
  list-style-type: decimal;
}

.prose :deep(li) {
  margin-bottom: 0.5rem;
}

.prose :deep(code) {
  background-color: var(--muted);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  color: var(--foreground);
}

.prose :deep(pre) {
  background-color: var(--muted);
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.prose :deep(pre code) {
  background-color: transparent;
  padding: 0;
}

.prose :deep(blockquote) {
  border-left-width: 4px;
  border-color: var(--primary);
  padding-left: 1rem;
  font-style: italic;
  margin-top: 1rem;
  margin-bottom: 1rem;
  color: var(--muted-foreground);
}

.prose :deep(strong) {
  font-weight: 600;
  color: var(--foreground);
}

.prose :deep(em) {
  font-style: italic;
}

.prose :deep(a) {
  color: var(--primary);
  text-decoration: underline;
}

.prose :deep(a:hover) {
  color: var(--primary);
  opacity: 0.8;
}
</style>
