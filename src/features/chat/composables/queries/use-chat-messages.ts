import { useQuery } from '@tanstack/vue-query'
import { chatService } from '../../services/chat.service'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import { computed, type Ref, unref } from 'vue'

export function useChatMessages(sessionId: number | Ref<number>) {
  const query = useQuery({
    queryKey: computed(() => QUERY_KEYS.CHAT_MESSAGES(unref(sessionId))),
    queryFn: () => chatService.listMessages(unref(sessionId)),
  })

  return query
}
