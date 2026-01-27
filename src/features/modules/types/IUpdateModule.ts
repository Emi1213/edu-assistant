import { IUpdateAiConfiguration } from './IUpdateAiConfiguration';

/**
 * Representa la estructura de datos para actualizar un módulo existente.
 */
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
