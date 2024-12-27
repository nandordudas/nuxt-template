<script setup lang="ts">
defineOptions({
  name: 'Stacked',
  inheritAttrs: false,
})
</script>

<template>
  <slot />
</template>

<style scoped>
:slotted(*) {
  display: grid;
  grid-template: 'v-stack' 1fr / 1fr;
  isolation: isolate;
}

:slotted(*) > * {
  grid-area: v-stack;
  min-height: 0;
  min-width: 0;
}
</style>
