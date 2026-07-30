<script setup lang="ts">
defineProps<{ search: string; selectedSport: string; sportOptions: string[] }>()
const emit = defineEmits<{ 'update:search': [string]; 'update:selectedSport': [string] }>()
</script>
<template>
  <div
    class="grid gap-3 sm:grid-cols-[minmax(0,1fr)_11rem] lg:grid-cols-1 xl:grid-cols-[minmax(0,1fr)_10.25rem]"
  >
    <div class="group relative block">
      <label for="league-search" class="sr-only">Search leagues</label>
      <svg
        class="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-zinc-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        id="league-search"
        :value="search"
        type="search"
        autocomplete="off"
        placeholder="Search by league name..."
        class="control search-control w-full"
        @input="emit('update:search', ($event.target as HTMLInputElement).value)"
      />
      <button
        v-if="search"
        type="button"
        class="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
        aria-label="Clear search"
        @click="emit('update:search', '')"
      >
        <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m7 7 10 10M17 7 7 17" />
        </svg>
      </button>
    </div>
    <label class="relative block"
      ><span class="sr-only">Filter by sport</span
      ><select
        :value="selectedSport"
        class="control w-full appearance-none pr-10"
        @change="emit('update:selectedSport', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">All sports</option>
        <option v-for="sport in sportOptions" :key="sport" :value="sport">
          {{ sport }}
        </option></select
      ><svg
        class="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-zinc-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <path d="m7 10 5 5 5-5" /></svg
    ></label>
  </div>
</template>
