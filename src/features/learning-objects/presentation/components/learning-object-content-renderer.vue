<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { EditorContent } from '@tiptap/vue-3'
import { useLearningObjectContentViewer } from '../../composables/content/use-learning-object-content-viewer'
import { useConceptDefinitionHoverTooltip } from '../../composables/use-concept-definition-hover-tooltip'
import ConceptDefinitionHoverLayer from './concept-definition-hover-layer.vue'
import type { LearningObject, LOContentBlock } from '../../types'
import { normalizeTiptapContent } from '../../utils/normalize-tiptap-content'
import { SHARED_LEARNING_OBJECT_ROUTE_NAME } from '../../routes/public-share.routes'

interface Props {
  learningObject: LearningObject
  internalLinkMode?: 'module' | 'public'
}

const props = withDefaults(defineProps<Props>(), {
  internalLinkMode: 'module',
})
const router = useRouter()

function onContentClick(event: MouseEvent) {
  const clicked = event.target as Node
  const el = clicked?.nodeType === Node.ELEMENT_NODE ? (clicked as HTMLElement) : clicked?.parentElement
  const link = el?.closest?.('[data-type="learning-object-link"]')
  if (!link) return
  const learningObjectId = link.getAttribute('data-target-lo-id')
  if (!learningObjectId) return
  if (props.internalLinkMode === 'module' && !props.learningObject.moduleId) return
  event.preventDefault()
  event.stopPropagation()
  if (props.internalLinkMode === 'public') {
    const loc = router.resolve({
      name: SHARED_LEARNING_OBJECT_ROUTE_NAME,
      params: { learningObjectId },
    })
    if (event.metaKey || event.ctrlKey) {
      window.open(loc.href, '_blank', 'noopener,noreferrer')
    } else {
      router.push(loc)
    }
    return
  }
  const url = `/modules/${props.learningObject.moduleId}/learning-objects/${learningObjectId}`
  if (event.metaKey || event.ctrlKey) {
    window.open(url, '_blank', 'noopener,noreferrer')
  } else {
    router.push(url)
  }
}

const editorContent = computed(() => {
  if (props.learningObject.blocks && props.learningObject.blocks.length > 0) {
    const combinedContent: { type: string; content: unknown[] } = {
      type: 'doc',
      content: [],
    }

    props.learningObject.blocks.forEach((block: LOContentBlock) => {
      if (block.type === 'CODE' && block.content && 'code' in block.content) {
        combinedContent.content.push({
          type: 'codeBlock',
          attrs: {
            language:
              ('language' in block.content && typeof block.content.language === 'string'
                ? block.content.language
                : 'plaintext'),
          },
          content: [{ type: 'text', text: block.content.code ?? '' }],
        })
        return
      }

      if (block.tipTapContent && block.tipTapContent.content) {
        const normalizedNodes = normalizeTiptapContent(block.tipTapContent.content)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filteredContent = normalizedNodes.filter((node: any) =>
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

    return combinedContent.content.length > 0 ? combinedContent : props.learningObject.content || ''
  }
  
  return props.learningObject.content || ''
})


const { editor } = useLearningObjectContentViewer(editorContent)

const conceptHoverRoot = ref<HTMLElement | null>(null)
const { visible: conceptTooltipVisible, text: conceptTooltipText, style: conceptTooltipStyle } =
  useConceptDefinitionHoverTooltip(conceptHoverRoot)
</script>

<template>
  <div
    ref="conceptHoverRoot"
    class="learning-object-content-renderer"
    @click.capture="onContentClick"
  >
    <EditorContent v-if="editor" :editor="editor" />
    <div v-else class="text-muted-foreground">
      No hay contenido disponible
    </div>
    <ConceptDefinitionHoverLayer
      :visible="conceptTooltipVisible"
      :text="conceptTooltipText"
      :overlay-style="conceptTooltipStyle"
    />
  </div>
</template>

<style scoped src="./learning-object-content-renderer.css"></style>
