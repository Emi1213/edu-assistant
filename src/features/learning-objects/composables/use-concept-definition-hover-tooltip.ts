import { onBeforeUnmount, ref, watch, type Ref } from 'vue'

function conceptElFromTarget(target: EventTarget | null): HTMLElement | null {
  if (!target || target === document) return null
  const n = target as Node
  const el = n.nodeType === Node.TEXT_NODE ? n.parentElement : (n as Element)
  return el?.closest?.('[data-type="concept"]') ?? null
}

function definitionFromConcept(el: HTMLElement): string {
  const fromAttr = el.getAttribute('data-definition')?.trim()
  if (fromAttr) return fromAttr
  return el.getAttribute('title')?.trim() ?? ''
}

export function useConceptDefinitionHoverTooltip(containerRef: Ref<HTMLElement | null>) {
  const visible = ref(false)
  const text = ref('')
  const style = ref<Record<string, string>>({})

  let raf = 0
  let lastEl: HTMLElement | null = null

  function positionTooltip(el: HTMLElement) {
    const rect = el.getBoundingClientRect()
    const vw = window.innerWidth
    const maxW = 320
    let left = rect.left + rect.width / 2
    left = Math.max(12 + maxW / 2, Math.min(left, vw - 12 - maxW / 2))
    const gap = 8
    const below = rect.bottom + gap
    const estimatedH = 120
    const preferAbove = below + estimatedH > window.innerHeight && rect.top > estimatedH + gap
    if (preferAbove) {
      style.value = {
        position: 'fixed',
        left: `${left}px`,
        top: `${rect.top - gap}px`,
        transform: 'translate(-50%, -100%)',
        zIndex: '50',
        maxWidth: `${maxW}px`,
      }
    } else {
      style.value = {
        position: 'fixed',
        left: `${left}px`,
        top: `${below}px`,
        transform: 'translateX(-50%)',
        zIndex: '50',
        maxWidth: `${maxW}px`,
      }
    }
  }

  function onMove(e: MouseEvent) {
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(() => {
      const root = containerRef.value
      if (!root) return
      const concept = conceptElFromTarget(e.target)
      if (!concept || !root.contains(concept)) {
        visible.value = false
        lastEl = null
        return
      }
      const def = definitionFromConcept(concept)
      if (!def) {
        visible.value = false
        lastEl = null
        return
      }
      if (lastEl !== concept) {
        lastEl = concept
        text.value = def
        positionTooltip(concept)
      } else {
        positionTooltip(concept)
      }
      visible.value = true
    })
  }

  function hide() {
    visible.value = false
    lastEl = null
  }

  function onLeave(e: MouseEvent) {
    const root = containerRef.value
    const related = e.relatedTarget as Node | null
    if (related && root?.contains(related)) return
    hide()
  }

  function onScroll() {
    if (visible.value && lastEl) positionTooltip(lastEl)
  }

  watch(
    containerRef,
    (el, prev) => {
      prev?.removeEventListener('mousemove', onMove)
      prev?.removeEventListener('mouseleave', onLeave)
      el?.addEventListener('mousemove', onMove)
      el?.addEventListener('mouseleave', onLeave)
    },
    { immediate: true }
  )

  window.addEventListener('scroll', onScroll, true)

  onBeforeUnmount(() => {
    cancelAnimationFrame(raf)
    window.removeEventListener('scroll', onScroll, true)
    containerRef.value?.removeEventListener('mousemove', onMove)
    containerRef.value?.removeEventListener('mouseleave', onLeave)
  })

  return { visible, text, style }
}
