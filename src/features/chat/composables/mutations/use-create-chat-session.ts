import { useMutation } from '@tanstack/vue-query'
import { chatService } from '../../services/chat.service'
import type { CreateOrGetSessionPayload } from '../../types'

export function useCreateChatSession(learningObjectId: number) {
  return useMutation({
    mutationFn: (payload: CreateOrGetSessionPayload) =>
      chatService.createOrGetSession(learningObjectId, payload),
  })
}
