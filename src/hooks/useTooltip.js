import { useState, useCallback } from 'react'

export function useTooltip() {
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: null })

  const showTooltip = useCallback((event, content) => {
    const rect = event.currentTarget?.closest('svg')?.getBoundingClientRect?.() || { left: 0, top: 0 }
    setTooltip({
      visible: true,
      x: event.clientX - rect.left + 12,
      y: event.clientY - rect.top - 10,
      content,
    })
  }, [])

  const hideTooltip = useCallback(() => {
    setTooltip((t) => ({ ...t, visible: false }))
  }, [])

  return { tooltip, showTooltip, hideTooltip }
}
