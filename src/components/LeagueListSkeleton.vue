<template>
  <div class="grid gap-2.5" aria-label="Loading leagues" aria-busy="true">
    <div
      v-for="index in 6"
      :key="index"
      class="grid min-h-[76px] grid-cols-[44px_1fr] items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-3.5"
    >
      <span class="skeleton size-11 rounded-full" /><span class="space-y-2"
        ><span class="skeleton block h-3.5 w-2/3 rounded" /><span
          class="skeleton block h-2.5 w-1/2 rounded"
      /></span>
    </div>
  </div>
</template>
