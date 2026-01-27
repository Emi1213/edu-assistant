import { AiAudience, AiLength, AiTargetLevel, AiTone } from './ai-configuration-enums';

/**
 * Representa la estructura de datos para crear una nueva configuración de IA.
 */
export interface ICreateAiConfiguration {
  language?: string;
  contextPrompt?: string;
  targetLevel?: AiTargetLevel;
  audience?: AiAudience;
  learningObjectives?: string[];
  contentLength?: AiLength;
  tone?: AiTone;
}
