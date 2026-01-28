import { ICreateAiConfiguration } from './ICreateAiConfiguration';


export interface ICreateModule {
  title: string;
  description?: string;
  isPublic?: boolean;
  allowSelfEnroll?: boolean;
  allowSelfUnenroll?: boolean;
  logoUrl?: string;
  aiConfiguration: ICreateAiConfiguration;
}
