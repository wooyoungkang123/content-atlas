import * as d3 from 'd3'
import { NETFLIX_RED, NETFLIX_DARK_RED, GRAY } from './constants'

// Movies vs TV Shows
export const TYPE_COLORS = {
  Movie: NETFLIX_RED,
  'TV Show': NETFLIX_DARK_RED,
}

// For donut chart
export const donutColors = [NETFLIX_RED, NETFLIX_DARK_RED]

// Sequential red scale for choropleth
export const choroplethScale = (domain) =>
  d3.scaleSequential(d3.interpolateReds).domain(domain)

// Bubble genre colors — desaturated palette, 8 distinct hues
export const GENRE_COLORS = [
  '#E50914', // red
  '#C44569', // rose
  '#F8A5C2', // pink
  '#F9CA24', // yellow
  '#6AB04C', // green
  '#22A6B3', // teal
  '#4A90D9', // blue
  '#9B59B6', // purple
]

export const genreColorScale = d3
  .scaleOrdinal()
  .range(GENRE_COLORS)
