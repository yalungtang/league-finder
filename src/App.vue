<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataAttribution from './components/DataAttribution.vue'
import DetailEmptyState from './components/DetailEmptyState.vue'
import DetailViewSkeleton from './components/DetailViewSkeleton.vue'
import DiscoveryIntro from './components/DiscoveryIntro.vue'
import LeagueDetail from './components/LeagueDetail.vue'
import LeagueFilters from './components/LeagueFilters.vue'
import LeagueList from './components/LeagueList.vue'
import LeagueListSkeleton from './components/LeagueListSkeleton.vue'
import LeagueLoadError from './components/LeagueLoadError.vue'
import StateMessage from './components/StateMessage.vue'
import { useLeagues } from './composables/useLeagues'
import { useLeagueSelection } from './composables/useLeagueSelection'
import type { LeagueSummary } from './types/sports'

const catalogue = useLeagues()
const selection = useLeagueSelection()
const route = useRoute()
const router = useRouter()
const lastSelectedId = ref<string>()
const routeLeagueId = computed(() =>
  route.name === 'league' && typeof route.params.id === 'string' ? route.params.id : undefined,
)
const isDetailRoute = computed(() => Boolean(routeLeagueId.value))
const isDetailLoading = computed(
  () =>
    isDetailRoute.value &&
    (catalogue.isLoading.value ||
      Boolean(
        selection.selectedLeague.value &&
        (selection.detailsStatus.value === 'loading' ||
          selection.seasonsStatus.value === 'loading'),
      )),
)

function showLeague(league: LeagueSummary): void {
  lastSelectedId.value = league.id
  if (selection.selectedLeague.value?.id !== league.id) selection.selectLeague(league)
  if (window.matchMedia('(max-width: 1023px)').matches) document.body.classList.add('detail-open')
}

function selectLeague(league: LeagueSummary): void {
  if (routeLeagueId.value !== league.id)
    void router.push({ name: 'league', params: { id: league.id } })
  showLeague(league)
}

function showCatalogue(): void {
  selection.clearSelection()
  document.body.classList.remove('detail-open')
}

function navigateToAllLeagues(): void {
  catalogue.clearFilters()
  if (route.name !== 'catalogue') void router.push({ name: 'catalogue' })
  showCatalogue()
}

function syncRoute(): void {
  const routeId = routeLeagueId.value
  if (!routeId) {
    showCatalogue()
    return
  }
  if (catalogue.isLoading.value) return
  if (catalogue.error.value) return

  const league = catalogue.leagues.value.find((item) => item.id === routeId)
  if (league) {
    showLeague(league)
    return
  }

  void router.replace({ name: 'catalogue' })
  showCatalogue()
}

async function closeMobileDetail(): Promise<void> {
  await router.replace({ name: 'catalogue' })
  showCatalogue()
  await nextTick()
  if (lastSelectedId.value) document.getElementById(`league-row-${lastSelectedId.value}`)?.focus()
}

watch([routeLeagueId, catalogue.leagues, catalogue.isLoading], syncRoute, { immediate: true })

watch(catalogue.filteredLeagues, (visible) => {
  const id = selection.selectedLeague.value?.id
  if (id && !visible.some((league) => league.id === id)) {
    void router.replace({ name: 'catalogue' })
    showCatalogue()
  }
})

onBeforeUnmount(() => {
  document.body.classList.remove('detail-open')
})
</script>

<template>
  <main class="app-shell h-dvh overflow-hidden lg:grid lg:grid-cols-[520px_minmax(0,1fr)]">
    <section
      class="discovery-panel flex h-dvh min-h-0 flex-col overflow-hidden border-white/[0.07] px-4 pb-5 pt-5 sm:px-7 lg:border-r lg:px-8 lg:pt-8 xl:px-10"
    >
      <DiscoveryIntro @navigate="navigateToAllLeagues" />

      <div class="mt-6 lg:mt-7">
        <LeagueFilters
          :search="catalogue.search.value"
          :selected-sport="catalogue.selectedSport.value"
          :sport-options="catalogue.sportOptions.value"
          @update:search="catalogue.search.value = $event"
          @update:selected-sport="catalogue.selectedSport.value = $event"
        />
      </div>

      <p
        v-if="!catalogue.isLoading.value && !catalogue.error.value"
        class="mb-4 mt-5 text-xs font-medium text-zinc-500"
        aria-live="polite"
      >
        {{ catalogue.filteredLeagues.value.length }}
        {{ catalogue.filteredLeagues.value.length === 1 ? 'league' : 'leagues' }} found
      </p>

      <div class="mt-5 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1.5 lg:mt-0">
        <LeagueListSkeleton v-if="catalogue.isLoading.value" />
        <StateMessage
          v-else-if="catalogue.error.value"
          title="We couldn’t load the leagues."
          description="Check your connection and try again."
          action-label="Try again"
          @action="catalogue.loadLeagues"
        />
        <StateMessage
          v-else-if="catalogue.filteredLeagues.value.length === 0"
          title="No leagues match your search."
          description="Try a different league name or sport."
          action-label="Clear filters"
          @action="catalogue.clearFilters"
        />
        <LeagueList
          v-else
          :leagues="catalogue.filteredLeagues.value"
          :selected-id="selection.selectedLeague.value?.id"
          @select="selectLeague"
        />
      </div>

      <DataAttribution />
    </section>

    <section class="hidden min-h-0 bg-[#0a0c0e] lg:block" aria-label="League detail">
      <DetailViewSkeleton v-if="isDetailLoading" />
      <LeagueLoadError
        v-else-if="isDetailRoute && catalogue.error.value"
        @retry="catalogue.loadLeagues"
      />
      <LeagueDetail
        v-else-if="selection.selectedLeague.value"
        :league="selection.selectedLeague.value"
        :details="selection.details.value"
        :details-status="selection.detailsStatus.value"
        :seasons-status="selection.seasonsStatus.value"
        :season-badge="selection.seasonBadge.value"
        @retry-details="selection.retryDetails"
        @retry-seasons="selection.retrySeasons"
      />
      <DetailEmptyState v-else />
    </section>

    <div v-if="isDetailRoute" class="fixed inset-0 z-50 overflow-y-auto bg-[#090b0d] lg:hidden">
      <DetailViewSkeleton v-if="isDetailLoading" mobile />
      <LeagueLoadError v-else-if="catalogue.error.value" @retry="catalogue.loadLeagues" />
      <LeagueDetail
        v-else-if="selection.selectedLeague.value"
        :league="selection.selectedLeague.value"
        :details="selection.details.value"
        :details-status="selection.detailsStatus.value"
        :seasons-status="selection.seasonsStatus.value"
        :season-badge="selection.seasonBadge.value"
        mobile-overlay
        @close="closeMobileDetail"
        @retry-details="selection.retryDetails"
        @retry-seasons="selection.retrySeasons"
      />
    </div>
  </main>
</template>
