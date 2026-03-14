import { useState, useMemo } from 'react'
import SectionWrapper from '../layout/SectionWrapper'
import ChartTitle from '../ui/ChartTitle'
import BubbleChart from '../../charts/BubbleChart'
import Tooltip from '../ui/Tooltip'
import { useChartDimensions } from '../../hooks/useChartDimensions'
import { useTooltip } from '../../hooks/useTooltip'
import { getGenreData } from '../../utils/dataProcessor'
import { SECTION_IDS } from '../../utils/constants'

const FILTERS = [
  { label: 'All', value: null },
  { label: 'Movies', value: 'Movie' },
  { label: 'TV Shows', value: 'TV Show' },
]

export default function GenreBubblesSection({ titles }) {
  const [filter, setFilter] = useState(null)
  const { ref, width } = useChartDimensions({ top: 0, right: 0, bottom: 0, left: 0 })
  const { tooltip, showTooltip, hideTooltip } = useTooltip()

  const genreData = useMemo(
    () => (titles ? getGenreData(titles, filter) : null),
    [titles, filter]
  )

  if (!genreData) return null

  const chartHeight = Math.max(480, Math.round(width * 0.65))

  return (
    <SectionWrapper id={SECTION_IDS.GENRES}>
      <ChartTitle
        title="Genre Landscape"
        subtitle="Every bubble is a genre, sized by the number of titles. Drama and Comedy dominate — but documentaries and international content are rising fast."
      />

      {/* Filter buttons */}
      <div className="flex gap-3 mb-8">
        {FILTERS.map((f) => (
          <button
            key={String(f.value)}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm border transition-colors duration-200 ${
              filter === f.value
                ? 'bg-netflix-red border-netflix-red text-white'
                : 'border-netflix-hover text-netflix-light-gray hover:border-netflix-gray'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div ref={ref} className="relative" style={{ height: chartHeight }}>
        <BubbleChart
          data={genreData}
          width={width}
          height={chartHeight}
          onHover={showTooltip}
          onLeave={hideTooltip}
        />
        <Tooltip x={tooltip.x} y={tooltip.y} visible={tooltip.visible}>
          {tooltip.content && (
            <div>
              <div className="font-semibold">{tooltip.content.genre}</div>
              <div className="text-netflix-light-gray">
                {tooltip.content.count.toLocaleString()} titles
              </div>
            </div>
          )}
        </Tooltip>
      </div>
    </SectionWrapper>
  )
}
