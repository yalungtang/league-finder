import type {
  AllLeaguesResponse,
  LeagueDetails,
  LeagueDetailsResponse,
  LeagueSummary,
  Season,
  SeasonsResponse,
} from '../types/sports'
import { normalizeLeagueDetails, normalizeLeagueSummary, normalizeSeason } from '../utils/normalize'

const DEFAULT_BASE_URL = 'https://www.thesportsdb.com/api/v1/json'
const DEFAULT_API_KEY = '3'

export class SportsDbRequestError extends Error {
  constructor(public readonly status: number) {
    super(`TheSportsDB request failed (${status})`)
    this.name = 'SportsDbRequestError'
  }
}

function apiUrl(path: string, params?: Record<string, string>): string {
  const baseUrl = (import.meta.env.VITE_SPORTSDB_API_BASE_URL || DEFAULT_BASE_URL).replace(
    /\/$/,
    '',
  )
  const apiKey = import.meta.env.VITE_SPORTSDB_API_KEY || DEFAULT_API_KEY
  const url = new URL(`${baseUrl}/${apiKey}/${path}`)
  Object.entries(params ?? {}).forEach(([key, value]) => url.searchParams.set(key, value))
  return url.toString()
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!response.ok) throw new SportsDbRequestError(response.status)
  return (await response.json()) as T
}

export async function fetchAllLeagues(): Promise<LeagueSummary[]> {
  const data = await fetchJson<AllLeaguesResponse>(apiUrl('all_leagues.php'))
  return (data.leagues ?? [])
    .map(normalizeLeagueSummary)
    .filter((league): league is LeagueSummary => Boolean(league))
}

export async function fetchLeagueDetails(id: string): Promise<LeagueDetails | null> {
  const data = await fetchJson<LeagueDetailsResponse>(apiUrl('lookupleague.php', { id }))
  const raw = data.leagues?.[0]
  return raw ? (normalizeLeagueDetails(raw) ?? null) : null
}

export async function fetchLeagueSeasons(id: string): Promise<Season[]> {
  const data = await fetchJson<SeasonsResponse>(
    apiUrl('search_all_seasons.php', { badge: '1', id }),
  )
  return (data.seasons ?? []).map(normalizeSeason)
}
