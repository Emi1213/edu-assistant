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

export interface GenerateConceptPayload {
  selectedText: string
  blockId: number
  language: string
}

export interface GenerateConceptData {
  term: string
  definition: string
}
