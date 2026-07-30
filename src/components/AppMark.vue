<script setup lang="ts">
const emit = defineEmits<{ navigate: [] }>()
</script>

<template>
  <a
    href="/"
    class="inline-flex w-fit items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400"
    aria-label="League Finder — view all leagues"
    @click.prevent="emit('navigate')"
  >
    <span
      class="grid size-8 place-items-center rounded-[10px] border border-orange-500/70 bg-orange-500/10 text-orange-400"
      aria-hidden="true"
      ><svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M5 4.5 8.5 7 12 3l3.5 4L19 4.5l-1 13H6l-1-13Z" />
        <path d="M8 17.5V21m8-3.5V21M5 21h14" /></svg></span
    ><span class="font-display text-sm font-bold tracking-[0.12em] text-white">LEAGUE FINDER</span>
  </a>
</template>
