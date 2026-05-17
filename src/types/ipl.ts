export type TeamCode =
  | 'GT'
  | 'RCB'
  | 'MI'
  | 'PBKS'
  | 'DC'
  | 'LSG'
  | 'KKR'
  | 'SRH'
  | 'RR'
  | 'CSK'

export type MatchOutcome = 'A' | 'B' | 'NR' | null
export type FormResult = 'W' | 'L' | 'NR'

export interface TeamSnapshot {
  code: TeamCode
  name: string
  shortName: string
  color: string
  played: number
  wins: number
  losses: number
  noResults: number
  points: number
  nrr: number
  momentum: FormResult[]
}

export interface Fixture {
  id: string
  matchDate: string
  dateLabel: string
  timeLabel: string
  venue: string
  stage: string
  teamA: TeamCode
  teamB: TeamCode
  narrative: string
  nrrSwing: number
}

export interface QualificationMetric {
  team: TeamCode
  probability: number
  trend: 'up' | 'down' | 'steady'
}

export interface AnalystMessage {
  id: string
  role: 'assistant' | 'user'
  content: string
  createdAt: number
}
