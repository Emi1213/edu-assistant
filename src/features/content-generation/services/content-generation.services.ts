import type { IHttpHandler } from "@/core/interfaces/IHttpHandler";
import type { ContentGeneration, ContentGenerationResponse, CreateContentGeneration } from "../types/content-generation.types";
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
}