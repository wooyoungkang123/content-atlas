import { useRef, useEffect } from 'react'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import { COUNTRY_NAME_TO_ISO } from '../utils/dataProcessor'
import { NETFLIX_RED } from '../utils/constants'

export default function ChoroplethMap({ geoData, countryData, width, height, onHover, onLeave }) {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!geoData || !countryData || !svgRef.current || width < 10) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('width', width).attr('height', height)

    // Build ISO -> count lookup
    const isoCount = {}
    for (const [name, count] of Object.entries(countryData)) {
      const iso = COUNTRY_NAME_TO_ISO[name]
      if (iso) isoCount[iso] = (isoCount[iso] || 0) + count
    }

    const maxCount = d3.max(Object.values(isoCount)) || 1

    const colorScale = d3
      .scaleSequential(d3.interpolateReds)
      .domain([0, maxCount])

    const projection = d3
      .geoNaturalEarth1()
      .fitSize([width, height], topojson.feature(geoData, geoData.objects.countries))

    const path = d3.geoPath().projection(projection)
    const countries = topojson.feature(geoData, geoData.objects.countries)

    svg
      .selectAll('path')
      .data(countries.features)
      .join('path')
      .attr('d', path)
      .attr('fill', (d) => {
        const count = isoCount[d.id]
        return count ? colorScale(count) : '#2a2a2a'
      })
      .attr('stroke', '#141414')
      .attr('stroke-width', 0.4)
      .attr('cursor', (d) => (isoCount[d.id] ? 'pointer' : 'default'))
      .on('mousemove', function (event, d) {
        const count = isoCount[d.id]
        if (!count) return
        d3.select(this).attr('stroke', '#fff').attr('stroke-width', 1)
        const name = Object.entries(COUNTRY_NAME_TO_ISO).find(([, iso]) => iso === String(d.id))?.[0]
        onHover?.(event, { name: name || d.id, count })
      })
      .on('mouseleave', function () {
        d3.select(this).attr('stroke', '#141414').attr('stroke-width', 0.4)
        onLeave?.()
      })

    // Graticule
    svg
      .append('path')
      .datum(d3.geoGraticule()())
      .attr('d', path)
      .attr('fill', 'none')
      .attr('stroke', '#1f1f1f')
      .attr('stroke-width', 0.3)

    // Color legend
    const legendW = 160
    const legendH = 10
    const legendX = width - legendW - 20
    const legendY = height - 32

    const defs = svg.append('defs')
    const grad = defs
      .append('linearGradient')
      .attr('id', 'choropleth-grad')

    grad.append('stop').attr('offset', '0%').attr('stop-color', d3.interpolateReds(0.1))
    grad.append('stop').attr('offset', '100%').attr('stop-color', NETFLIX_RED)

    svg
      .append('rect')
      .attr('x', legendX)
      .attr('y', legendY)
      .attr('width', legendW)
      .attr('height', legendH)
      .attr('rx', 2)
      .attr('fill', 'url(#choropleth-grad)')

    svg
      .append('text')
      .attr('x', legendX)
      .attr('y', legendY - 5)
      .attr('fill', '#808080')
      .attr('font-size', 10)
      .text('Fewer')

    svg
      .append('text')
      .attr('x', legendX + legendW)
      .attr('y', legendY - 5)
      .attr('fill', '#808080')
      .attr('font-size', 10)
      .attr('text-anchor', 'end')
      .text('More')
  }, [geoData, countryData, width, height])

  return <svg ref={svgRef} />
}
