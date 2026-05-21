import { TEAM_META, fallbackTeams } from '../data/ipl'
import type { FormResult, TeamCode, TeamSnapshot } from '../types/ipl'

const IPL_SERIES_ID = '87c62aac-bc3c-4738-ab93-19da0690488f'

const TEAM_NAME_TO_CODE: Record<string, TeamCode> = {
  'Gujarat Titans': 'GT',
  'Royal Challengers Bengaluru': 'RCB',
  'Royal Challengers Bangalore': 'RCB',
  'Mumbai Indians': 'MI',
  'Punjab Kings': 'PBKS',
  'Delhi Capitals': 'DC',
  'Lucknow Super Giants': 'LSG',
  'Kolkata Knight Riders': 'KKR',
  'Sunrisers Hyderabad': 'SRH',
  'Rajasthan Royals': 'RR',
  'Chennai Super Kings': 'CSK',
}

interface SeriesPointsEntry {
  teamname?: string
  matches?: number | string
  wins?: number | string
  loss?: number | string
  nr?: number | string
}

interface SeriesInfoMatch {
  status?: string
  dateTimeGMT?: string
  teamInfo?: Array<{
    name?: string
  }>
  teams?: string[]
  matchEnded?: boolean
}

const getNumericValue = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value)
    if (Number.isFinite(parsed)) return parsed
  }

  return 0
}

const getStringValue = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() ? value.trim() : null

const cloneFallbackTeams = () =>
  fallbackTeams.map((team) => ({
    ...team,
    momentum: [...team.momentum],
  }))

const getFallbackMomentum = (code: TeamCode) =>
  fallbackTeams.find((team) => team.code === code)?.momentum ?? []

const getFallbackNrr = (code: TeamCode) =>
  fallbackTeams.find((team) => team.code === code)?.nrr ?? 0

const getMatchTeams = (match: SeriesInfoMatch): TeamCode[] => {
  const names =
    match.teamInfo?.map((team) => team.name).filter((name): name is string => Boolean(name)) ??
    match.teams?.filter((name): name is string => Boolean(name)) ??
    []

  return names
    .map((name) => TEAM_NAME_TO_CODE[name])
    .filter((code): code is TeamCode => Boolean(code))
}

const getTeamResultFromMatch = (match: SeriesInfoMatch, code: TeamCode): FormResult | null => {
  const status = getStringValue(match.status)?.toLowerCase() ?? ''

  if (!status) return null
  if (status.includes('no result')) return 'NR'

  const teamName = TEAM_META[code].name.toLowerCase()
  return status.includes(teamName) && status.includes('won') ? 'W' : 'L'
}

const buildMomentumByTeam = (matches: SeriesInfoMatch[]): Partial<Record<TeamCode, FormResult[]>> => {
  const recentResults = new Map<TeamCode, Array<{ date: number; result: FormResult }>>()

  for (const match of matches) {
    if (!match.matchEnded) continue

    const teams = getMatchTeams(match)
    if (teams.length !== 2) continue

    const matchDate = Date.parse(match.dateTimeGMT ?? '')
    const date = Number.isFinite(matchDate) ? matchDate : 0

    for (const code of teams) {
      const result = getTeamResultFromMatch(match, code)
      if (!result) continue

      const current = recentResults.get(code) ?? []
      current.push({ date, result })
      recentResults.set(code, current)
    }
  }

  const momentumByTeam: Partial<Record<TeamCode, FormResult[]>> = {}

  for (const [code, results] of recentResults) {
    momentumByTeam[code] = results
      .sort((a, b) => b.date - a.date)
      .slice(0, 5)
      .map((entry) => entry.result)
  }

  return momentumByTeam
}

export async function fetchLiveTeams(): Promise<TeamSnapshot[]> {
  const apiKey = import.meta.env.VITE_CRICAPI_KEY

  if (!apiKey) {
    return cloneFallbackTeams()
  }

  try {
    const [pointsResponse, seriesResponse] = await Promise.all([
      fetch(`https://api.cricapi.com/v1/series_points?apikey=${apiKey}&id=${IPL_SERIES_ID}`),
      fetch(`https://api.cricapi.com/v1/series_info?apikey=${apiKey}&id=${IPL_SERIES_ID}`),
    ])

    if (!pointsResponse.ok) {
      throw new Error(`CricAPI series_points request failed with status ${pointsResponse.status}`)
    }

    if (!seriesResponse.ok) {
      throw new Error(`CricAPI series_info request failed with status ${seriesResponse.status}`)
    }

    const pointsPayload = (await pointsResponse.json()) as {
      data?: SeriesPointsEntry[]
    }
    const seriesPayload = (await seriesResponse.json()) as {
      data?: {
        matchList?: SeriesInfoMatch[]
      }
    }

    const momentumByTeam = buildMomentumByTeam(seriesPayload.data?.matchList ?? [])
    const rows = Array.isArray(pointsPayload.data) ? pointsPayload.data : []
    const liveTeams = rows
      .map((entry) => {
        const teamName = getStringValue(entry.teamname)
        if (!teamName) return null

        const code = TEAM_NAME_TO_CODE[teamName]
        if (!code) return null

        const meta = TEAM_META[code]
        const played = getNumericValue(entry.matches)
        const wins = getNumericValue(entry.wins)
        const losses = getNumericValue(entry.loss)
        const noResults = getNumericValue(entry.nr)
        const points = wins * 2 + noResults
        const fallbackNrr = getFallbackNrr(code)
        return {
          code,
          name: meta.name,
          shortName: meta.shortName,
          color: meta.color,
          played,
          wins,
          losses,
          noResults,
          points,
          // CricAPI's series_points payload currently omits NRR, so keep the latest
          // known table NRR as the display and tie-break baseline.
          nrr: fallbackNrr,
          momentum: [...(momentumByTeam[code] ?? getFallbackMomentum(code))],
        } satisfies TeamSnapshot
      })
      .filter((team): team is TeamSnapshot => team !== null)

    const uniqueTeams = Array.from(new Map(liveTeams.map((team) => [team.code, team])).values())
      .sort((a, b) => b.points - a.points || b.nrr - a.nrr)

    if (uniqueTeams.length === 0) {
      return cloneFallbackTeams()
    }

    return uniqueTeams
  } catch {
    return cloneFallbackTeams()
  }
}
