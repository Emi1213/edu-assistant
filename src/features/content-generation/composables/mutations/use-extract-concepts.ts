import { useMutation } from '@tanstack/vue-query'
import { ContentGenerationDataSource } from '../../services/content-generation.services'
import type { ExtractConceptsPayload} from '../../types/content-generation.types'

const contentGenerationDataSource = new ContentGenerationDataSource()

export function useExtractConcepts() {
  const mutation = useMutation({
    mutationFn: (payload: ExtractConceptsPayload) =>
      contentGenerationDataSource.extractConcepts(payload),
  })

  return mutation
}

