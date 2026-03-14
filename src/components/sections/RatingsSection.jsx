import SectionWrapper from '../layout/SectionWrapper'
import ChartTitle from '../ui/ChartTitle'
import HorizontalBarChart from '../../charts/HorizontalBarChart'
import { useChartDimensions } from '../../hooks/useChartDimensions'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import { SECTION_IDS } from '../../utils/constants'

const MARGIN = { top: 10, right: 160, bottom: 20, left: 80 }

export default function RatingsSection({ ratingData }) {
  const { ref: chartRef, width, height } = useChartDimensions(MARGIN)
  const { ref: scrollRef, isVisible } = useScrollAnimation(0.2)

  if (!ratingData) return null

  const topRatings = ratingData.slice(0, 10)

  // Merge refs
  const setRef = (node) => {
    chartRef.current = node
    scrollRef.current = node
  }

  return (
    <SectionWrapper id={SECTION_IDS.RATINGS}>
      <ChartTitle
        title="Content Ratings"
        subtitle="Most Netflix content targets adult audiences. TV-MA and R-rated content dominate, reflecting the platform's focus on mature drama and thriller genres."
      />

      <div ref={setRef} className="relative" style={{ height: 420 }}>
        <HorizontalBarChart
          data={topRatings}
          width={width}
          height={420}
          margin={MARGIN}
          isVisible={isVisible}
        />
      </div>

      <p className="text-netflix-gray text-sm mt-4 max-w-lg">
        Ratings sourced from Netflix content metadata. NR (Not Rated) and UR (Unrated) titles excluded.
      </p>
    </SectionWrapper>
  )
}
