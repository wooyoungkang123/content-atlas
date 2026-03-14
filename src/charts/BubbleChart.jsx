import { useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { GENRE_COLORS } from '../utils/colorScales'

// React renders ONLY the outer container + svg tag.
// D3 owns all DOM inside the SVG — avoids React/D3 virtual DOM conflicts.

export default function BubbleChart({ data, width, height, onHover, onLeave }) {
  const svgRef = useRef(null)
  const simRef = useRef(null)

  useEffect(() => {
    if (!data || !svgRef.current || width < 10 || height < 10) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('width', width).attr('height', height)

    const colorScale = d3.scaleOrdinal().range(GENRE_COLORS)

    const maxCount = d3.max(data, (d) => d.count)
    const rScale = d3
      .scaleSqrt()
      .domain([0, maxCount])
      .range([12, Math.min(width, height) / 7])

    const nodes = data.map((d) => ({ ...d, r: rScale(d.count) }))

    // Stop previous simulation if data changes
    simRef.current?.stop()

    const sim = d3
      .forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(5))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide((d) => d.r + 2))
      .alphaDecay(0.03)

    simRef.current = sim

    const g = svg.append('g')

    const circles = g
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', (d) => d.r)
      .attr('fill', (d) => colorScale(d.genre))
      .attr('fill-opacity', 0.88)
      .attr('stroke', '#141414')
      .attr('stroke-width', 1.5)
      .attr('cursor', 'pointer')
      .on('mousemove', function (event, d) {
        d3.select(this).attr('fill-opacity', 1).attr('stroke', '#fff').attr('stroke-width', 2)
        onHover?.(event, d)
      })
      .on('mouseleave', function () {
        d3.select(this).attr('fill-opacity', 0.88).attr('stroke', '#141414').attr('stroke-width', 1.5)
        onLeave?.()
      })

    const labels = g
      .selectAll('text')
      .data(nodes.filter((d) => d.r > 26))
      .join('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', '#fff')
      .attr('font-size', (d) => Math.max(9, Math.min(d.r / 3.2, 13)))
      .attr('pointer-events', 'none')
      .text((d) => {
        // Truncate long genre names to fit bubble
        const maxChars = Math.floor((d.r * 2) / 6)
        return d.genre.length > maxChars ? d.genre.slice(0, maxChars - 1) + '…' : d.genre
      })

    sim.on('tick', () => {
      circles.attr('cx', (d) => d.x).attr('cy', (d) => d.y)
      labels.attr('x', (d) => d.x).attr('y', (d) => d.y)
    })

    return () => sim.stop()
  }, [data, width, height])

  return <svg ref={svgRef} />
}
