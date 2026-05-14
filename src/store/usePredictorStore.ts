import { create } from 'zustand'
import { fallbackTeams, fixtures } from '../data/ipl'
import {
  buildStandings,
  deriveQualificationMetrics,
  getEliminatedTeams,
  getScenarioHeadline,
  getTopContenders,
} from '../lib/simulation'
import { analystApi } from '../services/analystApi'
import type { AnalystMessage, MatchOutcome, QualificationMetric, TeamCode, TeamSnapshot } from '../types/ipl'

interface PredictorState {
  baseTeams: TeamSnapshot[]
  outcomes: Record<string, MatchOutcome>
  standings: TeamSnapshot[]
  metrics: QualificationMetric[]
  headline: string
  topContenders: QualificationMetric[]
  eliminatedTeams: TeamCode[]
  analystMessages: AnalystMessage[]
  analystTyping: boolean
  hydrateTeams: (teams: TeamSnapshot[]) => void
  setOutcome: (fixtureId: string, outcome: MatchOutcome) => void
  resetSimulation: () => void
  sendAnalystMessage: (message: string) => Promise<void>
}

const cloneTeams = (teams: TeamSnapshot[]) =>
  teams.map((team) => ({
    ...team,
    momentum: [...team.momentum],
  }))

const createSnapshot = (outcomes: Record<string, MatchOutcome>, baseTeams: TeamSnapshot[]) => {
  const standings = buildStandings(outcomes, baseTeams)
  const metrics = deriveQualificationMetrics(standings, outcomes)

  return {
    standings,
    metrics,
    headline: getScenarioHeadline(standings, metrics),
    topContenders: getTopContenders(metrics),
    eliminatedTeams: getEliminatedTeams(metrics, outcomes, standings),
  }
}

const initialOutcomes = fixtures.reduce(
  (acc, fixture) => ({ ...acc, [fixture.id]: null }),
  {} as Record<string, MatchOutcome>,
)

const initialSnapshot = createSnapshot(initialOutcomes, fallbackTeams)

export const usePredictorStore = create<PredictorState>((set, get) => ({
  baseTeams: cloneTeams(fallbackTeams),
  outcomes: initialOutcomes,
  ...initialSnapshot,
  analystTyping: false,
  analystMessages: [
    {
      id: 'seed-1',
      role: 'assistant',
      content:
        'Simulation is live. Ask me about qualification paths, NRR pressure, or which fixture creates the biggest playoff swing.',
      createdAt: Date.now(),
    },
  ],
  hydrateTeams: (teams) => {
    const nextBaseTeams = cloneTeams(teams)

    set((state) => ({
      baseTeams: nextBaseTeams,
      ...createSnapshot(state.outcomes, nextBaseTeams),
    }))
  },
  setOutcome: (fixtureId, outcome) => {
    const current = get().outcomes[fixtureId]
    const nextOutcome = current === outcome ? null : outcome
    const nextOutcomes = { ...get().outcomes, [fixtureId]: nextOutcome }
    const baseTeams = get().baseTeams

    set({
      outcomes: nextOutcomes,
      ...createSnapshot(nextOutcomes, baseTeams),
    })
  },
  resetSimulation: () => {
    const baseTeams = get().baseTeams

    set({
      outcomes: initialOutcomes,
      ...createSnapshot(initialOutcomes, baseTeams),
    })
  },
  sendAnalystMessage: async (message) => {
    const trimmed = message.trim()
    if (!trimmed) return

    const userMessage: AnalystMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      createdAt: Date.now(),
    }

    set((state) => ({
      analystMessages: [...state.analystMessages, userMessage],
      analystTyping: true,
    }))

    const { reply } = await analystApi.generateReply({
      message: trimmed,
      standings: get().standings,
      metrics: get().metrics,
      outcomes: get().outcomes,
    })

    const assistantMessage: AnalystMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: reply,
      createdAt: Date.now(),
    }

    set((state) => ({
      analystTyping: false,
      analystMessages: [...state.analystMessages, assistantMessage],
    }))
  },
}))
