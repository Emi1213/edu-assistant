import { useMutation } from '@tanstack/vue-query'
import { chatService } from '../../services/chat.service'
import type { SendMessagePayload } from '../../types'

export function useSendChatMessage(sessionId: number) {
  return useMutation({
    mutationFn: (payload: SendMessagePayload) =>
      chatService.sendMessage(sessionId, payload),
  })
}
