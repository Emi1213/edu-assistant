/**
 * Representa la estructura de una página devuelta por la API.
 */
export interface IPage {
  /**
   * ID de la página.
   * @example 1
   */
  id: number;

  /**
   * ID del módulo al que pertenece la página.
   * @example 1
   */
  moduleId: number;

  /**
   * Título de la página.
   * @example 'Introducción a la Programación'
   */
  title: string;

  /**
   * Índice de orden de la página dentro del módulo.
   * @example 1
   */
  orderIndex: number | null;

  /**
   * Palabras clave para búsquedas.
   * @example ['programación', 'introducción', 'básicos']
   */
  keywords: string[];

  /**
   * Indica si la página está publicada.
   * @example false
   */
  isPublished: boolean;

  /**
   * Fecha de creación de la página.
   * @example '2024-01-01T00:00:00.000Z'
   */
  createdAt: Date;

  /**
   * Fecha de última actualización de la página.
   * @example '2024-01-02T00:00:00.000Z'
   */
  updatedAt: Date;
}
