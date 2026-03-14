import { useEffect, useRef, useState } from 'react'
import { SECTION_IDS } from '../../utils/constants'

function AnimatedCounter({ target, duration = 2000 }) {
  const [value, setValue] = useState(0)
  const raf = useRef(null)

  useEffect(() => {
    if (!target) return
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration])

  return <span>{value.toLocaleString()}</span>
}

export default function HeroSection({ stats }) {
  const scrollToNext = () => {
    document.getElementById(SECTION_IDS.CONTENT_SPLIT)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id={SECTION_IDS.HERO}
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center relative"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-netflix-red/10 via-transparent to-transparent pointer-events-none" />

      {/* Netflix N logo */}
      <div className="text-netflix-red text-8xl font-black tracking-tighter mb-6 select-none">
        N
      </div>

      <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight">
        Content
        <br />
        <span className="text-netflix-red">Universe</span>
      </h1>

      <p className="text-netflix-light-gray text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
        An interactive data story exploring Netflix's global content catalog —
        every title, every country, every genre.
      </p>

      {/* Stat row */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 w-full max-w-3xl">
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-white tabular-nums">
              <AnimatedCounter target={stats.total} />
            </span>
            <span className="text-netflix-gray text-xs uppercase tracking-widest mt-1">Titles</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-white tabular-nums">
              <AnimatedCounter target={stats.topCountryCount} />
            </span>
            <span className="text-netflix-gray text-xs uppercase tracking-widest mt-1">{stats.topCountry} titles</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-white tabular-nums">
              <AnimatedCounter target={stats.peakYearCount} />
            </span>
            <span className="text-netflix-gray text-xs uppercase tracking-widest mt-1">Added in {stats.peakYear}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-netflix-red tabular-nums">
              <AnimatedCounter target={stats.topDirectorCount} />
            </span>
            <span className="text-netflix-gray text-xs uppercase tracking-widest mt-1 text-center leading-tight">
              Titles by {stats.topDirector.split(' ').slice(-1)[0]}
            </span>
          </div>
        </div>
      )}

      {/* Scroll cue */}
      <button
        onClick={scrollToNext}
        className="text-netflix-gray hover:text-white transition-colors flex flex-col items-center gap-2 animate-bounce"
        aria-label="Scroll down"
      >
        <span className="text-xs uppercase tracking-widest">Explore</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </section>
  )
}
