import { AiAudience, AiLength, AiTargetLevel, AiTone } from './ai-configuration-enums';


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
