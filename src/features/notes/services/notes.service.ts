
import { API_ROUTES } from '@/core/api/routes/api-routes'
import type { IHttpResponse } from '@/core/interfaces/IHttpHandler'
import type { Note, CreateNote, UpdateNote } from '../types/notes.types'
import { httpClient } from '@/core/infraestructure/http'

class NotesService {
  private readonly httpClient = httpClient

  async createNote(payload: CreateNote): Promise<Note> {
    const response: IHttpResponse<Note> = await this.httpClient.post(
      API_ROUTES.LEARNING_OBJECTS.NOTES.CREATE,
      payload
    )
    if (!response.data) {
      throw new Error('Failed to create note')
    }
    return response.data
  }

  async updateNote(noteId: number, payload: UpdateNote): Promise<Note> {
    const response: IHttpResponse<Note> = await this.httpClient.patch(
      API_ROUTES.LEARNING_OBJECTS.NOTES.UPDATE(noteId),
      payload
    )
    
    if (!response.data) {
      throw new Error('Failed to update note')
    }
    
    return response.data
  }

  async deleteNote(noteId: number): Promise<void> {
    await this.httpClient.delete(API_ROUTES.LEARNING_OBJECTS.NOTES.DELETE(noteId))
  }
}

export const notesService = new NotesService()
