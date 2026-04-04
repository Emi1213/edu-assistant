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
