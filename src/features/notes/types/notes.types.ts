export interface Note {
  id: number
  learningObjectId: number
  userId: number
  content: string
  createdAt: string
}


export type CreateNote = Omit<Note, 'id' | 'userId' | 'createdAt'>

export type UpdateNote = Pick<Note, 'content'>

