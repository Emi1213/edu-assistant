export interface Note {
  id: number
  pageId: number
  userId: number
  content: string
  createdAt: string
}

export interface CreateNote extends Omit<Note, 'id' | 'userId' | 'createdAt'> {}

export interface UpdateNote extends Pick<Note, 'content'> {}
