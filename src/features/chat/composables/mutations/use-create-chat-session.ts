import { useMutation } from '@tanstack/vue-query'
import { chatService } from '../../services/chat.service'
import type { CreateOrGetSessionPayload } from '../../types'
import { type Ref, unref } from 'vue'

export function useCreateChatSession(learningObjectId: number | Ref<number>) {
  return useMutation({
    mutationFn: (payload: CreateOrGetSessionPayload) =>
      chatService.createOrGetSession(unref(learningObjectId), payload),
  })
}
