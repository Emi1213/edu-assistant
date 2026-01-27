export type AiTargetLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export const AiTargetLevel = {
  BEGINNER: 'BEGINNER',
  INTERMEDIATE: 'INTERMEDIATE',
  ADVANCED: 'ADVANCED',
  EXPERT: 'EXPERT',
} as const;

export type AiAudience = 'UNIVERSITY' | 'HIGH_SCHOOL' | 'PROFESSIONAL' | 'GENERAL';

export const AiAudience = {
  UNIVERSITY: 'UNIVERSITY',
  HIGH_SCHOOL: 'HIGH_SCHOOL',
  PROFESSIONAL: 'PROFESSIONAL',
  GENERAL: 'GENERAL',
} as const;

export type AiLength = 'SHORT' | 'MEDIUM' | 'LONG' | 'VERY_LONG';

export const AiLength = {
  SHORT: 'SHORT',
  MEDIUM: 'MEDIUM',
  LONG: 'LONG',
  VERY_LONG: 'VERY_LONG',
} as const;

export type AiTone = 'EDUCATIONAL' | 'FORMAL' | 'INFORMAL' | 'FRIENDLY';

export const AiTone = {
  EDUCATIONAL: 'EDUCATIONAL',
  FORMAL: 'FORMAL',
  INFORMAL: 'INFORMAL',
  FRIENDLY: 'FRIENDLY',
} as const;