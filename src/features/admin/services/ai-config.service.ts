import { httpClient } from '@/core/infraestructure/http'
import type { IHttpResponse } from '@/core/interfaces/IHttpHandler'
import { API_ROUTES } from '@/core/api/routes/api-routes'
import type {
  AiConfigData,
  AiConfigPatchPayload,
  AiConfigModelsResponse,
} from '../types/admin.types'

export const aiConfigService = {
  async get(): Promise<AiConfigData> {
    const response: IHttpResponse<AiConfigData> = await httpClient.get(
      API_ROUTES.AI_CONFIG.GET
    )
    if (!response.data) {
      throw new Error('Error al obtener la configuración de IA')
    }
    return response.data
  },

  async update(payload: AiConfigPatchPayload): Promise<AiConfigData> {
    const response: IHttpResponse<AiConfigData> = await httpClient.patch(
      API_ROUTES.AI_CONFIG.PATCH,
      payload
    )
    if (!response.data) {
      throw new Error('Error al actualizar la configuración')
    }
    return response.data
  },

  async getModelsResponses(): Promise<string[]> {
    const response: IHttpResponse<AiConfigModelsResponse> = await httpClient.get(
      API_ROUTES.AI_CONFIG.MODELS_RESPONSES
    )
    if (!response.data?.models) {
      throw new Error('Error al obtener modelos de respuestas')
    }
    return response.data.models
  },

  async getModelsEmbeddings(): Promise<string[]> {
    const response: IHttpResponse<AiConfigModelsResponse> = await httpClient.get(
      API_ROUTES.AI_CONFIG.MODELS_EMBEDDINGS
    )
    if (!response.data?.models) {
      throw new Error('Error al obtener modelos de embeddings')
    }
    return response.data.models
  },

  async getModelsImages(): Promise<string[]> {
    const response: IHttpResponse<AiConfigModelsResponse> = await httpClient.get(
      API_ROUTES.AI_CONFIG.MODELS_IMAGES
    )
    if (!response.data?.models) {
      throw new Error('Error al obtener modelos de imágenes')
    }
    return response.data.models
  },
}
