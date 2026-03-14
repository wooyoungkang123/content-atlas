import { useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { NETFLIX_RED } from '../utils/constants'

export default function HorizontalBarChart({ data, width, height, margin, isVisible }) {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!data || !svgRef.current || width < 10 || height < 10) return

    const bw = width - margin.left - margin.right
    const bh = height - margin.top - margin.bottom

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('width', width).attr('height', height)

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const y = d3
      .scaleBand()
      .domain(data.map((d) => d.rating))
      .range([0, bh])
      .padding(0.35)

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count) * 1.12])
      .range([0, bw])

    // Y axis
    g.append('g')
      .attr('class', 'axis')
      .call(d3.axisLeft(y).tickSize(0))
      .call((axis) => axis.select('.domain').remove())
      .selectAll('text')
      .attr('fill', '#B3B3B3')
      .attr('font-size', 13)

    // Bars
    const bars = g
      .selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('y', (d) => y(d.rating))
      .attr('x', 0)
      .attr('height', y.bandwidth())
      .attr('fill', NETFLIX_RED)
      .attr('rx', 3)
      .attr('width', 0)

    if (isVisible) {
      bars
        .transition()
        .duration(700)
        .delay((_, i) => i * 60)
        .ease(d3.easeCubicOut)
        .attr('width', (d) => x(d.count))
    }

    // Percentage labels
    const labels = g
      .selectAll('.label')
      .data(data)
      .join('text')
      .attr('class', 'label')
      .attr('y', (d) => y(d.rating) + y.bandwidth() / 2 + 4.5)
      .attr('x', 0)
      .attr('fill', '#B3B3B3')
      .attr('font-size', 12)
      .style('opacity', 0)
      .text((d) => `${d.percentage.toFixed(1)}%  (${d.count.toLocaleString()})`)

    if (isVisible) {
      labels
        .transition()
        .duration(400)
        .delay((_, i) => i * 60 + 700)
        .style('opacity', 1)
        .attr('x', (d) => x(d.count) + 8)
    }
  }, [data, width, height, isVisible])

  return <svg ref={svgRef} />
}
