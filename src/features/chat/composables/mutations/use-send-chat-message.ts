import { useMutation } from '@tanstack/vue-query'
import { chatService } from '../../services/chat.service'
import type { SendMessagePayload } from '../../types'
import { unref, type Ref } from 'vue'

export function useSendChatMessage(sessionId: number | Ref<number | undefined>) {
  return useMutation({
    mutationFn: (payload: SendMessagePayload) => {
      return chatService.sendMessage(unref(sessionId) as number, payload)
    },
  })
}
