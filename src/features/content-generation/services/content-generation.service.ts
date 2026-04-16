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
} from "../types";
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

    async regenerateContent(payload: CreateContentGeneration): Promise<ContentGeneration | null> {
        const response = await this.httpClient.post<ContentGeneration>(
            API_ROUTES.CONTENT_GENERATION.REGENERATE_CONTENT,
            payload
        )
        return response.data ?? null
    }

    async generateImage(payload: GenerateImagePayload): Promise<string | null> {
        const response = await this.httpClient.post<GenerateImageResponse>(
            API_ROUTES.CONTENT_GENERATION.GENERATE_IMAGE,
            payload
        )

        return response.data?.base64 ?? null
    }

    async extractConcepts(payload: ExtractConceptsPayload): Promise<ExtractConceptsResponse | null> {
        const response = await this.httpClient.post<ExtractConceptsResponse>(
            API_ROUTES.CONTENT_GENERATION.EXTRACT_CONCEPTS,
            payload
        )
        return response.data ?? null
    }

    async extractRelations(payload: ExtractRelationsPayload): Promise<ExtractRelationsResponse | null> {
        const response = await this.httpClient.post<ExtractRelationsResponse | Record<string, unknown>>(
            API_ROUTES.CONTENT_GENERATION.EXTRACT_RELATIONS,
            payload
        )
        const responseData = response.data
        if (responseData == null) return null
        const rawRelations = (responseData as { relations?: unknown }).relations
        const relationsList = Array.isArray(rawRelations) ? rawRelations : []
        const relations = relationsList
            .map((rawRelation: Record<string, unknown>) => ({
                targetPageId: Number(
                    rawRelation.learningObjectId ?? 
                    rawRelation.learning_object_id ?? 
                    rawRelation.targetPageId ?? 
                    rawRelation.target_page_id ?? 0
                ),
                mentionText: String(rawRelation.mentionText ?? rawRelation.mention_text ?? '').trim(),
            }))
            .filter((relation) => relation.targetPageId > 0 && relation.mentionText.length > 0)
        return { relations }
    }

    async generateActivity(payload: GenerateActivityPayload): Promise<GenerateActivityResponse | null> {
        const response = await this.httpClient.post<GenerateActivityResponse>(
            API_ROUTES.CONTENT_GENERATION.GENERATE_ACTIVITY,
            payload
        )
        return response.data ?? null
    }
}
