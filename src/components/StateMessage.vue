<script setup lang="ts">
defineProps<{ title: string; description: string; actionLabel?: string }>()
const emit = defineEmits<{ action: [] }>()
</script>
<template>
  <div
    class="grid min-h-64 place-items-center rounded-2xl border border-dashed border-white/10 px-6 text-center"
  >
    <div class="max-w-xs">
      <span
        class="mx-auto mb-4 grid size-11 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-500"
        aria-hidden="true"
        >!</span
      >
      <h2 class="font-display text-lg font-semibold text-zinc-100">{{ title }}</h2>
      <p class="mt-2 text-sm leading-6 text-zinc-500">{{ description }}</p>
      <button
        v-if="actionLabel"
        type="button"
        class="secondary-button mt-5"
        @click="emit('action')"
      >
        {{ actionLabel }}
      </button>
    </div>
  </div>
</template>
