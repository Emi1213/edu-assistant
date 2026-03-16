import { httpClient } from '@/core/infraestructure/http'
import { API_ROUTES } from '@/core/api/routes/api-routes'
import type { UploadResult } from '@/shared/types/upload.types'

export async function uploadFile(file: File): Promise<UploadResult | null> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await httpClient.post<UploadResult>(
    API_ROUTES.FILES.UPLOAD,
    formData,
    {
      headers: {
        'Content-Type': undefined as unknown as string,
      },
    } as import('axios').AxiosRequestConfig
  )

  return response?.data ?? null
}
