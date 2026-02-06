import { useMutation } from '@tanstack/vue-query'
import { ContentGenerationDataSource } from '../../services/content-generation.services'
import type { GenerateImagePayload } from '../../types/content-generation.types'

const contentGenerationDataSource = new ContentGenerationDataSource()

export function useGenerateImage() {
  const mutation = useMutation({
    mutationFn: (payload: GenerateImagePayload) => 
      contentGenerationDataSource.generateImage(payload),
  })
  
  return mutation
}
