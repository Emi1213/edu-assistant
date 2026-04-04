export interface ExtractConceptsTerm {
  term: string
  definition: string
}

export interface ExtractConceptsPayload {
  learningObjectId: number
}


export interface ExtractConceptsResponse {
  terms: ExtractConceptsTerm[]
}
