<script setup lang="ts">
import type { LeagueSummary } from '../types/sports'
import { leagueInitials } from '../utils/normalize'
defineProps<{ league: LeagueSummary; selected: boolean }>()
const emit = defineEmits<{ select: [LeagueSummary] }>()
</script>
<template>
  <button
    :id="`league-row-${league.id}`"
    type="button"
    class="group grid min-h-[76px] w-full grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
    :class="
      selected
        ? 'border-orange-500/80 bg-orange-500/[0.055] shadow-[inset_3px_0_0_#f97316]'
        : 'border-white/[0.07] bg-white/[0.025] hover:border-white/15 hover:bg-white/[0.045]'
    "
    :aria-pressed="selected"
    @click="emit('select', league)"
  >
    <span
      class="grid size-11 place-items-center rounded-full border border-white/10 bg-gradient-to-br from-zinc-700 to-zinc-950 font-display text-xs font-bold text-zinc-200"
      aria-hidden="true"
      >{{ leagueInitials(league.name) }}</span
    >
    <span class="min-w-0"
      ><span class="block truncate text-sm font-semibold text-zinc-100">{{ league.name }}</span
      ><span v-if="league.alternateName" class="mt-0.5 block truncate text-xs text-zinc-500">{{
        league.alternateName
      }}</span></span
    >
    <span class="flex items-center gap-2.5"
      ><span class="sport-pill hidden xl:inline-flex">{{ league.sport }}</span
      ><svg
        class="size-4 text-zinc-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <path d="m9 18 6-6-6-6" /></svg
    ></span>
  </button>
</template>
