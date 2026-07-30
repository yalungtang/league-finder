<template>
  <div class="detail-empty relative isolate h-full min-h-[560px] overflow-hidden">
    <img
      src="/assets/league-explorer-empty.webp"
      alt=""
      class="absolute inset-0 -z-20 size-full object-cover object-right"
      aria-hidden="true"
    />
    <div class="detail-empty-overlay absolute inset-0 -z-10" aria-hidden="true" />
    <div class="flex h-full min-h-[560px] items-center px-10 xl:px-16">
      <div class="max-w-md text-left">
        <p class="text-xs font-bold uppercase tracking-[0.16em] text-orange-400">
          Ready to explore
        </p>
        <h2 class="mt-4 font-display text-3xl font-semibold leading-tight text-zinc-100 xl:text-4xl">
          Explore leagues across every sport.
        </h2>
        <p class="mt-4 max-w-sm text-sm leading-6 text-zinc-400">
          Pick a league from the list to explore its identity and key details.
        </p>
      </div>
    </div>
  </div>
</template>
