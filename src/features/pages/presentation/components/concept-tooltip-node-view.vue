<script setup lang="ts">
import { NodeViewWrapper } from '@tiptap/vue-3'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

defineProps<{
  node: { attrs: { term?: string; definition?: string } }
}>()
</script>

<template>
  <NodeViewWrapper as="span" class="concept-term-inline">
    <Tooltip>
      <TooltipTrigger as-child>
        <span class="concept-term">{{ node.attrs.term ?? '' }}</span>
      </TooltipTrigger>
      <TooltipContent class="max-w-sm">
        {{ node.attrs.definition || 'Sin definición' }}
      </TooltipContent>
    </Tooltip>
  </NodeViewWrapper>
</template>

<style scoped>
.concept-term-inline {
  display: inline;
}

.concept-term {
  border-bottom: 1px dotted var(--primary);
  cursor: help;
}
</style>
