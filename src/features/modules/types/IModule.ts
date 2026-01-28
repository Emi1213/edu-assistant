import type { IAiConfiguration } from './IAiConfiguration';

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
