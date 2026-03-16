export interface ExtractRelationsRelation {
  targetPageId: number
  mentionText: string
}

export interface ExtractRelationsPayload {
  pageId: number
}

export interface ExtractRelationsResponse {
  relations: ExtractRelationsRelation[]
}
