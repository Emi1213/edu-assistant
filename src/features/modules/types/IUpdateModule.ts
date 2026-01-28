import type { IUpdateAiConfiguration } from './IUpdateAiConfiguration';


export interface IUpdateModule {
  title?: string;
  description?: string;
  isPublic?: boolean;
  allowSelfEnroll?: boolean;
  allowSelfUnenroll?: boolean;
  logoUrl?: string;
  isActive?: boolean;
  aiConfiguration?: IUpdateAiConfiguration;
}
