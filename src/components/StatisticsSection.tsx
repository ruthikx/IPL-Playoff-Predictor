import { motion } from 'framer-motion'
import { BarChart3, Flame, Waves } from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { usePredictorStore } from '../store/usePredictorStore'

const tooltipStyle = {
  background: 'rgba(2, 6, 23, 0.92)',
  border: '1px solid rgba(148, 163, 184, 0.16)',
  borderRadius: '18px',
  color: '#fff',
}

const momentumValue = { W: 100, NR: 58, L: 26 }

export function StatisticsSection() {
  const standings = usePredictorStore((state) => state.standings)
  const metrics = usePredictorStore((state) => state.metrics)

  const probabilityData = standings.map((team) => ({
    team: team.shortName,
    probability: metrics.find((entry) => entry.team === team.code)?.probability ?? 0,
    color: team.color,
  }))

  const momentumData = standings.slice(0, 5).map((team) => ({
    team: team.shortName,
    momentum:
      team.momentum.reduce((sum, result) => sum + momentumValue[result], 0) / team.momentum.length,
  }))

  const nrrData = standings.map((team) => ({
    team: team.shortName,
    nrr: Number(team.nrr.toFixed(3)),
    color: team.color,
  }))

  const chartCards = [
    {
      title: 'Qualification Probability',
      icon: BarChart3,
      content: (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={probabilityData}>
            <CartesianGrid stroke="rgba(148,163,184,0.09)" vertical={false} />
            <XAxis dataKey="team" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="probability" radius={[12, 12, 4, 4]}>
              {probabilityData.map((entry) => (
                <Cell key={entry.team} fill={entry.color} fillOpacity={0.88} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: 'Team Momentum',
      icon: Flame,
      content: (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={momentumData}>
            <defs>
              <linearGradient id="momentumFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#39d0ff" stopOpacity={0.65} />
                <stop offset="100%" stopColor="#39d0ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(148,163,184,0.09)" vertical={false} />
            <XAxis dataKey="team" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="momentum" stroke="#39d0ff" fill="url(#momentumFill)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: 'NRR Comparison',
      icon: Waves,
      content: (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={nrrData}>
            <CartesianGrid stroke="rgba(148,163,184,0.09)" vertical={false} />
            <XAxis dataKey="team" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="nrr" radius={[10, 10, 10, 10]}>
              {nrrData.map((entry) => (
                <Cell key={entry.team} fill={entry.color} fillOpacity={0.86} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ),
    },
  ]

  return (
    <section id="analytics" className="glass-panel glow-border rounded-[32px] p-5 sm:p-6">
      <p className="section-kicker">
        <BarChart3 className="h-3.5 w-3.5" />
        Statistics Section
      </p>
      <div className="mb-6">
        <h2 className="section-title">Probability, Momentum, and NRR Telemetry</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300/74">
          Read the playoff race like a race engineer: qualification odds, current form, and run-rate leverage all update from the same scenario engine.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {chartCards.map((card, index) => {
          const Icon = card.icon
          return (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="rounded-[28px] border border-white/10 bg-slate-950/38 p-4"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/6">
                  <Icon className="h-5 w-5 text-cyan-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{card.title}</p>
                  <p className="text-xs text-slate-400">Realtime projection layer</p>
                </div>
              </div>
              {card.content}
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}
