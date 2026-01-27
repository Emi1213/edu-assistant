import { AiAudience, AiLength, AiTargetLevel, AiTone } from './ai-configuration-enums';

/**
 * Representa la configuración de IA de un módulo.
 */
export interface IAiConfiguration {
  id: number;
  moduleId: number;
  language: string;
  contextPrompt: string | null;
  createdAt: Date;
  updatedAt: Date;
  targetLevel?: AiTargetLevel;
  audience?: AiAudience;
  learningObjectives?: string[];
  contentLength?: AiLength;
  tone?: AiTone;
}
