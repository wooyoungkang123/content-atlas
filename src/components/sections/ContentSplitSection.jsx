import { useState } from 'react'
import SectionWrapper from '../layout/SectionWrapper'
import ChartTitle from '../ui/ChartTitle'
import DonutChart from '../../charts/DonutChart'
import Tooltip from '../ui/Tooltip'
import { useChartDimensions } from '../../hooks/useChartDimensions'
import { useTooltip } from '../../hooks/useTooltip'
import { SECTION_IDS, NETFLIX_RED, NETFLIX_DARK_RED } from '../../utils/constants'

export default function ContentSplitSection({ contentSplit }) {
  const { ref, width, height } = useChartDimensions({ top: 0, right: 0, bottom: 0, left: 0 })
  const { tooltip, showTooltip, hideTooltip } = useTooltip()

  if (!contentSplit) return null

  const donutData = [
    { label: 'Movies', value: contentSplit.movies, color: NETFLIX_RED },
    { label: 'TV Shows', value: contentSplit.shows, color: NETFLIX_DARK_RED },
  ]

  const total = contentSplit.movies + contentSplit.shows
  const moviePct = ((contentSplit.movies / total) * 100).toFixed(1)
  const showPct = ((contentSplit.shows / total) * 100).toFixed(1)

  return (
    <SectionWrapper id={SECTION_IDS.CONTENT_SPLIT}>
      <ChartTitle
        title="Content Overview"
        subtitle="Netflix's catalog spans thousands of titles across two categories — with movies consistently outnumbering TV shows."
      />

      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Donut chart */}
        <div className="relative" ref={ref} style={{ height: 380 }}>
          <DonutChart
            data={donutData}
            width={width}
            height={380}
            onHover={showTooltip}
            onLeave={hideTooltip}
          />
          <Tooltip x={tooltip.x} y={tooltip.y} visible={tooltip.visible}>
            {tooltip.content && (
              <div>
                <div className="font-semibold">{tooltip.content.label}</div>
                <div className="text-netflix-light-gray">
                  {tooltip.content.value.toLocaleString()} titles
                </div>
              </div>
            )}
          </Tooltip>
        </div>

        {/* Legend + stats */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            {donutData.map((d) => (
              <div key={d.label} className="flex items-center gap-4">
                <div
                  className="w-4 h-4 rounded-sm flex-shrink-0"
                  style={{ background: d.color }}
                />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-white font-medium">{d.label}</span>
                    <span className="text-netflix-light-gray text-sm">
                      {d.value.toLocaleString()} &nbsp;
                      <span className="text-netflix-gray">
                        ({d.label === 'Movies' ? moviePct : showPct}%)
                      </span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-netflix-hover rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${(d.value / total) * 100}%`,
                        background: d.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-netflix-card rounded-lg p-5 text-center">
              <div className="text-3xl font-bold text-netflix-red">{moviePct}%</div>
              <div className="text-netflix-gray text-xs uppercase tracking-wider mt-1">Movies</div>
            </div>
            <div className="bg-netflix-card rounded-lg p-5 text-center">
              <div className="text-3xl font-bold text-white">{showPct}%</div>
              <div className="text-netflix-gray text-xs uppercase tracking-wider mt-1">TV Shows</div>
            </div>
          </div>

          <p className="text-netflix-gray text-sm leading-relaxed">
            With{' '}
            <span className="text-white font-medium">
              {total.toLocaleString()} titles
            </span>{' '}
            total, Netflix's catalog skews toward movies — but TV shows drive the most viewing hours globally.
          </p>
        </div>
      </div>
    </SectionWrapper>
  )
}
