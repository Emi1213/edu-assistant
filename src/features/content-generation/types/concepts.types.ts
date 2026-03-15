export interface ExtractConceptsTerm {
  term: string
  definition: string
}

export interface ExtractConceptsPayload {
  pageId: number
}

export interface ExtractConceptsResponse {
  terms: ExtractConceptsTerm[]
}
