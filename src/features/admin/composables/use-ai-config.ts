import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { aiConfigService } from '../services/ai-config.service'
import type { AiConfigPatchPayload } from '../types/admin.types'
import { QUERY_KEYS } from '@/shared/composables/query-key'

export function useAiConfig() {
  const queryClient = useQueryClient()

  const configQuery = useQuery({
    queryKey: QUERY_KEYS.AI_CONFIG(),
    queryFn: () => aiConfigService.get(),
  })

  const modelsResponsesQuery = useQuery({
    queryKey: [...QUERY_KEYS.AI_CONFIG(), 'models-responses'],
    queryFn: () => aiConfigService.getModelsResponses(),
  })

  const modelsEmbeddingsQuery = useQuery({
    queryKey: [...QUERY_KEYS.AI_CONFIG(), 'models-embeddings'],
    queryFn: () => aiConfigService.getModelsEmbeddings(),
  })

  const modelsImagesQuery = useQuery({
    queryKey: [...QUERY_KEYS.AI_CONFIG(), 'models-images'],
    queryFn: () => aiConfigService.getModelsImages(),
  })

  const updateMutation = useMutation({
    mutationFn: (payload: AiConfigPatchPayload) => aiConfigService.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AI_CONFIG() })
    },
  })

  return {
    configQuery,
    modelsResponsesQuery,
    modelsEmbeddingsQuery,
    modelsImagesQuery,
    updateMutation,
  }
}
