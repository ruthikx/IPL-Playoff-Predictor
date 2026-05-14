import { motion } from 'framer-motion'
import { BrainCircuit, Radar, ShieldCheck, Sparkles } from 'lucide-react'
import { usePredictorStore } from '../store/usePredictorStore'

export function HeroSection() {
  const headline = usePredictorStore((state) => state.headline)

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_420px]">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75 }}
        className="glass-panel-strong glow-border relative overflow-hidden rounded-[32px] px-6 py-5 sm:px-8 sm:py-6"
      >
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,_rgba(57,208,255,0.16),_transparent_58%)]" />
        <div className="relative z-10 max-w-3xl">
          <div className="section-kicker">
            <Sparkles className="h-3.5 w-3.5" />
            IPL Dashboard
          </div>
          <h1 className="font-display text-4xl leading-[0.95] tracking-[0.08em] text-white sm:text-6xl xl:text-[5rem]">
            IPL
            <span className="block bg-gradient-to-r from-cyan-300 via-white to-emerald-300 bg-clip-text text-transparent">
              Playoff Predictor
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Simulate scenarios, follow qualification paths, and track the playoff race with instant table updates and NRR pressure insights.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <div className="stat-chip">
              <Radar className="h-4 w-4 text-cyan-300" />
              Live scenario tracker
            </div>
            <div className="stat-chip">
              <BrainCircuit className="h-4 w-4 text-emerald-300" />
              Match insight panel
            </div>
            <div className="stat-chip">
              <ShieldCheck className="h-4 w-4 text-amber-300" />
              Backend integration ready
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, delay: 0.12 }}
        className="glass-panel glow-border rounded-[32px] p-4"
      >
        <p className="section-kicker">Match Summary</p>
        <div className="rounded-[28px] border border-cyan-300/15 bg-slate-950/40 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300/70">Match Readout</p>
            <span className="rounded-full bg-emerald-400/12 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-emerald-300">
              Live
            </span>
          </div>
          <p className="text-lg font-semibold text-white">{headline}</p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              ['Pulse', 'Realtime'],
              ['Engine', 'NRR + Pts'],
              ['Mode', 'Manual Sim'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                <p className="text-[11px] uppercase tracking-[0.26em] text-slate-400">{label}</p>
                <p className="mt-2 text-sm font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
