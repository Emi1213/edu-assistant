import { useMutation } from '@tanstack/vue-query'
import { chatService } from '../../services/chat.service'
import type { SendMessagePayload } from '../../types'
import { type Ref, unref } from 'vue'

export function useSendChatMessage(sessionId: Ref<number | undefined> | number) {
  return useMutation({
    mutationFn: (payload: SendMessagePayload) => {
      const id = unref(sessionId)
      if (!id) throw new Error('Session ID is required')
      return chatService.sendMessage(id, payload)
    },
  })
}
