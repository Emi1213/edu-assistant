export interface CreateConceptPayload {
  term: string
  definition: string
}

export interface PageConcept {
  id: number
  pageId: number
  term: string
  definition: string
  createdAt: string
  updatedAt: string
}
