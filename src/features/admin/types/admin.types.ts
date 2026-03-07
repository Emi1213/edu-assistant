export interface AiConfigData {
  responses: string
  embeddings: string
  images: string
}

export type AiConfigPatchPayload = Partial<AiConfigData>

export interface AiConfigModelsResponse {
  models: string[]
}

export interface TeachersEmailsData {
  emails: string[]
}
