type TiptapNode = {
  type?: string
  attrs?: Record<string, unknown>
  content?: TiptapNode[]
  [key: string]: unknown
}

function normalizeSingleNode(node: TiptapNode): TiptapNode {
  const normalizedType = node.type === 'pageLink' ? 'learningObjectLink' : node.type
  const attrs = { ...(node.attrs ?? {}) }

  if (normalizedType === 'learningObjectLink') {
    const targetPageId = attrs.targetPageId
    if (attrs.targetLearningObjectId == null && typeof targetPageId === 'number') {
      attrs.targetLearningObjectId = targetPageId
    }
    delete attrs.targetPageId
  }

  const normalizedContent = Array.isArray(node.content)
    ? node.content.map((child) => normalizeSingleNode(child))
    : node.content

  return {
    ...node,
    type: normalizedType,
    attrs,
    content: normalizedContent,
  }
}

export function normalizeTiptapContent(nodes: unknown[]): unknown[] {
  return nodes.map((node) => normalizeSingleNode(node as TiptapNode))
}

