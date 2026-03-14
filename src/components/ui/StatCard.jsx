import { useEffect, useRef, useState } from 'react'

function useCountUp(target, duration = 1800, isActive = true) {
  const [value, setValue] = useState(0)
  const raf = useRef(null)

  useEffect(() => {
    if (!isActive || !target) return
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration, isActive])

  return value
}

export default function StatCard({ label, value, suffix = '', animate = true }) {
  const display = useCountUp(value, 1800, animate)

  return (
    <div className="flex flex-col items-center text-center p-4">
      <span className="text-4xl font-bold text-white tabular-nums">
        {display.toLocaleString()}
        {suffix && <span className="text-netflix-red">{suffix}</span>}
      </span>
      <span className="text-netflix-light-gray text-sm mt-1 uppercase tracking-wider">
        {label}
      </span>
    </div>
  )
}
