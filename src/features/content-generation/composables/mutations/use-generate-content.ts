import { useMutation } from '@tanstack/vue-query'
import { ContentGenerationDataSource } from '../../services/content-generation.services'
import type { CreateContentGeneration } from '../../types/content-generation.types'

const contentGenerationDataSource = new ContentGenerationDataSource()

export function useGenerateContent() {
  const mutation = useMutation({
    mutationFn: (payload: CreateContentGeneration) => 
      contentGenerationDataSource.generateContent(payload),
  })
  
  return mutation
}
