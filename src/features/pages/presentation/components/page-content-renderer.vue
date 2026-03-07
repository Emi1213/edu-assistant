<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { EditorContent } from '@tiptap/vue-3'
import { TooltipProvider } from '@/components/ui/tooltip'
import { usePageContentViewer } from '../../composables/use-page-content-viewer'
import type { Page } from '../../types/pages.types'

interface Props {
  page: Page
}

const props = defineProps<Props>()
const router = useRouter()

function onContentClick(event: MouseEvent) {
  const clicked = event.target as Node
  const el = clicked?.nodeType === Node.ELEMENT_NODE ? (clicked as HTMLElement) : clicked?.parentElement
  const link = el?.closest?.('[data-type="page-link"]')
  if (!link) return
  const pageId = link.getAttribute('data-target-page-id')
  if (!pageId || !props.page.moduleId) return
  event.preventDefault()
  event.stopPropagation()
  const url = `/modules/${props.page.moduleId}/pages/${pageId}`
  if (event.metaKey || event.ctrlKey) {
    window.open(url, '_blank', 'noopener,noreferrer')
  } else {
    router.push(url)
  }
}

const editorContent = computed(() => {
  if (props.page.blocks && props.page.blocks.length > 0) {
    const combinedContent: any = {
      type: 'doc',
      content: [],
    }

    props.page.blocks.forEach((block) => {
      if (block.tipTapContent && block.tipTapContent.content) {
        const filteredContent = block.tipTapContent.content.filter((node: any) =>
          node.type !== 'imageSuggestion'
        )
        combinedContent.content.push(...filteredContent)
      } else if (block.type === 'IMAGE' && block.content && 'src' in block.content) {
        combinedContent.content.push({
          type: 'image',
          attrs: {
            src: (block.content as { src: string; alt?: string }).src,
            alt: (block.content as { src: string; alt?: string }).alt,
          },
        })
      }
    })

    return combinedContent.content.length > 0 ? combinedContent : props.page.content || ''
  }
  
  return props.page.content || ''
})

const { editor } = usePageContentViewer(editorContent)
</script>

<template>
  <TooltipProvider>
    <div class="page-content-renderer" @click.capture="onContentClick">
      <EditorContent v-if="editor" :editor="editor" />
      <div v-else class="text-muted-foreground">
        No hay contenido disponible
      </div>
    </div>
  </TooltipProvider>
</template>

<style scoped>
.page-content-renderer {
  color: var(--foreground);
}

.page-content-renderer :deep(.ProseMirror) {
  outline: none;
  color: var(--foreground);
  padding: 0 1rem;
}

.page-content-renderer :deep(h1) {
  font-size: 2.5rem;
  line-height: 1.3;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: var(--foreground);
}

.page-content-renderer :deep(h1:first-child) {
  margin-top: 0;
}

.page-content-renderer :deep(h2) {
  font-size: 2rem;
  line-height: 1.3;
  font-weight: 700;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: var(--foreground);
}

.page-content-renderer :deep(h3) {
  font-size: 1.625rem;
  line-height: 1.4;
  font-weight: 600;
  margin-top: 1.25rem;
  margin-bottom: 0.625rem;
  color: var(--foreground);
}

.page-content-renderer :deep(h4) {
  font-size: 1.375rem;
  line-height: 1.5;
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: var(--foreground);
}

.page-content-renderer :deep(p) {
  font-size: 1.0625rem;
  line-height: 1.75;
  margin-bottom: 0.75rem;
  color: var(--foreground);
}

.page-content-renderer :deep(p:empty) {
  margin-bottom: 0.25rem;
}

.page-content-renderer :deep(ul),
.page-content-renderer :deep(ol) {
  margin-bottom: 0.75rem;
  margin-left: 2rem;
  line-height: 1.75;
  margin-top: 0.5rem;
}

.page-content-renderer :deep(ul) {
  list-style-type: disc;
}

.page-content-renderer :deep(ol) {
  list-style-type: decimal;
}

.page-content-renderer :deep(li) {
  font-size: 1.0625rem;
  color: var(--foreground);
  margin-bottom: 0.5rem;
  padding-left: 0.5rem;
  line-height: 1.75;
}

.page-content-renderer :deep(li p) {
  margin-bottom: 0.5rem;
}

.page-content-renderer :deep(code) {
  background-color: var(--muted);
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.9375rem;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  color: var(--foreground);
  border: 1px solid var(--border);
}

.page-content-renderer :deep(pre) {
  position: relative;
  background-color: #f6f8fa;
  padding: 3rem 1.5rem 1.5rem;
  border-radius: 0.75rem;
  overflow-x: auto;
  margin: 1rem 0;
  border: 1px solid var(--border);
}

.dark .page-content-renderer :deep(pre) {
  background-color: #161b22;
}

.page-content-renderer :deep(pre code) {
  background-color: transparent;
  border: none;
  padding: 0;
  font-size: 0.875rem;
  line-height: 1.6;
}

.page-content-renderer :deep(pre)::before {
  content: attr(data-language);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--muted-foreground);
  background-color: var(--muted);
  border-bottom: 1px solid var(--border);
  border-radius: 0.75rem 0.75rem 0 0;
  font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
}

.page-content-renderer :deep(blockquote) {
  border-left: 3px solid var(--border);
  padding: 1rem 1.5rem;
  margin: 0.75rem 0;
  background-color: var(--muted);
  border-radius: 0.5rem;
  font-style: italic;
  color: var(--muted-foreground);
}

.page-content-renderer :deep(blockquote p) {
  margin-bottom: 0.5rem;
}

.page-content-renderer :deep(blockquote p:last-child) {
  margin-bottom: 0;
}

.page-content-renderer :deep(strong) {
  font-weight: 700;
  color: var(--foreground);
}

.page-content-renderer :deep(em) {
  font-style: italic;
  color: var(--foreground);
}

.page-content-renderer :deep(a) {
  color: #C8102E;
  text-decoration: underline;
  transition: opacity 0.2s ease;
}

.page-content-renderer :deep(a:hover) {
  opacity: 0.7;
}

.page-content-renderer :deep(hr) {
  margin: 1rem 0;
  border: none;
  height: 1px;
  background-color: var(--border);
}

.page-content-renderer :deep(.concept-term) {
  border-bottom: 1px dotted var(--primary);
  cursor: help;
}

.page-content-renderer :deep(.page-link-term) {
  border-bottom: 1px dotted var(--primary);
  color: var(--primary);
  cursor: pointer;
}

.page-content-renderer :deep(.page-link-term:hover) {
  text-decoration: underline;
}

.page-content-renderer :deep(img) {
  max-width: 100%;
  width: auto;
  height: auto;
  max-height: 360px;
  object-fit: contain;
  border-radius: 8px;
  margin: 1rem auto;
  display: block;
}
</style>
