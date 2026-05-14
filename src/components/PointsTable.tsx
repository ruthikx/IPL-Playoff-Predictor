import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDownUp, ShieldAlert, Zap } from 'lucide-react'
import { usePredictorStore } from '../store/usePredictorStore'

export function PointsTable() {
  const standings = usePredictorStore((state) => state.standings)
  const metrics = usePredictorStore((state) => state.metrics)

  return (
    <section
      id="points-table"
      className="glass-panel glow-border flex h-full min-w-0 flex-col overflow-hidden rounded-[32px]"
    >
      <div className="border-b border-blue-100/8 px-5 py-5 sm:px-6">
        <p className="section-kicker">
          <ArrowDownUp className="h-3.5 w-3.5" />
          Dynamic Points Table
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="section-title">Animated Standings + NRR Engine</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300/74">
              Teams sort automatically by points and NRR so the playoff line and bubble battle stay easy to track.
            </p>
          </div>
          <div className="rounded-full border border-blue-100/18 bg-blue-200/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-blue-100/90">
            Top 4 Line
          </div>
        </div>
      </div>

      <div className="scrollbar-hidden min-w-0 overflow-x-auto px-3 pb-4 pt-3 sm:px-4">
        <table className="min-w-full border-separate border-spacing-y-2 text-left">
          <thead>
            <tr className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              {['#', 'Team', 'P', 'W', 'L', 'NR', 'Pts', 'NRR', 'Qualify'].map((heading) => (
                <th key={heading} className="px-4 py-3 font-medium">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <motion.tbody layout>
            <AnimatePresence initial={false}>
              {standings.map((team, index) => {
                const metric = metrics.find((entry) => entry.team === team.code)
                const inTopFour = index < 4
                const pressure = index === 4 || index === 5

                return (
                  <motion.tr
                    layout
                    key={team.code}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -18 }}
                    transition={{ duration: 0.45 }}
                    className={`rounded-2xl ${
                      inTopFour
                        ? 'bg-[linear-gradient(90deg,rgba(88,149,255,0.18),rgba(255,255,255,0.03))] shadow-[0_10px_30px_rgba(15,91,216,0.12)]'
                        : 'bg-white/[0.03]'
                    }`}
                  >
                    <td className="rounded-l-2xl px-4 py-4 text-sm font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <span>{index + 1}</span>
                        {inTopFour ? <Zap className="h-4 w-4 text-blue-100" /> : null}
                        {pressure ? <ShieldAlert className="h-4 w-4 text-amber-300" /> : null}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 text-xs font-bold text-white"
                          style={{ backgroundColor: `${team.color}22` }}
                        >
                          {team.shortName}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{team.shortName}</p>
                          <p className="text-xs text-slate-400">{team.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-200/85">{team.played}</td>
                    <td className="px-4 py-4 text-sm text-slate-200/85">{team.wins}</td>
                    <td className="px-4 py-4 text-sm text-slate-200/85">{team.losses}</td>
                    <td className="px-4 py-4 text-sm text-slate-200/85">{team.noResults}</td>
                    <td className="px-4 py-4 text-sm font-semibold text-white">{team.points}</td>
                    <td className="px-4 py-4 text-sm font-medium text-slate-200/85">
                      {team.nrr >= 0 ? '+' : ''}
                      {team.nrr.toFixed(3)}
                    </td>
                    <td className="rounded-r-2xl px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2.5 w-24 overflow-hidden rounded-full bg-blue-100/10">
                          <motion.div
                            initial={false}
                            animate={{ width: `${metric?.probability ?? 0}%` }}
                            transition={{ duration: 0.55 }}
                            className={`h-full rounded-full ${
                              inTopFour
                                ? 'bg-gradient-to-r from-blue-200 to-blue-400'
                                : 'bg-gradient-to-r from-amber-300 to-blue-400'
                            }`}
                          />
                        </div>
                        <span className="text-sm font-semibold text-white">{metric?.probability ?? 0}%</span>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </AnimatePresence>
          </motion.tbody>
        </table>
      </div>
    </section>
  )
}
