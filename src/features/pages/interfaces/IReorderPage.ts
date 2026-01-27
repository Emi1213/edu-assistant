/**
 * Representa la carga útil para la operación de reordenamiento de páginas.
 */
export interface IReorderPagePayload {
  /**
   * ID de la página a reordenar.
   */
  id: number;

  /**
   * Nuevo índice de orden para la página.
   */
  orderIndex: number;
}
