<template>
  <div class="space-y-5 min-w-0">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border">
      <nav
        class="flex gap-1 overflow-x-auto scrollbar-none -mb-px flex-nowrap whitespace-nowrap"
        aria-label="Tabs"
      >
        <button
          v-for="tab in tabs"
          :key="tab"
          type="button"
          class="relative px-3 sm:px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors inline-flex items-center gap-1.5 shrink-0"
          :class="active === tab
            ? 'border-[color:var(--accent-ink)] text-[color:var(--accent-ink)]'
            : 'border-transparent text-muted-foreground hover:text-foreground'"
          @click="switchTo(tab)"
        >
          {{ BLOCK_TAB_LABELS[tab] }}
          <span
            v-if="failedTypes.includes(tab)"
            class="inline-block w-2 h-2 rounded-full bg-red-500"
            :aria-label="`${BLOCK_TAB_LABELS[tab]}: error`"
          />
          <span
            v-else-if="needsReviewTypes.includes(tab)"
            class="inline-block w-2 h-2 rounded-full bg-amber-500"
            :aria-label="`${BLOCK_TAB_LABELS[tab]}: revisar`"
          />
        </button>
      </nav>
      <div
        v-if="canEdit && !editingType && hasActiveContent"
        class="pb-2 flex flex-wrap gap-1.5 shrink-0"
      >
        <button
          type="button"
          class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full border border-border bg-background hover:border-[color:var(--accent-ink)] hover:text-[color:var(--accent-ink)] transition-colors"
          @click="enterEdit"
        >
          <PenLine class="w-3 h-3" />
          Editar
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full border border-border bg-background hover:border-[color:var(--accent-ink)] hover:text-[color:var(--accent-ink)] transition-colors"
          @click="emit('regenerate-tab', active)"
        >
          <RefreshCw class="w-3 h-3" />
          Regenerar
        </button>
      </div>
    </div>

    <div class="min-h-[200px] space-y-3 min-w-0">
      <BlockErrorPlaceholder
        v-if="!hasActiveContent && failedTypes.includes(active)"
        :type="active"
        :can-retry="canEdit"
        @retry="(t) => emit('regenerate-tab', t)"
      />

      <template v-else-if="active === 'SUMMARY'">
        <div v-if="!summary" class="p-8 text-center text-muted-foreground rounded-xl border border-dashed border-border bg-card/40">
          Sin resumen
        </div>
        <template v-else>
          <NeedsReviewBanner v-if="isNeedsReview(summary)" />
          <SummaryTabEditor
            v-if="editingType === 'SUMMARY'"
            ref="summaryEditorRef"
            :key="`edit-summary-${editSession}`"
            :content="summary"
          />
          <SummaryTab v-else :content="summary" />
        </template>
      </template>

      <template v-else-if="active === 'FLASHCARDS'">
        <div v-if="!flashcards" class="p-8 text-center text-muted-foreground rounded-xl border border-dashed border-border bg-card/40">
          Sin flashcards
        </div>
        <template v-else>
          <NeedsReviewBanner v-if="isNeedsReview(flashcards)" />
          <FlashcardsTabEditor
            v-if="editingType === 'FLASHCARDS'"
            ref="flashcardsEditorRef"
            :key="`edit-flashcards-${editSession}`"
            :content="flashcards"
          />
          <FlashcardsTab v-else :content="flashcards" />
        </template>
      </template>

      <template v-else-if="active === 'QUIZ'">
        <div v-if="!quiz" class="p-8 text-center text-muted-foreground rounded-xl border border-dashed border-border bg-card/40">
          Sin quiz
        </div>
        <template v-else>
          <NeedsReviewBanner v-if="isNeedsReview(quiz)" />
          <QuizTabEditor
            v-if="editingType === 'QUIZ'"
            ref="quizEditorRef"
            :key="`edit-quiz-${editSession}`"
            :content="quiz"
          />
          <QuizTab v-else :content="quiz" />
        </template>
      </template>

      <template v-else-if="active === 'GLOSSARY'">
        <div v-if="!glossary" class="p-8 text-center text-muted-foreground rounded-xl border border-dashed border-border bg-card/40">
          Sin glosario
        </div>
        <template v-else>
          <NeedsReviewBanner v-if="isNeedsReview(glossary)" />
          <GlossaryTabEditor
            v-if="editingType === 'GLOSSARY'"
            ref="glossaryEditorRef"
            :key="`edit-glossary-${editSession}`"
            :content="glossary"
          />
          <GlossaryTab v-else :content="glossary" />
        </template>
      </template>
    </div>

    <div
      v-if="editingType"
      class="sticky bottom-0 -mx-4 px-4 py-3 rounded-t-2xl border border-border bg-background/95 backdrop-blur-md shadow-[0_-8px_24px_-12px_rgba(23,26,58,0.2)] flex items-center justify-between gap-3 z-10"
    >
      <div class="flex items-center gap-2 text-sm">
        <span
          class="inline-block w-2 h-2 rounded-full"
          :class="isDirty ? 'bg-[color:var(--accent-ink)] animate-pulse' : 'bg-muted-foreground/30'"
        />
        <span :class="isDirty ? 'text-foreground font-semibold' : 'text-muted-foreground'">
          {{ isDirty ? 'Cambios sin guardar' : 'Sin cambios' }}
        </span>
        <span class="text-muted-foreground">·</span>
        <span class="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
          {{ BLOCK_TAB_LABELS[editingType] }}
        </span>
      </div>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="px-3 py-1.5 text-sm font-semibold rounded-full border border-border bg-background hover:bg-muted transition-colors"
          :disabled="isSaving"
          @click="cancelEdit"
        >
          Cancelar
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          :disabled="!isDirty || isSaving"
          @click="saveEdit"
        >
          <Loader2 v-if="isSaving" class="w-3.5 h-3.5 animate-spin" />
          {{ isSaving ? 'Guardando...' : 'Guardar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Loader2, PenLine, RefreshCw } from 'lucide-vue-next'
import SummaryTab from './summary-tab.vue'
import FlashcardsTab from './flashcards-tab.vue'
import QuizTab from './quiz-tab.vue'
import GlossaryTab from './glossary-tab.vue'
import SummaryTabEditor from './summary-tab-editor.vue'
import FlashcardsTabEditor from './flashcards-tab-editor.vue'
import QuizTabEditor from './quiz-tab-editor.vue'
import GlossaryTabEditor from './glossary-tab-editor.vue'
import BlockErrorPlaceholder from './block-error-placeholder.vue'
import NeedsReviewBanner from './needs-review-banner.vue'
import { BLOCK_TAB_LABELS } from '../../../constants/video-labels.constants'
import { VIDEO_BLOCK_TYPES } from '../../../constants/video-block-type.constants'
import { VIDEO_CONTENT_TAB_QUERY_KEY } from '../../../constants/video-content-tabs.constants'
import {
  isFlashcardsBlock,
  isGlossaryBlock,
  isQuizBlock,
  isSummaryBlock,
  needsReview,
  type VideoBlock,
  type VideoBlockContent,
  type VideoBlockType,
} from '../../../types/video-block.types'

interface EditorInstance {
  getDraft: () => VideoBlockContent
  getIsDirty: () => boolean
  validate: () => string | null
}

const props = withDefaults(
  defineProps<{
    blocks: VideoBlock[]
    canEdit: boolean
    isSaving: boolean
    failedTypes?: VideoBlockType[]
  }>(),
  { failedTypes: () => [] },
)

const emit = defineEmits<{
  'regenerate-tab': [type: VideoBlockType]
  save: [args: { type: VideoBlockType; content: VideoBlockContent }]
}>()

const tabs = VIDEO_BLOCK_TYPES

const route = useRoute()
const router = useRouter()

function isVideoBlockType(value: string): value is VideoBlockType {
  return (VIDEO_BLOCK_TYPES as readonly string[]).includes(value)
}

const active = computed<VideoBlockType>(() => {
  const raw = route.query[VIDEO_CONTENT_TAB_QUERY_KEY]
  const value = typeof raw === 'string' ? raw : ''
  return isVideoBlockType(value) ? value : 'SUMMARY'
})

const sortedBlocks = computed(() =>
  [...props.blocks].sort((a, b) => a.orderIndex - b.orderIndex),
)

const editingType = ref<VideoBlockType | null>(null)
const editSession = ref(0)

const summaryEditorRef = shallowRef<EditorInstance | null>(null)
const flashcardsEditorRef = shallowRef<EditorInstance | null>(null)
const quizEditorRef = shallowRef<EditorInstance | null>(null)
const glossaryEditorRef = shallowRef<EditorInstance | null>(null)

const summary = computed(() => sortedBlocks.value.find(isSummaryBlock)?.content ?? null)
const flashcards = computed(() => sortedBlocks.value.find(isFlashcardsBlock)?.content ?? null)
const quiz = computed(() => sortedBlocks.value.find(isQuizBlock)?.content ?? null)
const glossary = computed(() => sortedBlocks.value.find(isGlossaryBlock)?.content ?? null)

const activeContent = computed<VideoBlockContent | null>(() => {
  switch (active.value) {
    case 'SUMMARY':
      return summary.value
    case 'FLASHCARDS':
      return flashcards.value
    case 'QUIZ':
      return quiz.value
    case 'GLOSSARY':
      return glossary.value
    default:
      return null
  }
})

const hasActiveContent = computed(() => activeContent.value !== null)

const needsReviewTypes = computed<VideoBlockType[]>(() =>
  sortedBlocks.value.filter((b) => needsReview(b.content)).map((b) => b.type),
)

function isNeedsReview(content: VideoBlockContent | null | undefined): boolean {
  return needsReview(content)
}

const currentEditor = computed<EditorInstance | null>(() => {
  switch (editingType.value) {
    case 'SUMMARY':
      return summaryEditorRef.value
    case 'FLASHCARDS':
      return flashcardsEditorRef.value
    case 'QUIZ':
      return quizEditorRef.value
    case 'GLOSSARY':
      return glossaryEditorRef.value
    default:
      return null
  }
})

const isDirty = computed(() => currentEditor.value?.getIsDirty() ?? false)

function switchTo(t: VideoBlockType) {
  if (editingType.value && isDirty.value) {
    if (!window.confirm('Hay cambios sin guardar. ¿Descartar y cambiar de tab?')) return
  }
  editingType.value = null
  if (active.value === t) return
  router.replace({
    query: { ...route.query, [VIDEO_CONTENT_TAB_QUERY_KEY]: t },
  })
}

function enterEdit() {
  editSession.value += 1
  editingType.value = active.value
}

function cancelEdit() {
  editingType.value = null
}

function saveEdit() {
  const editor = currentEditor.value
  if (!editor || !editingType.value) return
  const err = editor.validate()
  if (err) {
    window.alert(err)
    return
  }
  const content = editor.getDraft()
  emit('save', { type: editingType.value, content })
}

function exitEdit() {
  editingType.value = null
}

defineExpose({ exitEdit })
</script>
