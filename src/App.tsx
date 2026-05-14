import { lazy, Suspense, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AnalystPanel } from './components/AnalystPanel'
import { BackgroundEffects } from './components/BackgroundEffects'
import { MatchPredictionPanel } from './components/MatchPredictionPanel'
import { Navbar } from './components/Navbar'
import { OverviewCards } from './components/OverviewCards'
import { PointsTable } from './components/PointsTable'
import { fallbackTeams } from './data/ipl'
import { fetchLiveTeams } from './lib/ipl-api'
import { usePredictorStore } from './store/usePredictorStore'
import type { TeamSnapshot } from './types/ipl'

const StatisticsSection = lazy(() =>
  import('./components/StatisticsSection').then((module) => ({
    default: module.StatisticsSection,
  })),
)

function App() {
  const [teams, setTeams] = useState<TeamSnapshot[]>(fallbackTeams)
  const hydrateTeams = usePredictorStore((state) => state.hydrateTeams)

  useEffect(() => {
    let isMounted = true

    const loadTeams = async () => {
      const nextTeams = await fetchLiveTeams()
      if (isMounted) {
        setTeams(nextTeams)
      }
    }

    void loadTeams()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    hydrateTeams(teams)
  }, [hydrateTeams, teams])

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(93,152,255,0.2),_transparent_28%),linear-gradient(180deg,_#0d1f44_0%,_#0a1835_46%,_#081226_100%)] text-white">
      <BackgroundEffects />
      <Navbar />

      <main className="relative z-10 mx-auto flex max-w-[1600px] flex-col gap-6 px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <OverviewCards />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex min-w-0 flex-col gap-6"
        >
          <div className="grid gap-6 xl:grid-cols-2 xl:items-start">
            <div className="min-w-0 xl:h-[min(1600px,calc(100vh+22rem))]">
              <MatchPredictionPanel />
            </div>
            <div className="min-w-0 xl:h-[min(1600px,calc(100vh+22rem))]">
              <PointsTable />
            </div>
          </div>
          <Suspense
            fallback={
              <div className="glass-panel glow-border rounded-[32px] p-6">
                <div className="shimmer h-7 w-56 rounded-full" />
                <div className="mt-4 grid gap-4 xl:grid-cols-3">
                  {[0, 1, 2].map((item) => (
                    <div key={item} className="rounded-[28px] border border-blue-100/10 bg-[#0c1d40] p-4">
                      <div className="shimmer h-56 rounded-[20px]" />
                    </div>
                  ))}
                </div>
              </div>
            }
          >
            <StatisticsSection />
          </Suspense>
          <AnalystPanel />
        </motion.div>
      </main>
    </div>
  )
}

export default App
