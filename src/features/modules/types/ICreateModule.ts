import { ICreateAiConfiguration } from './ICreateAiConfiguration';

/**
 * Representa la estructura de datos para crear un nuevo módulo.
 */
export interface ICreateModule {
  title: string;
  description?: string;
  isPublic?: boolean;
  allowSelfEnroll?: boolean;
  allowSelfUnenroll?: boolean;
  logoUrl?: string;
  aiConfiguration: ICreateAiConfiguration;
}
