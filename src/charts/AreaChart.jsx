import { useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { NETFLIX_RED, NETFLIX_DARK_RED } from '../utils/constants'

export default function AreaChart({ data, width, height, margin, isVisible }) {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!data || !svgRef.current || width < 10 || height < 10) return

    const bw = width - margin.left - margin.right
    const bh = height - margin.top - margin.bottom

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('width', width).attr('height', height)

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    // Scales
    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.year))
      .range([0, bw])

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.movies + d.shows) * 1.1])
      .range([bh, 0])

    // Stack
    const stack = d3.stack().keys(['shows', 'movies'])
    const stacked = stack(data)

    // Area generator
    const area = d3
      .area()
      .x((d) => x(d.data.year))
      .y0((d) => y(d[0]))
      .y1((d) => y(d[1]))
      .curve(d3.curveMonotoneX)

    const colors = { movies: NETFLIX_RED, shows: NETFLIX_DARK_RED }

    // Clip path for draw-on animation
    const clipId = 'growth-clip'
    svg
      .append('defs')
      .append('clipPath')
      .attr('id', clipId)
      .append('rect')
      .attr('x', margin.left)
      .attr('y', margin.top - 10)
      .attr('width', 0)
      .attr('height', bh + 20)

    // Draw areas with clip
    stacked.forEach((layer) => {
      g.append('path')
        .datum(layer)
        .attr('fill', colors[layer.key])
        .attr('fill-opacity', 0.85)
        .attr('clip-path', `url(#${clipId})`)
        .attr('d', area)
    })

    // Gridlines
    g.append('g')
      .attr('class', 'axis')
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickSize(-bw)
          .tickFormat(d3.format(',d'))
      )
      .selectAll('line')
      .attr('stroke', '#2a2a2a')
      .attr('stroke-dasharray', '4,4')

    g.selectAll('.axis .domain').remove()

    // X axis
    g.append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0,${bh})`)
      .call(d3.axisBottom(x).tickFormat(d3.format('d')).ticks(data.length))
      .selectAll('text')
      .attr('fill', '#808080')

    // Y axis text
    g.selectAll('.axis text').attr('fill', '#808080')

    // Dots + tooltips
    const bisect = d3.bisector((d) => d.year).left

    const focus = g.append('g').style('display', 'none')
    focus.append('line').attr('class', 'focus-line').attr('stroke', '#444').attr('stroke-width', 1).attr('stroke-dasharray', '4,4')
    focus.append('circle').attr('r', 5).attr('fill', NETFLIX_RED).attr('stroke', '#fff').attr('stroke-width', 2)

    const tooltip = d3
      .select(svgRef.current.parentNode)
      .append('div')
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('background', 'rgba(0,0,0,0.9)')
      .style('border-left', `4px solid ${NETFLIX_RED}`)
      .style('padding', '8px 12px')
      .style('border-radius', '0 4px 4px 0')
      .style('font-size', '13px')
      .style('color', '#fff')
      .style('display', 'none')

    g.append('rect')
      .attr('width', bw)
      .attr('height', bh)
      .attr('fill', 'transparent')
      .on('mousemove', function (event) {
        const [mx] = d3.pointer(event)
        const year = Math.round(x.invert(mx))
        const idx = bisect(data, year, 1)
        const d = data[Math.min(idx, data.length - 1)]
        if (!d) return

        focus.style('display', null)
        focus
          .select('.focus-line')
          .attr('x1', x(d.year))
          .attr('x2', x(d.year))
          .attr('y1', 0)
          .attr('y2', bh)
        focus.select('circle').attr('cx', x(d.year)).attr('cy', y(d.movies + d.shows))

        const rect = svgRef.current.parentNode.getBoundingClientRect()
        tooltip
          .style('display', 'block')
          .style('left', `${event.clientX - rect.left + 14}px`)
          .style('top', `${event.clientY - rect.top - 40}px`)
          .html(
            `<strong>${d.year}</strong><br/>Movies: ${d.movies.toLocaleString()}<br/>TV Shows: ${d.shows.toLocaleString()}<br/><span style="color:#aaa">Total: ${(d.movies + d.shows).toLocaleString()}</span>`
          )
      })
      .on('mouseleave', () => {
        focus.style('display', 'none')
        tooltip.style('display', 'none')
      })

    // Animate clip rect when visible
    if (isVisible) {
      svg
        .select(`#${clipId} rect`)
        .transition()
        .duration(1500)
        .ease(d3.easeCubicOut)
        .attr('width', bw)
    }
  }, [data, width, height, isVisible])

  return <svg ref={svgRef} style={{ overflow: 'visible' }} />
}
