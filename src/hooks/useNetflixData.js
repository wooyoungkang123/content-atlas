import { useState, useEffect, useMemo } from 'react'
import {
  parseNetflixCSV,
  getContentSplit,
  getGrowthByYear,
  getCountryData,
  getGenreData,
  getRatingData,
  getTopStats,
} from '../utils/dataProcessor'

export function useNetflixData() {
  const [titles, setTitles] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/netflix_titles.csv`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load dataset (${res.status})`)
        return res.text()
      })
      .then((raw) => {
        const parsed = parseNetflixCSV(raw)
        setTitles(parsed)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const contentSplit = useMemo(() => (titles ? getContentSplit(titles) : null), [titles])
  const growthData = useMemo(() => (titles ? getGrowthByYear(titles) : null), [titles])
  const countryData = useMemo(() => (titles ? getCountryData(titles) : null), [titles])
  const genreData = useMemo(() => (titles ? getGenreData(titles) : null), [titles])
  const ratingData = useMemo(() => (titles ? getRatingData(titles) : null), [titles])
  const stats = useMemo(() => (titles ? getTopStats(titles) : null), [titles])

  return { loading, error, titles, contentSplit, growthData, countryData, genreData, ratingData, stats }
}
