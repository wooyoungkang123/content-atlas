import { useState, useEffect } from 'react'
import SectionWrapper from '../layout/SectionWrapper'
import ChartTitle from '../ui/ChartTitle'
import ChoroplethMap from '../../charts/ChoroplethMap'
import Tooltip from '../ui/Tooltip'
import { useChartDimensions } from '../../hooks/useChartDimensions'
import { useTooltip } from '../../hooks/useTooltip'
import { SECTION_IDS } from '../../utils/constants'

const GEO_URL = 'https://unpkg.com/world-atlas@2/countries-110m.json'

export default function WorldMapSection({ countryData }) {
  const [geoData, setGeoData] = useState(null)
  const { ref, width } = useChartDimensions({ top: 0, right: 0, bottom: 0, left: 0 })
  const { tooltip, showTooltip, hideTooltip } = useTooltip()

  useEffect(() => {
    fetch(GEO_URL)
      .then((r) => r.json())
      .then(setGeoData)
      .catch((e) => console.error('Failed to load world atlas:', e))
  }, [])

  if (!countryData) return null

  // Top 10 countries for sidebar
  const topCountries = Object.entries(countryData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  const maxCount = topCountries[0]?.[1] || 1

  const mapHeight = Math.round(width * 0.52) || 380

  return (
    <SectionWrapper id={SECTION_IDS.WORLD_MAP}>
      <ChartTitle
        title="Global Origins"
        subtitle="Netflix content spans 190+ countries. The United States dominates production, but India, the UK, and Japan contribute significantly."
      />

      <div className="grid lg:grid-cols-[1fr_200px] gap-8 items-start">
        {/* Map */}
        <div ref={ref} className="relative" style={{ minHeight: 300 }}>
          {geoData ? (
            <>
              <ChoroplethMap
                geoData={geoData}
                countryData={countryData}
                width={width}
                height={mapHeight}
                onHover={showTooltip}
                onLeave={hideTooltip}
              />
              <Tooltip x={tooltip.x} y={tooltip.y} visible={tooltip.visible}>
                {tooltip.content && (
                  <div>
                    <div className="font-semibold">{tooltip.content.name}</div>
                    <div className="text-netflix-light-gray">
                      {tooltip.content.count.toLocaleString()} titles
                    </div>
                  </div>
                )}
              </Tooltip>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-netflix-gray text-sm">
              Loading map…
            </div>
          )}
        </div>

        {/* Top countries sidebar */}
        <div className="flex flex-col gap-3">
          <h3 className="text-netflix-light-gray text-xs uppercase tracking-widest mb-2">
            Top Countries
          </h3>
          {topCountries.map(([country, count]) => (
            <div key={country}>
              <div className="flex justify-between mb-0.5">
                <span className="text-white text-sm truncate max-w-[120px]">{country}</span>
                <span className="text-netflix-gray text-xs">{count.toLocaleString()}</span>
              </div>
              <div className="h-1 bg-netflix-hover rounded-full overflow-hidden">
                <div
                  className="h-full bg-netflix-red rounded-full"
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
