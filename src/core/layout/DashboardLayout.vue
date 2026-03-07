<script setup lang="ts">
import TopNav from './TopNav.vue'
</script>

<template>
  <div class="flex min-h-svh w-full flex-col bg-background">
    <TopNav />
    <main class="flex flex-1 flex-col gap-4 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
      <RouterView />
    </main>
  </div>
</template>
