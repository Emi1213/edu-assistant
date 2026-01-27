export interface AiConfiguration {
  id: number
  moduleId: number
  language: string
  contextPrompt: string | null
  temperature: number
  createdAt: Date
  updatedAt: Date
}
