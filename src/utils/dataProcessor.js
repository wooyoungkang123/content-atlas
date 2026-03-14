import Papa from 'papaparse'

// ---------------------------------------------------------------------------
// Parse raw CSV string into typed records
// ---------------------------------------------------------------------------
export function parseNetflixCSV(rawCSV) {
  const result = Papa.parse(rawCSV, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  })

  return result.data.map((row) => ({
    ...row,
    release_year: parseInt(row.release_year, 10) || null,
    date_added: row.date_added ? row.date_added.trim() : null,
    country: row.country ? row.country.trim() : null,
    listed_in: row.listed_in ? row.listed_in.trim() : null,
    rating: row.rating ? row.rating.trim() : null,
    type: row.type ? row.type.trim() : null,
    title: row.title ? row.title.trim() : null,
  }))
}

// ---------------------------------------------------------------------------
// Movies vs TV Shows split
// ---------------------------------------------------------------------------
export function getContentSplit(titles) {
  let movies = 0
  let shows = 0
  for (const t of titles) {
    if (t.type === 'Movie') movies++
    else if (t.type === 'TV Show') shows++
  }
  return { movies, shows }
}

// ---------------------------------------------------------------------------
// Content added per year (from date_added, not release_year)
// Focus on 2008–2021 where data is meaningful
// ---------------------------------------------------------------------------
export function getGrowthByYear(titles) {
  const map = {}

  for (const t of titles) {
    if (!t.date_added) continue
    // Format: "January 1, 2020"
    const parts = t.date_added.split(',')
    if (parts.length < 2) continue
    const year = parseInt(parts[1].trim(), 10)
    if (!year || year < 2008 || year > 2021) continue

    if (!map[year]) map[year] = { year, movies: 0, shows: 0 }
    if (t.type === 'Movie') map[year].movies++
    else if (t.type === 'TV Show') map[year].shows++
  }

  return Object.values(map).sort((a, b) => a.year - b.year)
}

// ---------------------------------------------------------------------------
// Country of origin (first country listed in comma-separated field)
// ---------------------------------------------------------------------------
export function getCountryData(titles) {
  const map = {}

  for (const t of titles) {
    if (!t.country) continue
    const primary = t.country.split(',')[0].trim()
    if (!primary) continue
    map[primary] = (map[primary] || 0) + 1
  }

  return map
}

// ---------------------------------------------------------------------------
// ISO numeric code lookup (top ~45 countries in dataset)
// Used to match CSV country names to TopoJSON features
// ---------------------------------------------------------------------------
export const COUNTRY_NAME_TO_ISO = {
  'United States': '840',
  India: '356',
  'United Kingdom': '826',
  Japan: '392',
  'South Korea': '410',
  Canada: '124',
  France: '250',
  Germany: '276',
  Spain: '724',
  Mexico: '484',
  Australia: '036',
  Turkey: '792',
  Brazil: '076',
  Egypt: '818',
  China: '156',
  Thailand: '764',
  Nigeria: '566',
  Pakistan: '586',
  Argentina: '032',
  Colombia: '170',
  Italy: '380',
  Taiwan: '158',
  Philippines: '608',
  Indonesia: '360',
  'Hong Kong': '344',
  Poland: '616',
  Belgium: '056',
  Netherlands: '528',
  'New Zealand': '554',
  Sweden: '752',
  Norway: '578',
  Denmark: '208',
  Finland: '246',
  Switzerland: '756',
  Austria: '040',
  Portugal: '620',
  'Czech Republic': '203',
  Hungary: '348',
  Romania: '642',
  Russia: '643',
  Israel: '376',
  'Saudi Arabia': '682',
  'South Africa': '710',
  Kenya: '404',
  Chile: '152',
  Peru: '604',
  Singapore: '702',
  Malaysia: '458',
  Vietnam: '704',
}

// ---------------------------------------------------------------------------
// Genre data — split listed_in, optionally filter by type
// Returns top 30 genres by count
// ---------------------------------------------------------------------------
export function getGenreData(titles, filterType = null) {
  const map = {}

  for (const t of titles) {
    if (filterType && t.type !== filterType) continue
    if (!t.listed_in) continue
    const genres = t.listed_in.split(',').map((g) => g.trim())
    for (const g of genres) {
      if (!g) continue
      map[g] = (map[g] || 0) + 1
    }
  }

  return Object.entries(map)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 30)
}

// ---------------------------------------------------------------------------
// Rating distribution with percentage
// ---------------------------------------------------------------------------
export function getRatingData(titles) {
  const map = {}

  for (const t of titles) {
    const r = t.rating
    if (!r || r === 'NR' || r === 'UR' || r.length > 10) continue
    map[r] = (map[r] || 0) + 1
  }

  const total = Object.values(map).reduce((s, v) => s + v, 0)

  return Object.entries(map)
    .map(([rating, count]) => ({
      rating,
      count,
      percentage: (count / total) * 100,
    }))
    .sort((a, b) => b.count - a.count)
}

// ---------------------------------------------------------------------------
// Top stats for hero cards
// ---------------------------------------------------------------------------
export function getTopStats(titles) {
  // Most prolific director
  const directors = {}
  for (const t of titles) {
    if (!t.director || t.director === 'Not Given') continue
    directors[t.director] = (directors[t.director] || 0) + 1
  }
  const topDirector = Object.entries(directors).sort((a, b) => b[1] - a[1])[0]

  // Top country
  const countries = getCountryData(titles)
  const topCountry = Object.entries(countries).sort((a, b) => b[1] - a[1])[0]

  // Year with most additions
  const growth = getGrowthByYear(titles)
  const peakYear = growth.reduce(
    (best, d) =>
      d.movies + d.shows > (best?.movies || 0) + (best?.shows || 0) ? d : best,
    null
  )

  return {
    total: titles.length,
    topDirector: topDirector ? topDirector[0] : 'Unknown',
    topDirectorCount: topDirector ? topDirector[1] : 0,
    topCountry: topCountry ? topCountry[0] : 'Unknown',
    topCountryCount: topCountry ? topCountry[1] : 0,
    peakYear: peakYear ? peakYear.year : 0,
    peakYearCount: peakYear ? peakYear.movies + peakYear.shows : 0,
  }
}
