/**
 * Representa la estructura de datos para crear una nueva página.
 */
export interface ICreatePage {
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
   * Indica si la página se creará como publicada.
   * Es opcional.
   * @example false
   */
  isPublished?: boolean;
}
