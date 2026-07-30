<script setup lang="ts">
defineProps<{ mobile?: boolean }>()
</script>

<template>
  <article class="detail-panel min-h-full" aria-label="Loading league detail" aria-busy="true">
    <div
      class="mx-auto w-full max-w-[860px] px-5 pb-10 pt-7 sm:px-8 lg:px-10 lg:pb-12 lg:pt-12 xl:px-16 xl:pt-20"
    >
      <div v-if="mobile" class="skeleton h-5 w-28 rounded lg:hidden" />
      <div class="skeleton h-6 w-28 rounded-full" :class="mobile ? 'mt-10' : ''" />
      <div class="skeleton mt-5 h-10 w-4/5 rounded-lg sm:h-12" />
      <div class="skeleton mt-4 h-5 w-2/5 rounded" />
      <div class="skeleton mt-10 h-[320px] rounded-t-3xl lg:h-[360px]" />
      <div class="space-y-3 rounded-b-3xl border border-white/[0.06] bg-white/[0.035] p-6">
        <div class="skeleton h-4 w-full rounded" />
        <div class="skeleton h-4 w-5/6 rounded" />
        <div class="skeleton h-4 w-2/3 rounded" />
      </div>
    </div>
  </article>
</template>
