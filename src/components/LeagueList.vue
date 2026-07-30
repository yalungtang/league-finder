<script setup lang="ts">
import type { LeagueSummary } from '../types/sports'
import LeagueListItem from './LeagueListItem.vue'
defineProps<{ leagues: LeagueSummary[]; selectedId?: string }>()
const emit = defineEmits<{ select: [LeagueSummary] }>()
</script>
<template>
  <div class="grid gap-2.5" role="list" aria-label="Leagues">
    <div v-for="league in leagues" :key="league.id" role="listitem">
      <LeagueListItem
        :league="league"
        :selected="selectedId === league.id"
        @select="emit('select', $event)"
      />
    </div>
  </div>
</template>
