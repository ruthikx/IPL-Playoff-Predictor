import { Activity, Bot, Sparkles } from 'lucide-react'

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="glass-panel glow-border flex items-center gap-3 rounded-full px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400/15 shadow-[0_0_28px_rgba(57,208,255,0.25)]">
            <Activity className="h-5 w-5 text-cyan-300" />
          </div>
          <div>
            <p className="font-display text-sm tracking-[0.28em] text-white">IPL AI PLAYOFF PREDICTOR</p>
            <p className="text-xs text-slate-300/70">Telemetry-grade scenario simulator</p>
          </div>
        </div>

        <nav className="glass-panel hidden items-center gap-2 rounded-full px-3 py-2 md:flex">
          {[
            ['Simulation', '#simulation'],
            ['Table', '#points-table'],
            ['Analytics', '#analytics'],
            ['Analyst', '#analyst'],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="rounded-full px-4 py-2 text-sm text-slate-200/74 transition hover:bg-white/10 hover:text-white"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="glass-panel flex items-center gap-2 rounded-full px-4 py-3 text-xs text-slate-200/80">
          <Bot className="h-4 w-4 text-cyan-300" />
          <span>AI Analyst Online</span>
          <Sparkles className="h-4 w-4 text-emerald-300" />
        </div>
      </div>
    </header>
  )
}
