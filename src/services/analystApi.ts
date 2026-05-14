import { fixtures } from '../data/ipl'
import { buildAnalystReply } from '../lib/analyst'
import type { MatchOutcome, QualificationMetric, TeamSnapshot } from '../types/ipl'

export interface AnalystRequest {
  message: string
  standings: TeamSnapshot[]
  metrics: QualificationMetric[]
  outcomes: Record<string, MatchOutcome>
}

export interface AnalystResponse {
  reply: string
}

export const analystApi = {
  async generateReply(payload: AnalystRequest): Promise<AnalystResponse> {
    await new Promise((resolve) => setTimeout(resolve, 1100))

    return {
      reply: buildAnalystReply({
        message: payload.message,
        standings: payload.standings,
        metrics: payload.metrics,
        fixtures,
        outcomes: payload.outcomes,
      }),
    }
  },
}
