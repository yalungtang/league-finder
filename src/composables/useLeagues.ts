import { useQuery } from '@tanstack/vue-query'
import { computed, ref } from 'vue'
import { leaguesQueryOptions } from '../api/sportsDbQueries'
import { deriveSportOptions, filterLeagues } from '../utils/filterLeagues'

export function useLeagues() {
  const query = useQuery(leaguesQueryOptions())
  const leagues = computed(() => query.data.value ?? [])
  const search = ref('')
  const selectedSport = ref('')
  const isLoading = computed(() => query.isPending.value)
  const error = computed(() => query.error.value?.message)
  const sportOptions = computed(() => deriveSportOptions(leagues.value))
  const filteredLeagues = computed(() =>
    filterLeagues(leagues.value, search.value, selectedSport.value),
  )

  async function loadLeagues(): Promise<void> {
    await query.refetch()
  }

  function clearFilters(): void {
    search.value = ''
    selectedSport.value = ''
  }

  return {
    leagues,
    search,
    selectedSport,
    isLoading,
    error,
    sportOptions,
    filteredLeagues,
    loadLeagues,
    clearFilters,
  }
}
