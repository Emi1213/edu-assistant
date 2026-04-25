import { useMutation } from '@tanstack/vue-query'
import { ContentGenerationDataSource } from '../../services/content-generation.service'
import type { GenerateConceptData, GenerateConceptPayload } from '../../types'

const contentGenerationDataSource = new ContentGenerationDataSource()

export function useGenerateConceptDefinition() {
  return useMutation({
    mutationFn: (payload: GenerateConceptPayload) =>
      contentGenerationDataSource.generateConcept(payload) as Promise<GenerateConceptData | null>,
  })
}
