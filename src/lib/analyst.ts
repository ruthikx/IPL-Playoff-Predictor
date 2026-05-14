import { TEAM_META } from '../data/ipl'
import { getFixtureByTeams } from './simulation'
import type { Fixture, MatchOutcome, QualificationMetric, TeamCode, TeamSnapshot } from '../types/ipl'

const teamAliases: Record<string, TeamCode> = {
  gt: 'GT',
  gujarat: 'GT',
  titans: 'GT',
  rcb: 'RCB',
  bengaluru: 'RCB',
  mi: 'MI',
  mumbai: 'MI',
  pbks: 'PBKS',
  punjab: 'PBKS',
  dc: 'DC',
  delhi: 'DC',
  lsg: 'LSG',
  lucknow: 'LSG',
  kkr: 'KKR',
  kolkata: 'KKR',
  srh: 'SRH',
  hyderabad: 'SRH',
  rr: 'RR',
  rajasthan: 'RR',
  csk: 'CSK',
  chennai: 'CSK',
}

const getTeamMention = (message: string): TeamCode | null => {
  const normalized = message.toLowerCase()
  const alias = Object.entries(teamAliases).find(([key]) => normalized.includes(key))
  return alias?.[1] ?? null
}

const getMetric = (team: TeamCode, metrics: QualificationMetric[]) =>
  metrics.find((entry) => entry.team === team)?.probability ?? 0

const formatNrr = (nrr: number) => `${nrr >= 0 ? '+' : ''}${nrr.toFixed(3)}`

const getTeamResponse = (
  teamCode: TeamCode,
  standings: TeamSnapshot[],
  metrics: QualificationMetric[],
) => {
  const team = standings.find((entry) => entry.code === teamCode)
  const fourth = standings[3]
  const fifth = standings[4]
  const fixture = getFixtureByTeams(teamCode)
  if (!team || !fourth || !fifth) return null

  const rank = standings.findIndex((entry) => entry.code === teamCode) + 1
  const probability = getMetric(teamCode, metrics)
  const teamName = TEAM_META[teamCode].shortName
  const statusLine =
    rank <= 4
      ? `${teamName} are inside the top four in this simulation, but the cutoff is still live because ${fifth.shortName} are only ${Math.max(0, fourth.points - fifth.points)} points behind.`
      : `${teamName} are chasing ${fourth.shortName} by ${Math.max(0, fourth.points - team.points)} points, so they need both results and NRR to move their way.`
  const fixtureLine = fixture
    ? `The biggest swing fixture for them is ${fixture.teamA} vs ${fixture.teamB} at ${fixture.venue}.`
    : 'Their remaining schedule is doing most of the heavy lifting now.'

  return `${teamName} sit ${rank}${rank === 1 ? 'st' : rank === 2 ? 'nd' : rank === 3 ? 'rd' : 'th'} with ${team.points} points and ${formatNrr(team.nrr)} NRR. Their projected qualification chance is ${probability}%. ${statusLine} ${fixtureLine}`
}

const getNrrResponse = (standings: TeamSnapshot[]) => {
  const best = [...standings].sort((a, b) => b.nrr - a.nrr)[0]
  const worstBubble = [...standings]
    .filter((team) => team.points >= 10 && team.points <= 14)
    .sort((a, b) => a.nrr - b.nrr)[0]

  return `${best.shortName} have the strongest NRR leverage at ${formatNrr(best.nrr)}. ${worstBubble.shortName} are the most exposed bubble side at ${formatNrr(worstBubble.nrr)}, so they likely need a big-margin win rather than just two points.`
}

const getTopFourResponse = (standings: TeamSnapshot[], metrics: QualificationMetric[]) => {
  const locked = standings
    .slice(0, 4)
    .map((team) => `${team.shortName} ${getMetric(team.code, metrics)}%`)
    .join(', ')
  const chase = standings
    .slice(4, 6)
    .map((team) => `${team.shortName} ${getMetric(team.code, metrics)}%`)
    .join(', ')

  return `Right now the projected top four are ${locked}. The pressure line sits just behind them with ${chase}, so one direct-result swing can still flip the final playoff slot.`
}

const getGenericResponse = (
  standings: TeamSnapshot[],
  fixtures: Fixture[],
  outcomes: Record<string, MatchOutcome>,
) => {
  const unresolved = fixtures.filter((fixture) => !outcomes[fixture.id])
  const keyFixture = unresolved[0] ?? fixtures[0]
  const leader = standings[0]
  const bubble = standings[3]

  return `${leader.shortName} are steering the table, but the real tension is around ${bubble.shortName}'s playoff line at ${bubble.points} points. If you want the cleanest scenario fork, start with ${keyFixture.teamA} vs ${keyFixture.teamB}; that match has a direct ripple on both points and NRR.`
}

export const buildAnalystReply = ({
  message,
  standings,
  metrics,
  fixtures,
  outcomes,
}: {
  message: string
  standings: TeamSnapshot[]
  metrics: QualificationMetric[]
  fixtures: Fixture[]
  outcomes: Record<string, MatchOutcome>
}) => {
  const normalized = message.toLowerCase()
  const mentionedTeam = getTeamMention(normalized)

  if (mentionedTeam) {
    return getTeamResponse(mentionedTeam, standings, metrics) ?? getGenericResponse(standings, fixtures, outcomes)
  }

  if (normalized.includes('nrr') || normalized.includes('run rate') || normalized.includes('margin')) {
    return getNrrResponse(standings)
  }

  if (
    normalized.includes('qualif') ||
    normalized.includes('playoff') ||
    normalized.includes('top 4') ||
    normalized.includes('scenario')
  ) {
    return getTopFourResponse(standings, metrics)
  }

  return getGenericResponse(standings, fixtures, outcomes)
}
