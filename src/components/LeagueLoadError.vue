<script setup lang="ts">
import StateMessage from './StateMessage.vue'

const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <StateMessage
    title="We couldn’t load this league."
    description="Check your connection and try again."
    action-label="Try again"
    @action="emit('retry')"
  />
</template>
