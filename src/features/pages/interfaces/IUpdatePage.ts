/**
 * Representa la estructura de datos para actualizar una página existente.
 * Todos los campos son opcionales.
 */
export interface IUpdatePage {
  /**
   * Nuevo título de la página.
   * @example 'Introducción a la Programación Avanzada'
   */
  title?: string;

  /**
   * Nuevo estado de publicación de la página.
   * @example true
   */
  isPublished?: boolean;

  /**
   * Indica si la página tiene ediciones manuales.
   * @example true
   */
  hasManualEdits?: boolean;
}
