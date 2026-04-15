<script setup lang="ts">
import { ref, onMounted, computed, nextTick, watch } from 'vue'
import { MessageSquare, Sparkles, X, Send, Loader2, Bot } from 'lucide-vue-next'
import { useCreateChatSession } from '../../composables/mutations/use-create-chat-session'
import { useChatMessages } from '../../composables/queries/use-chat-messages'
import { useSendChatMessage } from '../../composables/mutations/use-send-chat-message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useQueryClient } from '@tanstack/vue-query'
import { QUERY_KEYS } from '@/shared/composables/query-key'

interface Props {
  learningObjectId: number
}

const props = defineProps<Props>()
const emit = defineEmits(['close'])

const queryClient = useQueryClient()
const { mutate: createChatSession, isPending: isStartingSession } = useCreateChatSession(props.learningObjectId)
const sessionId = ref<number | undefined>()
const currentMessage = ref('')
const messagesEndRef = ref<HTMLElement | null>(null)

const { data: messagesResponse } = useChatMessages(sessionId)
const messages = computed(() => messagesResponse.value?.records ?? [])

const { mutate: sendChatMessage, isPending: isSendingMessage } = useSendChatMessage(sessionId.value ?? 0)

const scrollToBottom = async () => {
  await nextTick()
  if (messagesEndRef.value) {
    messagesEndRef.value.scrollIntoView({ behavior: 'smooth' })
  }
}

watch(messages, () => {
  scrollToBottom()
}, { deep: true })

onMounted(() => {
  createChatSession({}, {
    onSuccess: (session) => {
      if (session) {
        sessionId.value = session.id
        scrollToBottom()
      }
    }
  })
})

const handleSendMessage = () => {
  if (!currentMessage.value.trim() || isSendingMessage.value || !sessionId.value) return

  const messageText = currentMessage.value.trim()
  currentMessage.value = ''

  sendChatMessage(
    { message: messageText },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT_MESSAGES(sessionId.value!) })
      },
      onError: () => {
        currentMessage.value = messageText // Restore if failed
      }
    }
  )
}
</script>

<template>
  <div class="chat-panel bg-card border border-border rounded-lg overflow-hidden flex flex-col h-full">
    <div class="flex items-center justify-between p-4 border-b border-border bg-primary/5">
      <div class="flex items-center gap-2">
        <Sparkles class="size-5 text-primary flex-shrink-0" />
        <h3 class="text-lg font-semibold text-foreground">Asistente IA</h3>
      </div>
      <button @click="emit('close')" class="p-2 hover:bg-muted rounded-lg transition-colors md:hidden">
        <X class="size-4 text-muted-foreground" />
      </button>
    </div>
    
    <div v-if="isStartingSession" class="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
      <Loader2 class="size-10 text-primary animate-spin" />
      <p class="text-muted-foreground font-medium">Iniciando sesión con el asistente...</p>
    </div>

    <div v-else-if="sessionId" class="flex-1 flex flex-col min-h-0">
      <!-- Messages List -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-60">
          <div class="size-16 bg-primary/10 rounded-full flex items-center justify-center">
            <MessageSquare class="size-8 text-primary" />
          </div>
          <div>
            <h4 class="font-medium text-foreground">¿En qué puedo ayudarte?</h4>
            <p class="text-sm text-muted-foreground mt-1">
              Preguntame cualquier duda sobre el contenido de este tema.
            </p>
          </div>
        </div>

        <div 
          v-for="msg in messages" 
          :key="msg.id" 
          :class="['flex gap-3 max-w-[85%]', msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto']"
        >
          <div :class="['size-8 rounded-full shrink-0 flex items-center justify-center', msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground']">
            <Bot v-if="msg.role === 'assistant'" class="size-4" />
            <span v-else class="text-xs font-bold">U</span>
          </div>
          <div :class="['rounded-2xl px-4 py-2 text-sm shadow-sm', msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-muted text-foreground rounded-tl-none']">
            <p class="whitespace-pre-wrap">{{ msg.content }}</p>
            <span class="text-[10px] opacity-50 mt-1 block">{{ new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span>
          </div>
        </div>

        <div v-if="isSendingMessage" class="flex gap-3 max-w-[85%] mr-auto">
          <div class="size-8 rounded-full shrink-0 flex items-center justify-center bg-muted text-muted-foreground">
            <Bot class="size-4" />
          </div>
          <div class="bg-muted text-foreground rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
            <div class="flex gap-1.5 h-4 items-center px-1">
              <div class="size-1.5 bg-primary/40 rounded-full animate-bounce"></div>
              <div class="size-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div class="size-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        </div>

        <div ref="messagesEndRef" class="h-1"></div>
      </div>

      <!-- Input Area -->
      <div class="p-4 border-t border-border bg-background">
        <form @submit.prevent="handleSendMessage" class="flex gap-2">
          <Input 
            v-model="currentMessage" 
            placeholder="Escribe tu mensaje..." 
            class="flex-1"
            :disabled="isSendingMessage"
          />
          <Button 
            type="submit" 
            size="icon" 
            :disabled="!currentMessage.trim() || isSendingMessage"
          >
            <Send v-if="!isSendingMessage" class="size-4" />
            <Loader2 v-else class="size-4 animate-spin" />
          </Button>
        </form>
      </div>
    </div>

    <div v-else class="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div class="size-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center">
        <X class="size-6" />
      </div>
      <p class="text-muted-foreground">No se pudo iniciar la sesión de chat. Intenta de nuevo.</p>
    </div>
  </div>
</template>

<style scoped>
.chat-panel {
  min-height: 400px;
}
</style>
