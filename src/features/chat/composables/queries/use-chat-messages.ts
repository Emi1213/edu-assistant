import { useQuery } from '@tanstack/vue-query'
import { chatService } from '../../services/chat.service'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import { computed, type Ref } from 'vue'

export function useChatMessages(sessionId: Ref<number | undefined>) {
  const query = useQuery({
    queryKey: computed(() => QUERY_KEYS.CHAT_MESSAGES(sessionId.value ?? 0)),
    queryFn: () => chatService.listMessages(sessionId.value!),
    enabled: computed(() => !!sessionId.value),
  })

  return query
}
