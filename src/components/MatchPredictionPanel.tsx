import { motion } from 'framer-motion'
import { CalendarRange, RotateCcw, Sparkles } from 'lucide-react'
import { fixtures, TEAM_META } from '../data/ipl'
import { usePredictorStore } from '../store/usePredictorStore'
import type { MatchOutcome } from '../types/ipl'

const outcomeStyles: Record<Exclude<MatchOutcome, null>, string> = {
  A: 'from-blue-300/28 to-blue-600/14 text-blue-50 border-blue-200/40',
  B: 'from-sky-300/24 to-blue-500/14 text-blue-50 border-sky-200/35',
  NR: 'from-amber-300/24 to-blue-500/10 text-amber-50 border-amber-200/35',
}

export function MatchPredictionPanel() {
  const outcomes = usePredictorStore((state) => state.outcomes)
  const setOutcome = usePredictorStore((state) => state.setOutcome)
  const resetSimulation = usePredictorStore((state) => state.resetSimulation)

  return (
    <section
      id="simulation"
      className="glass-panel glow-border flex h-full min-w-0 flex-col overflow-hidden rounded-[32px] p-5 sm:p-6"
    >
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="section-kicker">
            <Sparkles className="h-3.5 w-3.5" />
            Manual Match Predictor
          </p>
          <h2 className="section-title">Simulate Every Remaining Fixture</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300/75">
            Pick a winner or mark a no result to see the table, qualification odds, and NRR race refresh instantly.
          </p>
        </div>
        <button
          type="button"
          onClick={resetSimulation}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-blue-100/12 bg-blue-200/8 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-200/12"
        >
          <RotateCcw className="h-4 w-4" />
          Reset Simulation
        </button>
      </div>

      <div className="scrollbar-hidden min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
        {fixtures.length === 0 ? (
          <div className="rounded-[28px] border border-blue-100/10 bg-[#0c1d40]/90 p-6 text-sm leading-7 text-slate-300/78">
            There are no remaining fixtures in the current IPL schedule window. When new matches are added to the data,
            they will appear here automatically.
          </div>
        ) : null}
        {fixtures.map((fixture, index) => {
          const outcome = outcomes[fixture.id]
          const teamA = TEAM_META[fixture.teamA]
          const teamB = TEAM_META[fixture.teamB]

          const primaryOptions: Array<{ label: string; value: Exclude<MatchOutcome, null> }> = [
            { label: `${teamA.shortName} Win`, value: 'A' },
            { label: `${teamB.shortName} Win`, value: 'B' },
          ]

          return (
            <motion.article
              key={fixture.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: index * 0.05 }}
              whileHover={{ y: -3 }}
              className="rounded-[28px] border border-blue-100/10 bg-[#0c1d40]/90 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
            >
              <div className="mb-4 flex flex-col gap-4">
                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-slate-300/70">
                    <span className="rounded-full border border-blue-100/12 bg-blue-200/8 px-3 py-1">{fixture.stage}</span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-blue-100/12 bg-blue-200/8 px-3 py-1">
                      <CalendarRange className="h-3.5 w-3.5" />
                      {fixture.dateLabel} • {fixture.timeLabel}
                    </span>
                    <span className="rounded-full border border-blue-100/12 bg-blue-200/8 px-3 py-1">{fixture.venue}</span>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-5">
                    {[teamA, teamB].map((team, teamIndex) => (
                      <div key={team.shortName} className="flex items-center gap-3">
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 text-sm font-bold text-white"
                          style={{ backgroundColor: `${team.color}22`, boxShadow: `0 0 24px ${team.color}33` }}
                        >
                          {team.shortName}
                        </div>
                        <div>
                          <p className="text-base font-semibold text-white">{team.name}</p>
                        </div>
                        {teamIndex === 0 ? <span className="text-slate-500">vs</span> : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2">
                  {primaryOptions.map((option) => {
                    const active = outcome === option.value
                    return (
                      <motion.button
                        key={option.label}
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setOutcome(fixture.id, option.value)}
                        className={`min-w-0 rounded-2xl border px-3 py-3 text-sm font-semibold transition ${
                          active
                            ? `bg-gradient-to-br ${outcomeStyles[option.value]} shadow-[0_10px_30px_rgba(15,91,216,0.2)]`
                            : 'border-blue-100/10 bg-[#081733] text-slate-200/82 hover:border-blue-100/20 hover:bg-blue-200/8'
                        }`}
                      >
                        {option.label}
                      </motion.button>
                    )
                  })}
                </div>
                {(() => {
                  const active = outcome === 'NR'
                  return (
                    <motion.button
                      key="No Result"
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setOutcome(fixture.id, 'NR')}
                      className={`min-w-0 rounded-2xl border px-3 py-3 text-sm font-semibold transition ${
                        active
                          ? `bg-gradient-to-br ${outcomeStyles.NR} shadow-[0_10px_30px_rgba(15,91,216,0.2)]`
                          : 'border-blue-100/10 bg-[#081733] text-slate-200/82 hover:border-blue-100/20 hover:bg-blue-200/8'
                      }`}
                    >
                      No Result
                    </motion.button>
                  )
                })()}
              </div>

              <p className="text-sm leading-6 text-slate-300/72">{fixture.narrative}</p>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}
