<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type {
  AsyncStatus,
  LeagueDetails,
  LeagueSummary,
  SelectedSeasonBadge,
} from '../types/sports'
const props = defineProps<{
  league: LeagueSummary
  details: LeagueDetails | null
  detailsStatus: AsyncStatus
  seasonsStatus: AsyncStatus
  seasonBadge?: SelectedSeasonBadge
  mobileOverlay?: boolean
}>()
const emit = defineEmits<{ close: []; retryDetails: []; retrySeasons: [] }>()
const badgeFailed = ref(false)
watch(
  () => props.seasonBadge?.url,
  () => (badgeFailed.value = false),
)
const name = computed(() => props.details?.name || props.league.name)
const sport = computed(() => props.details?.sport || props.league.sport)
const fallbackInitials = computed(() =>
  name.value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toLocaleUpperCase(),
)
const alternateName = computed(() => {
  const value = props.details?.alternateName || props.league.alternateName
  const country = props.details?.country?.toLocaleLowerCase()
  if (!value || !country) return value
  return (
    value
      .split(',')
      .map((part) => part.trim())
      .filter((part) => part.toLocaleLowerCase() !== country)
      .join(', ') || undefined
  )
})
const foundedLabel = computed(() =>
  props.details?.formedYear ? `Founded in ${props.details.formedYear}` : undefined,
)
const backgroundStyle = computed(() =>
  props.details?.fanartUrl
    ? { backgroundImage: `url("${props.details.fanartUrl.replaceAll('"', '%22')}")` }
    : undefined,
)
const unavailable = computed(
  () =>
    props.seasonsStatus === 'error' ||
    (props.seasonsStatus === 'success' && !props.seasonBadge) ||
    badgeFailed.value,
)
</script>
<template>
  <article class="detail-panel relative isolate min-h-full overflow-hidden bg-[#0a0c0e]">
    <div
      v-if="details?.fanartUrl"
      class="absolute inset-x-0 top-0 -z-20 h-[56%] bg-cover bg-center opacity-55"
      :style="backgroundStyle"
      aria-hidden="true"
    />
    <div class="detail-atmosphere absolute inset-0 -z-10" aria-hidden="true" />
    <div
      class="mx-auto flex min-h-full w-full max-w-[860px] flex-col px-5 pb-10 pt-5 sm:px-8 lg:px-10 lg:pb-12 lg:pt-12 xl:px-16 xl:pt-20"
    >
      <button
        v-if="mobileOverlay"
        type="button"
        class="mb-8 inline-flex min-h-11 w-fit items-center gap-2 rounded-xl text-sm font-semibold text-zinc-200 focus-visible:ring-2 focus-visible:ring-orange-400 lg:hidden"
        aria-label="Back to league list"
        @click="emit('close')"
      >
        ‹ Back to leagues
      </button>
      <header class="max-w-2xl">
        <p
          class="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-orange-400"
        >
          <span class="rounded-full border border-orange-500/35 bg-orange-500/10 px-3 py-1.5">{{
            sport
          }}</span
          ><template v-if="details?.country"
            ><span class="text-zinc-600">•</span
            ><span class="text-zinc-400">{{ details.country }}</span></template
          >
        </p>
        <h1
          class="font-display text-3xl font-semibold leading-tight tracking-[-0.035em] text-white sm:text-4xl xl:text-5xl"
        >
          {{ name }}
        </h1>
        <p v-if="alternateName" class="mt-3 text-base text-zinc-400 sm:text-lg">
          {{ alternateName }}
        </p>
      </header>
      <div class="relative mt-8 sm:mt-10">
        <div
          v-if="seasonBadge && !badgeFailed"
          class="badge-stage grid place-items-center px-8 pb-20 pt-7"
        >
          <img
            :src="seasonBadge.url"
            :alt="`${name} ${seasonBadge.season ? `${seasonBadge.season} ` : ''}season badge`"
            class="max-h-[280px] max-w-full object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.5)]"
            @error="badgeFailed = true"
          />
        </div>
        <div
          v-else-if="unavailable"
          class="badge-stage badge-empty-state grid min-h-[260px] place-items-center px-8 pb-16 pt-8 text-center"
          role="status"
        >
          <div class="max-w-xs">
            <span
              class="mx-auto mb-4 grid size-11 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-xs font-bold tracking-[0.08em] text-zinc-500"
              aria-hidden="true"
            >
              {{ fallbackInitials }}
            </span>
            <h2 class="font-display text-lg font-semibold text-zinc-100">{{ name }}</h2>
            <p class="mt-2 text-sm leading-6 text-zinc-500">{{ sport }}</p>
          </div>
        </div>
        <div v-if="foundedLabel" class="absolute right-4 bottom-4" aria-label="League facts">
          <span class="metadata-chip">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <path d="M8 3h8v4a4 4 0 0 1-8 0V3ZM12 11v5M8 21h8M9 16h6" />
              <path d="M8 5H4v2a4 4 0 0 0 4 4M16 5h4v2a4 4 0 0 1-4 4" />
            </svg>
            <span>{{ foundedLabel }}</span>
          </span>
        </div>
      </div>
      <div
        v-if="details?.description || detailsStatus === 'error'"
        class="detail-copy-panel"
      >
        <p
          v-if="details?.description"
          class="description-clamp max-w-3xl text-sm leading-7 text-zinc-300"
        >
          {{ details.description }}
        </p>
        <button
          v-if="detailsStatus === 'error'"
          class="secondary-button mt-5 w-fit"
          @click="emit('retryDetails')"
        >
          Try loading details again
        </button>
      </div>
    </div>
  </article>
</template>
