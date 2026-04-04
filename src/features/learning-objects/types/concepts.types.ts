export interface CreateConceptPayload {
  term: string
  definition: string
}

export interface LOConcept {
  id: number
  learningObjectId: number
  term: string
  definition: string
  createdAt: string
  updatedAt: string
}

export interface ConceptSuggestion {
  term: string
  definition: string
  reason?: string
}

export interface Relation {
  sourceId: number
  targetId: number
  type: string
}
