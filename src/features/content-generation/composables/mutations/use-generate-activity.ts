import { useMutation } from '@tanstack/vue-query'
import { ContentGenerationDataSource } from '../../services/content-generation.service'
import type { GenerateActivityPayload, GenerateActivityResponse } from '../../types'

const contentGenerationDataSource = new ContentGenerationDataSource()

export function useGenerateActivity() {
  const mutation = useMutation({
    mutationFn: (payload: GenerateActivityPayload) =>
      contentGenerationDataSource.generateActivity(payload) as Promise<GenerateActivityResponse | null>,
  })

  return mutation
}
