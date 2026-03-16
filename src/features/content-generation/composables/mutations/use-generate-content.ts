import { useMutation } from '@tanstack/vue-query'
import { ContentGenerationDataSource } from '../../services/content-generation.service'
import type { CreateContentGeneration } from '../../types'

const contentGenerationDataSource = new ContentGenerationDataSource()

export function useGenerateContent() {
  const mutation = useMutation({
    mutationFn: (payload: CreateContentGeneration) => 
      contentGenerationDataSource.generateContent(payload),
  })
  
  return mutation
}
