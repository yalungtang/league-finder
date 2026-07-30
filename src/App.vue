<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import AppMark from './components/AppMark.vue'
import DetailEmptyState from './components/DetailEmptyState.vue'
import DetailViewSkeleton from './components/DetailViewSkeleton.vue'
import LeagueDetail from './components/LeagueDetail.vue'
import LeagueFilters from './components/LeagueFilters.vue'
import LeagueList from './components/LeagueList.vue'
import LeagueListSkeleton from './components/LeagueListSkeleton.vue'
import StateMessage from './components/StateMessage.vue'
import { useLeagues } from './composables/useLeagues'
import { useLeagueSelection } from './composables/useLeagueSelection'
import type { LeagueSummary } from './types/sports'
import { cataloguePath, isCataloguePath, leagueIdFromPath, leaguePath } from './utils/leagueRoute'

const catalogue = useLeagues()
const selection = useLeagueSelection()
const lastSelectedId = ref<string>()
const isDetailLoading = computed(
  () =>
    Boolean(
      selection.selectedLeague.value &&
        (selection.detailsStatus.value === 'loading' || selection.seasonsStatus.value === 'loading'),
    ),
)

function updateUrl(path: string, mode: 'push' | 'replace'): void {
  const url = new URL(window.location.href)
  url.pathname = path
  url.hash = ''
  window.history[mode === 'push' ? 'pushState' : 'replaceState'](
    { leagueFinderView: path === cataloguePath ? 'catalogue' : 'detail' },
    '',
    url,
  )
}

function showLeague(league: LeagueSummary): void {
  lastSelectedId.value = league.id
  if (selection.selectedLeague.value?.id !== league.id) selection.selectLeague(league)
  if (window.matchMedia('(max-width: 1023px)').matches) document.body.classList.add('detail-open')
}

function selectLeague(league: LeagueSummary): void {
  if (leagueIdFromPath(window.location.pathname) !== league.id) {
    updateUrl(leaguePath(league.id), 'push')
  }
  showLeague(league)
}

function showCatalogue(): void {
  selection.clearSelection()
  document.body.classList.remove('detail-open')
}

function navigateToAllLeagues(): void {
  catalogue.clearFilters()
  if (!isCataloguePath(window.location.pathname)) updateUrl(cataloguePath, 'push')
  showCatalogue()
}

function syncRoute(): void {
  const routeId = leagueIdFromPath(window.location.pathname)
  if (!routeId) {
    if (!isCataloguePath(window.location.pathname)) updateUrl(cataloguePath, 'replace')
    showCatalogue()
    return
  }
  if (catalogue.isLoading.value || catalogue.error.value) return

  const league = catalogue.leagues.value.find((item) => item.id === routeId)
  if (league) {
    showLeague(league)
    return
  }

  updateUrl(cataloguePath, 'replace')
  showCatalogue()
}

async function closeMobileDetail(): Promise<void> {
  updateUrl(cataloguePath, 'replace')
  showCatalogue()
  await nextTick()
  if (lastSelectedId.value) document.getElementById(`league-row-${lastSelectedId.value}`)?.focus()
}

watch([catalogue.leagues, catalogue.isLoading], syncRoute, { immediate: true })

watch(catalogue.filteredLeagues, (visible) => {
  const id = selection.selectedLeague.value?.id
  if (id && !visible.some((league) => league.id === id)) {
    updateUrl(cataloguePath, 'replace')
    showCatalogue()
  }
})

onMounted(() => {
  window.addEventListener('popstate', syncRoute)
})

onBeforeUnmount(() => {
  document.body.classList.remove('detail-open')
  window.removeEventListener('popstate', syncRoute)
})
</script>

<template>
  <main
    class="app-shell h-dvh overflow-hidden lg:grid lg:grid-cols-[520px_minmax(0,1fr)]"
  >
    <section
      class="discovery-panel flex h-dvh min-h-0 flex-col overflow-hidden border-white/[0.07] px-4 pb-5 pt-5 sm:px-7 lg:border-r lg:px-8 lg:pt-8 xl:px-10"
    >
      <AppMark @navigate="navigateToAllLeagues" />
      <header class="mt-9 lg:mt-10">
        <h1
          class="font-display text-[2rem] font-semibold leading-tight tracking-[-0.035em] text-white xl:text-[2.5rem]"
        >
          Find the right league.
        </h1>
        <p class="mt-2.5 max-w-md text-sm leading-6 text-zinc-500 xl:text-[15px]">
          Search, filter, and explore competitions from around the world.
        </p>
      </header>

      <div
        class="relative mt-6 h-28 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a0c0e] lg:hidden"
        aria-hidden="true"
      >
        <img
          src="/assets/league-explorer-empty.webp"
          alt=""
          class="size-full object-contain object-right-bottom opacity-90"
        />
        <div
          class="absolute inset-0 bg-[linear-gradient(to_right,rgba(7,9,11,0.9),rgba(7,9,11,0.2)_65%,rgba(7,9,11,0.05))]"
        />
        <p
          class="absolute bottom-4 left-4 text-[10px] font-bold uppercase tracking-[0.16em] text-orange-400"
        >
          Explore every sport
        </p>
      </div>

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

      <p class="mt-6 hidden items-center gap-2 text-[11px] text-zinc-600 lg:flex">
        <svg
          viewBox="0 0 24 24"
          class="size-4"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v6m0-9h.01" />
        </svg>
        League data powered by TheSportsDB
      </p>
    </section>

    <section class="hidden min-h-0 bg-[#0a0c0e] lg:block" aria-label="League detail">
      <DetailViewSkeleton v-if="isDetailLoading" />
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

    <div
      v-if="selection.selectedLeague.value"
      class="fixed inset-0 z-50 overflow-y-auto bg-[#090b0d] lg:hidden"
    >
      <DetailViewSkeleton v-if="isDetailLoading" mobile />
      <LeagueDetail
        v-else
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
