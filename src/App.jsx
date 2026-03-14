import { useNetflixData } from './hooks/useNetflixData'
import Navbar from './components/layout/Navbar'
import LoadingSpinner from './components/ui/LoadingSpinner'
import HeroSection from './components/sections/HeroSection'
import ContentSplitSection from './components/sections/ContentSplitSection'
import GrowthSection from './components/sections/GrowthSection'
import WorldMapSection from './components/sections/WorldMapSection'
import GenreBubblesSection from './components/sections/GenreBubblesSection'
import RatingsSection from './components/sections/RatingsSection'

export default function App() {
  const {
    loading,
    error,
    titles,
    contentSplit,
    growthData,
    countryData,
    genreData,
    ratingData,
    stats,
  } = useNetflixData()

  if (loading) return <LoadingSpinner />

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="text-netflix-red text-6xl mb-6">!</div>
        <h1 className="text-white text-2xl font-bold mb-3">Dataset not found</h1>
        <p className="text-netflix-light-gray max-w-md leading-relaxed mb-6">
          Please download the Netflix dataset from Kaggle and place it at:
        </p>
        <code className="bg-netflix-card text-netflix-red px-4 py-2 rounded text-sm">
          public/data/netflix_titles.csv
        </code>
        <p className="text-netflix-gray text-sm mt-6">
          Dataset:{' '}
          <a
            href="https://www.kaggle.com/datasets/shivamb/netflix-shows"
            target="_blank"
            rel="noreferrer"
            className="text-netflix-red underline"
          >
            kaggle.com/datasets/shivamb/netflix-shows
          </a>
        </p>
      </div>
    )
  }

  return (
    <div className="bg-netflix-dark min-h-screen font-netflix">
      <Navbar />

      <HeroSection stats={stats} />
      <ContentSplitSection contentSplit={contentSplit} />
      <GrowthSection growthData={growthData} />
      <WorldMapSection countryData={countryData} />
      <GenreBubblesSection titles={titles} />
      <RatingsSection ratingData={ratingData} />

      {/* Footer */}
      <footer className="py-16 px-4 text-center text-netflix-gray text-sm border-t border-netflix-hover">
        <p className="mb-2">
          Data sourced from{' '}
          <a
            href="https://www.kaggle.com/datasets/shivamb/netflix-shows"
            target="_blank"
            rel="noreferrer"
            className="text-netflix-light-gray hover:text-white transition-colors"
          >
            Netflix Movies and TV Shows (Kaggle)
          </a>
        </p>
        <p>Built with React + D3.js</p>
      </footer>
    </div>
  )
}
