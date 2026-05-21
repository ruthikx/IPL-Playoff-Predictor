import { TEAM_META, fallbackTeams, fixtures } from '../data/ipl'
import type { Fixture, FormResult, MatchOutcome, QualificationMetric, TeamCode, TeamSnapshot } from '../types/ipl'

const roundNrr = (value: number) => Math.round(value * 1000) / 1000

const formValue: Record<FormResult, number> = {
  W: 1,
  NR: 0.45,
  L: 0,
}

const pushForm = (team: TeamSnapshot, result: FormResult) => {
  team.momentum = [...team.momentum, result].slice(-5)
}

export const cloneTeams = (teams: TeamSnapshot[] = fallbackTeams) =>
  teams.map((team) => ({
    ...team,
    momentum: [...team.momentum],
  }))

export const buildStandings = (
  outcomes: Record<string, MatchOutcome>,
  baseTeams: TeamSnapshot[] = fallbackTeams,
) => {
  const teamMap = new Map<TeamCode, TeamSnapshot>(
    cloneTeams(baseTeams).map((team) => [team.code, team]),
  )

  fixtures.forEach((fixture) => {
    const outcome = outcomes[fixture.id]
    if (!outcome) return

    const teamA = teamMap.get(fixture.teamA)
    const teamB = teamMap.get(fixture.teamB)
    if (!teamA || !teamB) return

    teamA.played += 1
    teamB.played += 1

    if (outcome === 'NR') {
      teamA.noResults += 1
      teamB.noResults += 1
      teamA.points += 1
      teamB.points += 1
      pushForm(teamA, 'NR')
      pushForm(teamB, 'NR')
      teamA.nrr = roundNrr(teamA.nrr * 0.998)
      teamB.nrr = roundNrr(teamB.nrr * 0.998)
      return
    }

    const winner = outcome === 'A' ? teamA : teamB
    const loser = outcome === 'A' ? teamB : teamA
    const swing = fixture.nrrSwing

    winner.wins += 1
    loser.losses += 1
    winner.points += 2
    winner.nrr = roundNrr(winner.nrr + swing)
    loser.nrr = roundNrr(loser.nrr - swing * 0.92)
    pushForm(winner, 'W')
    pushForm(loser, 'L')
  })

  return [...teamMap.values()].sort((a, b) => b.points - a.points || b.nrr - a.nrr)
}

const countRemainingGames = (outcomes: Record<string, MatchOutcome>) => {
  const counts = Object.keys(TEAM_META).reduce(
    (acc, team) => ({ ...acc, [team]: 0 }),
    {} as Record<TeamCode, number>,
  )

  fixtures.forEach((fixture) => {
    if (outcomes[fixture.id]) return
    counts[fixture.teamA] += 1
    counts[fixture.teamB] += 1
  })

  return counts
}

const getTrend = (rank: number, probability: number): QualificationMetric['trend'] => {
  if (rank <= 4 && probability >= 50) return 'up'
  if (rank > 4 && probability === 0) return 'down'
  return 'steady'
}

const OUTCOME_OPTIONS: Array<Exclude<MatchOutcome, null>> = ['A', 'B', 'NR']

const getUnresolvedFixtures = (outcomes: Record<string, MatchOutcome>) =>
  fixtures.filter((fixture) => !outcomes[fixture.id])

const getQualificationCounts = (
  baseOutcomes: Record<string, MatchOutcome>,
  baseTeams: TeamSnapshot[],
) => {
  const unresolvedFixtures = getUnresolvedFixtures(baseOutcomes)
  const counts = Object.keys(TEAM_META).reduce(
    (acc, team) => ({ ...acc, [team]: 0 }),
    {} as Record<TeamCode, number>,
  )

  let totalScenarios = 0

  const walk = (fixtureIndex: number, scenarioOutcomes: Record<string, MatchOutcome>) => {
    if (fixtureIndex >= unresolvedFixtures.length) {
      const simulatedStandings = buildStandings(scenarioOutcomes, baseTeams)
      simulatedStandings.slice(0, 4).forEach((team) => {
        counts[team.code] += 1
      })
      totalScenarios += 1
      return
    }

    const fixture = unresolvedFixtures[fixtureIndex]

    OUTCOME_OPTIONS.forEach((outcome) => {
      walk(fixtureIndex + 1, {
        ...scenarioOutcomes,
        [fixture.id]: outcome,
      })
    })
  }

  walk(0, baseOutcomes)

  return { counts, totalScenarios }
}

export const deriveQualificationMetrics = (
  standings: TeamSnapshot[],
  outcomes: Record<string, MatchOutcome>,
  baseTeams: TeamSnapshot[] = fallbackTeams,
): QualificationMetric[] => {
  const { counts, totalScenarios } = getQualificationCounts(outcomes, baseTeams)

  return standings.map((team, index) => {
    const probability =
      totalScenarios === 0 ? (index < 4 ? 100 : 0) : Math.round((counts[team.code] / totalScenarios) * 100)

    return {
      team: team.code,
      probability,
      trend: getTrend(index + 1, probability),
    }
  })
}

export const getMomentumScore = (momentum: FormResult[]) =>
  momentum.reduce((total, value) => total + formValue[value], 0)

export const getTopContenders = (metrics: QualificationMetric[]) =>
  [...metrics].sort((a, b) => b.probability - a.probability).slice(0, 3)

export const getEliminatedTeams = (
  metrics: QualificationMetric[],
  outcomes: Record<string, MatchOutcome>,
  standings: TeamSnapshot[],
) => {
  const remainingGames = countRemainingGames(outcomes)
  const cutoffPoints = standings[3]?.points ?? 0

  return standings
    .filter((team) => {
      const metric = metrics.find((entry) => entry.team === team.code)
      const maxPoints = team.points + remainingGames[team.code] * 2
      return (metric?.probability ?? 0) === 0 || maxPoints < cutoffPoints
    })
    .map((team) => team.code)
}

export const getScenarioHeadline = (
  standings: TeamSnapshot[],
  metrics: QualificationMetric[],
) => {
  const leader = standings[0]
  const bubble = standings[3]
  const chaser = standings[4]
  const bubbleMetric = metrics.find((entry) => entry.team === bubble?.code)
  const chaserMetric = metrics.find((entry) => entry.team === chaser?.code)

  if (!leader || !bubble || !chaser) {
    return 'Simulation ready'
  }

  return `${leader.shortName} control the board, while ${bubble.shortName} (${bubbleMetric?.probability ?? 0}%) and ${chaser.shortName} (${chaserMetric?.probability ?? 0}%) define the playoff line.`
}

export const getFixtureByTeams = (team: TeamCode): Fixture | undefined =>
  fixtures.find((fixture) => fixture.teamA === team || fixture.teamB === team)
