import SectionWrapper from '../layout/SectionWrapper'
import ChartTitle from '../ui/ChartTitle'
import AreaChart from '../../charts/AreaChart'
import { useChartDimensions } from '../../hooks/useChartDimensions'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import { SECTION_IDS, MARGIN, NETFLIX_RED, NETFLIX_DARK_RED } from '../../utils/constants'

export default function GrowthSection({ growthData }) {
  const { ref: chartRef, width, height } = useChartDimensions(MARGIN)
  const { ref: scrollRef, isVisible } = useScrollAnimation(0.2)

  if (!growthData) return null

  return (
    <SectionWrapper id={SECTION_IDS.GROWTH}>
      <ChartTitle
        title="Content Growth"
        subtitle="Netflix's catalog exploded after 2015 as original productions scaled up. Each layer represents new titles added to the platform that year."
      />

      {/* Legend */}
      <div className="flex gap-6 mb-6">
        {[
          { label: 'Movies', color: NETFLIX_RED },
          { label: 'TV Shows', color: NETFLIX_DARK_RED },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ background: l.color }} />
            <span className="text-netflix-light-gray text-sm">{l.label}</span>
          </div>
        ))}
      </div>

      <div
        ref={(node) => {
          chartRef.current = node
          scrollRef.current = node
        }}
        className="relative"
        style={{ height: 380 }}
      >
        <AreaChart
          data={growthData}
          width={width}
          height={380}
          margin={MARGIN}
          isVisible={isVisible}
        />
      </div>
    </SectionWrapper>
  )
}
