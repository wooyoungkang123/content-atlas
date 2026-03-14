import { useRef, useState, useEffect } from 'react'

const DEFAULT_MARGIN = { top: 24, right: 24, bottom: 48, left: 56 }

export function useChartDimensions(margin = DEFAULT_MARGIN) {
  const ref = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 })

  useEffect(() => {
    if (!ref.current) return

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setDimensions({ width, height })
    })

    observer.observe(ref.current)
    // Capture initial size
    const { width, height } = ref.current.getBoundingClientRect()
    setDimensions({ width, height })

    return () => observer.disconnect()
  }, [])

  const boundedWidth = Math.max(0, dimensions.width - margin.left - margin.right)
  const boundedHeight = Math.max(0, dimensions.height - margin.top - margin.bottom)

  return {
    ref,
    width: dimensions.width,
    height: dimensions.height,
    margin,
    boundedWidth,
    boundedHeight,
  }
}
