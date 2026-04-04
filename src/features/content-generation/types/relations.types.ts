export interface ExtractRelationsRelation {
  targetPageId: number
  mentionText: string
}

export interface ExtractRelationsPayload {
  learningObjectId: number
}


export interface ExtractRelationsResponse {
  relations: ExtractRelationsRelation[]
}
