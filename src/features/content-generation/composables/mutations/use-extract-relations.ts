import { useMutation } from '@tanstack/vue-query'
import { ContentGenerationDataSource } from '../../services/content-generation.services'
import type { ExtractRelationsPayload, ExtractRelationsResponse } from '../../types/content-generation.types'

const contentGenerationDataSource = new ContentGenerationDataSource()

export function useExtractRelations() {
  const mutation = useMutation({
    mutationFn: (payload: ExtractRelationsPayload) =>
      contentGenerationDataSource.extractRelations(payload),
  })

  return mutation
}

export type { ExtractRelationsPayload, ExtractRelationsResponse }
