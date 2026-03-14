# Content Atlas

An interactive data visualization exploring Netflix's global content catalog — 7,700+ titles, 80+ countries, 13 years of streaming history.

Built with React + D3.js as a portfolio project for Netflix's Data Visualization Engineering Internship.

---

## Visualizations

| Section | Chart Type | D3 Technique |
|---|---|---|
| **Hero** | Animated counters | `requestAnimationFrame` count-up |
| **Content Overview** | Donut chart | `d3.pie()` + `attrTween` arc animation |
| **Growth Over Time** | Stacked area chart | `d3.stack()` + clipRect draw-on-scroll |
| **Global Origins** | Choropleth world map | `d3.geoNaturalEarth1()` + `d3.interpolateReds` |
| **Genre Landscape** | Force-directed bubbles | `d3.forceSimulation()` + filterable by type |
| **Content Ratings** | Horizontal bar chart | `d3.scaleBand()` + staggered scroll animation |

---

## Tech Stack

- **React 18** + **Vite**
- **D3.js v7** — all custom chart primitives
- **TailwindCSS** — Netflix-inspired dark theme
- **PapaParse** — CSV parsing
- **topojson-client** — choropleth map geometry

---

## Dataset

[Netflix Movies and TV Shows](https://www.kaggle.com/datasets/shivamb/netflix-shows) via Kaggle / TidyTuesday (~7,800 titles through 2021).

Columns used: `type`, `title`, `director`, `country`, `date_added`, `release_year`, `rating`, `listed_in`

---

## Architecture

```
src/
├── charts/          # Dumb D3 components — accept data + dimensions as props
│   ├── AreaChart.jsx
│   ├── BubbleChart.jsx
│   ├── ChoroplethMap.jsx
│   ├── DonutChart.jsx
│   └── HorizontalBarChart.jsx
├── components/
│   ├── layout/      # Navbar, SectionWrapper (IntersectionObserver scroll entry)
│   ├── sections/    # Smart section components — own layout, tooltips, state
│   └── ui/          # Tooltip, StatCard, LoadingSpinner, ChartTitle
├── hooks/
│   ├── useNetflixData.js      # Fetches + parses CSV, memoizes all derived data
│   ├── useChartDimensions.js  # ResizeObserver → responsive width/height
│   ├── useScrollAnimation.js  # IntersectionObserver → one-shot isVisible trigger
│   └── useTooltip.js
└── utils/
    ├── dataProcessor.js       # All data transformations + country→ISO lookup
    ├── colorScales.js
    └── constants.js
```

**Key pattern:** `charts/` components are framework-agnostic D3 primitives. `sections/` components compose them with data and layout. `BubbleChart` exclusively owns its SVG DOM to avoid React/D3 virtual DOM conflicts during force simulation.

---

## Run Locally

```bash
npm install
npm run dev
# → http://localhost:5173/content-atlas/
```

## Deploy to GitHub Pages

```bash
npm run build
npm run deploy
```
