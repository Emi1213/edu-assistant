import type { IHttpHandler } from "@/core/interfaces/IHttpHandler";
import type { ContentGeneration, ContentGenerationResponse, CreateContentGeneration, GenerateImagePayload, GenerateImageResponse } from "../types/content-generation.types";
import { API_ROUTES } from "@/core/api/routes/api-routes";
import { httpClient } from "@/core/infraestructure/http";

export class ContentGenerationDataSource {
    private httpClient: IHttpHandler

    constructor() {
        this.httpClient = httpClient
    }

    async generateContent(payload: CreateContentGeneration): Promise<ContentGeneration | null> {
        const response = await this.httpClient.post<ContentGenerationResponse>(API_ROUTES.CONTENT_GENERATION.GENERATE, payload)
        
        if (!response.data) return null
        
        return response.data.content
    }

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
}