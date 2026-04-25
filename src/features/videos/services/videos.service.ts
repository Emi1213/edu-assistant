import { httpClient } from '@/core/infraestructure/http'
import type { IHttpHandler } from '@/core/interfaces/IHttpHandler'
import { API_ROUTES } from '@/core/api/routes/api-routes'
import type { IHttpPaginatedResponse } from '@/shared/types/http-response.types'
import type {
  FullVideoDto,
  VideoDto,
  VideoFiltersDto,
  VideoStatusDto,
} from '../types/video.types'
import type {
  CreateVideoFromUrlPayload,
  UploadVideoFilePayload,
} from '../types/video-create.types'
import type { RetryVideoPayload } from '../types/video-retry.types'
import type { UpdateVideoContentPayload } from '../types/video-update.types'

export class VideosDataSource {
  private httpClient: IHttpHandler

  constructor() {
    this.httpClient = httpClient
  }

  async findAllByModule(
    moduleId: number,
    filters?: VideoFiltersDto,
  ): Promise<IHttpPaginatedResponse<VideoDto> | null> {
    const response = await this.httpClient.get<IHttpPaginatedResponse<VideoDto>>(
      API_ROUTES.VIDEOS.LIST_BY_MODULE(moduleId),
      { params: filters },
    )
    return response.data
  }

  async findOne(id: number): Promise<FullVideoDto | null> {
    const response = await this.httpClient.get<FullVideoDto>(API_ROUTES.VIDEOS.DETAIL(id))
    return response.data
  }

  async getStatus(id: number): Promise<VideoStatusDto | null> {
    const response = await this.httpClient.get<VideoStatusDto>(API_ROUTES.VIDEOS.STATUS(id))
    return response.data
  }

  async createFromUrl(payload: CreateVideoFromUrlPayload): Promise<VideoDto | null> {
    const response = await this.httpClient.post<VideoDto>(
      API_ROUTES.VIDEOS.CREATE_FROM_URL,
      payload,
    )
    return response.data
  }

  async uploadFile(
    payload: UploadVideoFilePayload,
    onUploadProgress?: (percent: number) => void,
  ): Promise<VideoDto | null> {
    const form = new FormData()
    form.append('file', payload.file)
    form.append('moduleId', String(payload.moduleId))
    form.append('title', payload.title)
    if (payload.outputLanguage) form.append('outputLanguage', payload.outputLanguage)
    const response = await this.httpClient.post<VideoDto>(API_ROUTES.VIDEOS.UPLOAD, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (ev: { loaded: number; total?: number }) => {
        if (!onUploadProgress || !ev.total) return
        onUploadProgress(Math.round((ev.loaded / ev.total) * 100))
      },
    })
    return response.data
  }

  async retry(id: number, payload: RetryVideoPayload): Promise<VideoStatusDto | null> {
    const response = await this.httpClient.post<VideoStatusDto>(
      API_ROUTES.VIDEOS.RETRY(id),
      payload,
    )
    return response.data
  }

  async updateContent(
    id: number,
    payload: UpdateVideoContentPayload,
  ): Promise<FullVideoDto | null> {
    const response = await this.httpClient.patch<FullVideoDto>(
      API_ROUTES.VIDEOS.UPDATE_CONTENT(id),
      payload,
    )
    return response.data
  }

  async remove(id: number): Promise<void> {
    await this.httpClient.delete(API_ROUTES.VIDEOS.DELETE(id))
  }
}

export const videosDataSource = new VideosDataSource()
