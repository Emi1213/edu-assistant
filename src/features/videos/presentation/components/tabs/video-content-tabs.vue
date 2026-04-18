<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between border-b">
      <nav class="flex gap-2">
        <button
          v-for="tab in tabs"
          :key="tab"
          type="button"
          class="px-3 py-2 text-sm font-medium border-b-2 -mb-px"
          :class="active === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'"
          @click="active = tab"
        >
          {{ BLOCK_TAB_LABELS[tab] }}
        </button>
      </nav>
      <div v-if="canEdit" class="pb-2 flex gap-2">
        <button
          type="button"
          class="px-2 py-1 text-xs rounded border bg-background hover:bg-muted inline-flex items-center gap-1"
          @click="emit('regenerate-tab', active)"
        >
          <RefreshCw class="w-3 h-3" />
          Regenerar
        </button>
      </div>
    </div>

    <SummaryTab v-if="active === 'SUMMARY' && summary" :content="summary" />
    <FlashcardsTab v-else-if="active === 'FLASHCARDS' && flashcards" :content="flashcards" />
    <QuizTab v-else-if="active === 'QUIZ' && quiz" :content="quiz" />
    <GlossaryTab v-else-if="active === 'GLOSSARY' && glossary" :content="glossary" />
    <div v-else class="p-6 text-center text-muted-foreground rounded-lg border bg-card">
      Contenido no disponible
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RefreshCw } from 'lucide-vue-next'
import SummaryTab from './summary-tab.vue'
import FlashcardsTab from './flashcards-tab.vue'
import QuizTab from './quiz-tab.vue'
import GlossaryTab from './glossary-tab.vue'
import { BLOCK_TAB_LABELS } from '../../../constants/video-labels.constants'
import { VIDEO_BLOCK_TYPES } from '../../../constants/video-block-type.constants'
import {
  isFlashcardsBlock,
  isGlossaryBlock,
  isQuizBlock,
  isSummaryBlock,
  type VideoBlock,
  type VideoBlockType,
} from '../../../types/video-block.types'

const props = defineProps<{ blocks: VideoBlock[]; canEdit: boolean }>()

const emit = defineEmits<{ 'regenerate-tab': [type: VideoBlockType] }>()

const tabs = VIDEO_BLOCK_TYPES
const active = ref<VideoBlockType>('SUMMARY')

const summary = computed(() => props.blocks.find(isSummaryBlock)?.content ?? null)
const flashcards = computed(() => props.blocks.find(isFlashcardsBlock)?.content ?? null)
const quiz = computed(() => props.blocks.find(isQuizBlock)?.content ?? null)
const glossary = computed(() => props.blocks.find(isGlossaryBlock)?.content ?? null)
</script>
