import type { IHttpHandler } from "@/core/interfaces/IHttpHandler";
import type {
  ContentGeneration,
  CreateContentGeneration,
  ExtractConceptsPayload,
  ExtractConceptsResponse,
  ExtractRelationsPayload,
  ExtractRelationsResponse,
  GenerateActivityPayload,
  GenerateActivityResponse,
  GenerateImagePayload,
  GenerateImageResponse,
} from "../types/content-generation.types";
import { API_ROUTES } from "@/core/api/routes/api-routes";
import { httpClient } from "@/core/infraestructure/http";

export class ContentGenerationDataSource {
    private httpClient: IHttpHandler

    constructor() {
        this.httpClient = httpClient
    }

    async generateContent(payload: CreateContentGeneration): Promise<ContentGeneration | null> {
        const response = await this.httpClient.post<ContentGeneration>(API_ROUTES.CONTENT_GENERATION.GENERATE, payload)
        if (!response.data) return null
        return response.data
    }

    /**
     * POST /api/content/generate-image
     * Body: { prompt: string }
     * Response: { success, message, data: { base64: "data:image/png;base64,..." } }
     * Usado en el editor al hacer clic en "Generar Imagen" de una sugerencia.
     */
    async generateImage(payload: GenerateImagePayload): Promise<string> {
        const response = await this.httpClient.post<GenerateImageResponse>(
            API_ROUTES.CONTENT_GENERATION.GENERATE_IMAGE,
            payload
        )

        if (!response.data?.base64) {
            throw new Error('No se pudo generar la imagen')
        }

        return response.data.base64
    }

    async extractConcepts(payload: ExtractConceptsPayload): Promise<ExtractConceptsResponse | null> {
        const response = await this.httpClient.post<ExtractConceptsResponse>(
            API_ROUTES.CONTENT_GENERATION.EXTRACT_CONCEPTS,
            payload
        )
        return response.data ?? null
    }

    async extractRelations(payload: ExtractRelationsPayload): Promise<ExtractRelationsResponse | null> {
        const response = await this.httpClient.post<ExtractRelationsResponse>(
            API_ROUTES.CONTENT_GENERATION.EXTRACT_RELATIONS,
            payload
        )
        return response.data ?? null
    }

    async generateActivity(payload: GenerateActivityPayload): Promise<GenerateActivityResponse | null> {
        const response = await this.httpClient.post<GenerateActivityResponse>(
            API_ROUTES.CONTENT_GENERATION.GENERATE_ACTIVITY,
            payload
        )
        return response.data ?? null
    }
}