export function normalizeConceptMarkersInMarkdown(markdown: string): string {
  return markdown.replace(/\[\[concept:\d+\|([^\]]*)\]\]/g, '$1')
}
