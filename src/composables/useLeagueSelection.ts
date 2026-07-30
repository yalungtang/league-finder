import { computed, ref } from 'vue'
import { fetchLeagueDetails, fetchLeagueSeasons } from '../api/sportsDbApi'
import type { AsyncStatus, LeagueDetails, LeagueSummary, Season } from '../types/sports'
import { selectSeasonBadge } from '../utils/normalize'

export function useLeagueSelection() {
  const selectedLeague = ref<LeagueSummary>()
  const details = ref<LeagueDetails | null>(null)
  const seasons = ref<Season[]>([])
  const detailsStatus = ref<AsyncStatus>('idle')
  const seasonsStatus = ref<AsyncStatus>('idle')
  let version = 0
  const seasonBadge = computed(() => selectSeasonBadge(seasons.value, details.value?.currentSeason))
  async function loadDetails(league: LeagueSummary, token: number) {
    detailsStatus.value = 'loading'
    try {
      const value = await fetchLeagueDetails(league.id)
      if (token === version) {
        details.value = value
        detailsStatus.value = 'success'
      }
    } catch {
      if (token === version) {
        details.value = null
        detailsStatus.value = 'error'
      }
    }
  }
  async function loadSeasons(league: LeagueSummary, token: number) {
    seasonsStatus.value = 'loading'
    try {
      const value = await fetchLeagueSeasons(league.id)
      if (token === version) {
        seasons.value = value
        seasonsStatus.value = 'success'
      }
    } catch {
      if (token === version) {
        seasons.value = []
        seasonsStatus.value = 'error'
      }
    }
  }
  function selectLeague(league: LeagueSummary) {
    const token = ++version
    selectedLeague.value = league
    details.value = null
    seasons.value = []
    void loadDetails(league, token)
    void loadSeasons(league, token)
  }
  function clearSelection() {
    version += 1
    selectedLeague.value = undefined
    details.value = null
    seasons.value = []
    detailsStatus.value = 'idle'
    seasonsStatus.value = 'idle'
  }
  function retryDetails() {
    if (selectedLeague.value) void loadDetails(selectedLeague.value, version)
  }
  function retrySeasons() {
    if (selectedLeague.value) void loadSeasons(selectedLeague.value, version)
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
