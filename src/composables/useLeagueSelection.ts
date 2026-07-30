import { useQuery } from '@tanstack/vue-query'
import { computed, ref } from 'vue'
import { fetchLeagueDetails, fetchLeagueSeasons } from '../api/sportsDbApi'
import {
  leagueDetailsStaleTime,
  leagueSeasonsStaleTime,
  shouldRetrySportsDbRequest,
  sportsDbCacheMaxAge,
  sportsDbQueryKeys,
} from '../api/sportsDbQueries'
import type { AsyncStatus, LeagueDetails, LeagueSummary, Season } from '../types/sports'
import { selectSeasonBadge } from '../utils/normalize'

export function useLeagueSelection() {
  const selectedLeague = ref<LeagueSummary>()
  const selectedId = computed(() => selectedLeague.value?.id)
  const detailsQuery = useQuery<LeagueDetails | null>({
    queryKey: computed(() => sportsDbQueryKeys.details(selectedId.value ?? 'unselected')),
    queryFn: () => fetchLeagueDetails(selectedId.value!),
    enabled: computed(() => Boolean(selectedId.value)),
    staleTime: leagueDetailsStaleTime,
    gcTime: sportsDbCacheMaxAge,
    retry: shouldRetrySportsDbRequest,
  })
  const seasonsQuery = useQuery<Season[]>({
    queryKey: computed(() => sportsDbQueryKeys.seasons(selectedId.value ?? 'unselected')),
    queryFn: () => fetchLeagueSeasons(selectedId.value!),
    enabled: computed(() => Boolean(selectedId.value)),
    staleTime: leagueSeasonsStaleTime,
    gcTime: sportsDbCacheMaxAge,
    retry: shouldRetrySportsDbRequest,
  })
  const details = computed(() => detailsQuery.data.value ?? null)
  const seasons = computed(() => seasonsQuery.data.value ?? [])
  const detailsStatus = computed<AsyncStatus>(() => queryStatus(detailsQuery.status.value))
  const seasonsStatus = computed<AsyncStatus>(() => queryStatus(seasonsQuery.status.value))
  const seasonBadge = computed(() => selectSeasonBadge(seasons.value, details.value?.currentSeason))

  function queryStatus(status: 'pending' | 'error' | 'success'): AsyncStatus {
    if (!selectedLeague.value) return 'idle'
    if (status === 'pending') return 'loading'
    return status
  }

  function selectLeague(league: LeagueSummary): void {
    selectedLeague.value = league
  }

  function clearSelection(): void {
    selectedLeague.value = undefined
  }

  function retryDetails(): void {
    if (selectedLeague.value) void detailsQuery.refetch()
  }

  function retrySeasons(): void {
    if (selectedLeague.value) void seasonsQuery.refetch()
  }

  return {
    selectedLeague,
    details,
    detailsStatus,
    seasonsStatus,
    seasonBadge,
    selectLeague,
    clearSelection,
    retryDetails,
    retrySeasons,
  }
}
