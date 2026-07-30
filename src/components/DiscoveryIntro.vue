<script setup lang="ts">
import AppMark from './AppMark.vue'

const emit = defineEmits<{ navigate: [] }>()
</script>

<template>
  <AppMark @navigate="emit('navigate')" />

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
</template>
