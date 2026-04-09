<script setup lang="ts">
defineProps<{

  visible: boolean
  text: string
  overlayStyle: Record<string, string>
}>()
</script>

<template>
  <Teleport to="body">
    <div
      v-show="visible"
      role="tooltip"
      class="concept-definition-hover-layer pointer-events-none rounded-md border border-border bg-popover px-3 py-2 text-left text-sm text-popover-foreground shadow-md"
      :style="overlayStyle"
    >
      {{ text }}
    </div>
  </Teleport>
</template>
