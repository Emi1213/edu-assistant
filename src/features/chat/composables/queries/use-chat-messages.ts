import { useQuery } from '@tanstack/vue-query'
import { chatService } from '../../services/chat.service'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import { computed } from 'vue'

export function useChatMessages(sessionId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.CHAT_MESSAGES(sessionId),
    queryFn: () => chatService.listMessages(sessionId),
    enabled: computed(() => !!sessionId),
  })
}
