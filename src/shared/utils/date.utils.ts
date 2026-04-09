/**
 * Formats a date string into a localized long date (e.g., "8 de abril de 2026").
 * @param dateString - The ISO date string to format.
 * @param locale - Optional locale, defaults to undefined (system default).
 * @returns The formatted date string.
 */
export const formatLongDate = (dateString: string | Date, locale?: string): string => {
  if (!dateString) return ''
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Formats a date string into a short date (e.g., "08/04/2026").
 */
export const formatShortDate = (dateString: string | Date, locale?: string): string => {
  if (!dateString) return ''
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  
  return date.toLocaleDateString(locale)
}
