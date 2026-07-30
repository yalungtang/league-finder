import { queryOptions } from '@tanstack/vue-query'
import {
  fetchAllLeagues,
  fetchLeagueDetails,
  fetchLeagueSeasons,
  SportsDbRequestError,
} from './sportsDbApi'

const minute = 60 * 1000
export const sportsDbCacheMaxAge = 24 * 60 * minute
export const leaguesStaleTime = 15 * minute
export const leagueDetailsStaleTime = 30 * minute
export const leagueSeasonsStaleTime = 6 * 60 * minute

export const sportsDbQueryKeys = {
  all: ['sports-db'] as const,
  leagues: () => [...sportsDbQueryKeys.all, 'leagues'] as const,
  details: (id: string) => [...sportsDbQueryKeys.all, 'league', id, 'details'] as const,
  seasons: (id: string) => [...sportsDbQueryKeys.all, 'league', id, 'seasons'] as const,
}

export function shouldRetrySportsDbRequest(failureCount: number, error: Error): boolean {
  if (failureCount >= 1) return false
  if (error instanceof SportsDbRequestError) return error.status === 429 || error.status >= 500
  return true
}

export function leaguesQueryOptions() {
  return queryOptions({
    queryKey: sportsDbQueryKeys.leagues(),
    queryFn: fetchAllLeagues,
    staleTime: leaguesStaleTime,
    gcTime: sportsDbCacheMaxAge,
    retry: shouldRetrySportsDbRequest,
  })
}

export function leagueDetailsQueryOptions(id: string) {
  return queryOptions({
    queryKey: sportsDbQueryKeys.details(id),
    queryFn: () => fetchLeagueDetails(id),
    staleTime: leagueDetailsStaleTime,
    gcTime: sportsDbCacheMaxAge,
    retry: shouldRetrySportsDbRequest,
  })
}

export function leagueSeasonsQueryOptions(id: string) {
  return queryOptions({
    queryKey: sportsDbQueryKeys.seasons(id),
    queryFn: () => fetchLeagueSeasons(id),
    staleTime: leagueSeasonsStaleTime,
    gcTime: sportsDbCacheMaxAge,
    retry: shouldRetrySportsDbRequest,
  })
}
