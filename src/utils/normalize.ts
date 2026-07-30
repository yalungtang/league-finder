import type {
  ApiLeagueDetails,
  ApiLeagueSummary,
  ApiSeason,
  LeagueDetails,
  LeagueSummary,
  Season,
  SelectedSeasonBadge,
} from '../types/sports'

export function cleanString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const normalized = value.trim().replace(/\s+/g, ' ')
  return normalized || undefined
}

export function normalizeLeagueSummary(raw: ApiLeagueSummary): LeagueSummary | undefined {
  const id = cleanString(raw.idLeague)
  const name = cleanString(raw.strLeague)
  const sport = cleanString(raw.strSport)
  if (!id || !name || !sport) return undefined
  return { id, name, sport, alternateName: cleanString(raw.strLeagueAlternate) }
}

export function pickFanart(raw: ApiLeagueDetails): string | undefined {
  return [raw.strFanart1, raw.strFanart2, raw.strFanart3, raw.strFanart4, raw.strBanner]
    .map(cleanString)
    .find((value): value is string => Boolean(value))
}

export function normalizeLeagueDetails(raw: ApiLeagueDetails): LeagueDetails | undefined {
  const summary = normalizeLeagueSummary(raw)
  if (!summary) return undefined
  return {
    ...summary,
    country: cleanString(raw.strCountry),
    currentSeason: cleanString(raw.strCurrentSeason),
    formedYear: cleanString(raw.intFormedYear),
    description: cleanString(raw.strDescriptionEN),
    fanartUrl: pickFanart(raw),
  }
}

export function normalizeSeason(raw: ApiSeason): Season {
  return { name: cleanString(raw.strSeason), badgeUrl: cleanString(raw.strBadge) }
}

export function selectSeasonBadge(
  seasons: Season[],
  currentSeason?: string,
): SelectedSeasonBadge | undefined {
  const current = cleanString(currentSeason)?.toLocaleLowerCase()
  const match = current
    ? seasons.find((season) => season.badgeUrl && season.name?.toLocaleLowerCase() === current)
    : undefined
  const selected = match ?? seasons.find((season) => season.badgeUrl)
  return selected?.badgeUrl ? { season: selected.name, url: selected.badgeUrl } : undefined
}

export function leagueInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}
