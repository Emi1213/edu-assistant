import { AiAudience, AiLength, AiTargetLevel, AiTone } from './ai-configuration-enums';

/**
 * Representa la estructura de datos para actualizar una configuración de IA existente.
 */
export interface IUpdateAiConfiguration {
  language?: string;
  contextPrompt?: string;
  targetLevel?: AiTargetLevel;
  audience?: AiAudience;
  learningObjectives?: string[];
  contentLength?: AiLength;
  tone?: AiTone;
}
