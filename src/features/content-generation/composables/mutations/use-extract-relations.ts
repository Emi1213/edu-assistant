import { useMutation } from '@tanstack/vue-query'
import { ContentGenerationDataSource } from '../../services/content-generation.service'
import type { ExtractRelationsPayload} from '../../types'

const contentGenerationDataSource = new ContentGenerationDataSource()

export function useExtractRelations() {
  const mutation = useMutation({
    mutationFn: (payload: ExtractRelationsPayload) =>
      contentGenerationDataSource.extractRelations(payload),
  })

  return mutation
}
