import { useRef, useEffect } from 'react'
import * as d3 from 'd3'

export default function DonutChart({ data, width, height, onHover, onLeave }) {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!data || !svgRef.current || width < 10 || height < 10) return

    const radius = Math.min(width, height) / 2
    const innerRadius = radius * 0.58

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`)

    const pie = d3.pie().value((d) => d.value).sort(null).padAngle(0.03)
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(radius)
    const arcHover = d3.arc().innerRadius(innerRadius).outerRadius(radius + 10)

    const arcs = g
      .selectAll('path')
      .data(pie(data))
      .join('path')
      .attr('fill', (d) => d.data.color)
      .attr('cursor', 'pointer')
      .attr('stroke', '#141414')
      .attr('stroke-width', 2)

    // Arc tween animation on mount
    arcs
      .transition()
      .duration(900)
      .attrTween('d', function (d) {
        const interp = d3.interpolate({ startAngle: 0, endAngle: 0 }, d)
        return (t) => arc(interp(t))
      })

    // Hover
    arcs
      .on('mousemove', function (event, d) {
        d3.select(this).transition().duration(150).attr('d', arcHover(d))
        onHover?.(event, d.data)
      })
      .on('mouseleave', function (event, d) {
        d3.select(this).transition().duration(150).attr('d', arc(d))
        onLeave?.()
      })

    // Center label
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.4em')
      .attr('fill', '#B3B3B3')
      .attr('font-size', 13)
      .text('Total')

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.2em')
      .attr('fill', '#fff')
      .attr('font-size', 22)
      .attr('font-weight', 700)
      .text(d3.sum(data, (d) => d.value).toLocaleString())
  }, [data, width, height])

  return <svg ref={svgRef} />
}
