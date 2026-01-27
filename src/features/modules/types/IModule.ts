import { IAiConfiguration } from './IAiConfiguration';

/**
 * Representa la estructura de un módulo devuelta por la API.
 */
export interface IModule {
  id: number;
  title: string;
  description: string | null;
  teacherId: number;
  isPublic: boolean;
  allowSelfEnroll: boolean;
  logoUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  aiConfiguration?: IAiConfiguration | null;
}
