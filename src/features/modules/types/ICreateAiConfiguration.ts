import { AiAudience, AiLength, AiTargetLevel, AiTone } from './ai-configuration-enums';

export interface ICreateAiConfiguration {
  language?: string;
  contextPrompt?: string;
  targetLevel?: AiTargetLevel;
  audience?: AiAudience;
  learningObjectives?: string[];
  contentLength?: AiLength;
  tone?: AiTone;
}
