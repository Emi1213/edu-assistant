import { useMutation } from '@tanstack/vue-query'
import { ContentGenerationDataSource } from '../../services/content-generation.service'
import type { ExtractConceptsPayload } from '../../types'

const contentGenerationDataSource = new ContentGenerationDataSource()

export function useExtractConcepts() {
  const mutation = useMutation({
    mutationFn: (payload: ExtractConceptsPayload) =>
      contentGenerationDataSource.extractConcepts(payload),
  })

  return mutation
}

