import type { LeagueSummary } from '../types/sports'

export function deriveSportOptions(leagues: LeagueSummary[]): string[] {
  return [...new Set(leagues.map((league) => league.sport).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  )
}

export function filterLeagues(
  leagues: LeagueSummary[],
  search: string,
  sport: string,
): LeagueSummary[] {
  const query = search.trim().toLocaleLowerCase()
  return leagues.filter((league) => {
    const matchesSport = !sport || league.sport === sport
    const matchesSearch =
      !query ||
      league.name.toLocaleLowerCase().includes(query) ||
      league.alternateName?.toLocaleLowerCase().includes(query)
    return matchesSport && Boolean(matchesSearch)
  })
}
