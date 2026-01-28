import { AiAudience, AiLength, AiTargetLevel, AiTone } from './ai-configuration-enums';


export interface IUpdateAiConfiguration {
  language?: string;
  contextPrompt?: string;
  targetLevel?: AiTargetLevel;
  audience?: AiAudience;
  learningObjectives?: string[];
  contentLength?: AiLength;
  tone?: AiTone;
}
