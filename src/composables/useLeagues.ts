import { computed, onMounted, ref } from 'vue'
import { fetchAllLeagues } from '../api/sportsDbApi'
import type { LeagueSummary } from '../types/sports'
import { deriveSportOptions, filterLeagues } from '../utils/filterLeagues'

export function useLeagues() {
  const leagues = ref<LeagueSummary[]>([])
  const search = ref('')
  const selectedSport = ref('')
  const isLoading = ref(true)
  const error = ref<string>()
  const sportOptions = computed(() => deriveSportOptions(leagues.value))
  const filteredLeagues = computed(() =>
    filterLeagues(leagues.value, search.value, selectedSport.value),
  )
  async function loadLeagues(): Promise<void> {
    isLoading.value = true
    error.value = undefined
    try {
      leagues.value = await fetchAllLeagues()
    } catch (reason) {
      error.value = reason instanceof Error ? reason.message : 'Unable to load leagues'
    } finally {
      isLoading.value = false
    }
  }
  function clearFilters(): void {
    search.value = ''
    selectedSport.value = ''
  }
  onMounted(loadLeagues)
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
