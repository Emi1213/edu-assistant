<template>
  <div class="p-6">
    Video detail placeholder — module {{ moduleId }} · video {{ learningObjectId }}
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const moduleId = computed(() => Number(route.params.id))
const learningObjectId = computed(() => Number(route.params.learningObjectId))
</script>
