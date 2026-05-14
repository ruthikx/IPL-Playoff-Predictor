import { motion } from 'framer-motion'
import { AlertTriangle, ArrowUpRight, Crown, Trophy } from 'lucide-react'
import { TEAM_META } from '../data/ipl'
import { usePredictorStore } from '../store/usePredictorStore'

export function OverviewCards() {
  const metrics = usePredictorStore((state) => state.metrics)
  const topContenders = usePredictorStore((state) => state.topContenders)
  const eliminatedTeams = usePredictorStore((state) => state.eliminatedTeams)
  const standings = usePredictorStore((state) => state.standings)

  const averageProbability =
    Math.round(metrics.slice(0, 4).reduce((sum, item) => sum + item.probability, 0) / 4) || 0
  const projectedLeader = standings[0]

  const cards = [
    {
      title: 'Qualification Pulse',
      value: `${averageProbability}%`,
      icon: Trophy,
      accent: 'from-blue-300/30 to-blue-500/10',
      note: 'Average top-four conversion rate in the current simulation.',
    },
    {
      title: 'Top Contenders',
      value: topContenders.map((entry) => entry.team).join(' / '),
      icon: Crown,
      accent: 'from-blue-400/24 to-sky-300/10',
      note: topContenders
        .map((entry) => `${entry.team} ${entry.probability}%`)
        .join(' • '),
    },
    {
      title: 'Elimination Watch',
      value: eliminatedTeams.length ? eliminatedTeams.join(' / ') : 'No side fully out',
      icon: AlertTriangle,
      accent: 'from-amber-300/30 to-blue-500/10',
      note: 'Flags teams with minimal qualification routes left in this scenario tree.',
    },
    {
      title: 'Projected Leader',
      value: projectedLeader?.shortName ?? 'GT',
      icon: ArrowUpRight,
      accent: 'from-blue-500/26 to-sky-300/10',
      note: projectedLeader
        ? `${TEAM_META[projectedLeader.code].name} lead with ${projectedLeader.points} pts and ${projectedLeader.nrr >= 0 ? '+' : ''}${projectedLeader.nrr.toFixed(3)} NRR.`
        : 'Leaderboard initializing.',
    },
  ]

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <motion.article
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: index * 0.08 }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="glass-panel glow-border rounded-[28px] p-5"
          >
            <div className={`mb-4 rounded-2xl bg-gradient-to-br ${card.accent} p-[1px]`}>
              <div className="flex items-center justify-between rounded-2xl bg-[#0b1c3d] px-4 py-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{card.title}</p>
                  <p className="mt-3 text-2xl font-semibold text-white">{card.value}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-200/10">
                  <Icon className="h-5 w-5 text-blue-100" />
                </div>
              </div>
            </div>
            <p className="text-sm leading-6 text-slate-300/76">{card.note}</p>
          </motion.article>
        )
      })}
    </section>
  )
}
