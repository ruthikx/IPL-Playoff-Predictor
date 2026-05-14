import { useState } from 'react'
import type { FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bot, CornerDownLeft, Mic, Sparkles } from 'lucide-react'
import { usePredictorStore } from '../store/usePredictorStore'

const quickPrompts = [
  'Does RCB still qualify from here?',
  'Which team needs an NRR boost most?',
  'Explain the current top-four scenario.',
]

export function AnalystPanel() {
  const [message, setMessage] = useState('')
  const analystMessages = usePredictorStore((state) => state.analystMessages)
  const analystTyping = usePredictorStore((state) => state.analystTyping)
  const sendAnalystMessage = usePredictorStore((state) => state.sendAnalystMessage)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const payload = message.trim()
    if (!payload) return
    setMessage('')
    await sendAnalystMessage(payload)
  }

  return (
    <section id="analyst" className="glass-panel-strong glow-border rounded-[32px] p-5 sm:p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="section-kicker">
            <Sparkles className="h-3.5 w-3.5" />
            Cricket Analyst
          </p>
          <h2 className="section-title text-[1.45rem] sm:text-[1.7rem]">Scenario Intelligence Sidebar</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300/74">
            Ask about qualification paths, NRR swings, or bubble-team pressure from the current simulation.
          </p>
        </div>
        <div className="rounded-full border border-blue-100/18 bg-blue-200/10 px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-blue-100">
          Live
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => {
              setMessage('')
              void sendAnalystMessage(prompt)
            }}
            className="rounded-full border border-blue-100/12 bg-blue-200/8 px-3 py-2 text-xs text-slate-200/82 transition hover:bg-blue-200/12 hover:text-white"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="rounded-[28px] border border-blue-100/10 bg-[#091833] p-3">
        <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
          {analystMessages.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-3xl px-4 py-3 ${
                entry.role === 'assistant'
                  ? 'mr-4 border border-blue-100/16 bg-blue-200/10 text-slate-100'
                  : 'ml-8 border border-white/10 bg-white/7 text-white'
              }`}
            >
              <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-slate-400">
                {entry.role === 'assistant' ? <Bot className="h-3.5 w-3.5 text-blue-100" /> : <Mic className="h-3.5 w-3.5 text-white" />}
                {entry.role === 'assistant' ? 'Analyst' : 'You'}
              </div>
              <p className="text-sm leading-7">{entry.content}</p>
            </motion.div>
          ))}

          <AnimatePresence>
            {analystTyping ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                className="mr-6 rounded-3xl border border-blue-100/16 bg-blue-200/10 px-4 py-4"
              >
                <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-slate-400">
                  <Bot className="h-3.5 w-3.5 text-blue-100" />
                  Analyst
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-blue-200 [animation-delay:-0.3s]" />
                  <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-blue-200 [animation-delay:-0.15s]" />
                  <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-blue-200" />
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
          <div className="relative flex-1">
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask about RCB, MI, NRR pressure, or qualification paths..."
              className="w-full rounded-2xl border border-blue-100/12 bg-blue-200/8 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-blue-100/30 focus:bg-blue-200/10"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-2xl border border-blue-100/18 bg-blue-200/12 px-4 py-3 text-sm font-semibold text-blue-50 transition hover:bg-blue-200/16"
          >
            Send
            <CornerDownLeft className="h-4 w-4" />
          </button>
        </form>
      </div>
    </section>
  )
}
