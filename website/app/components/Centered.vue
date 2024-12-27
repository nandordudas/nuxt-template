<script setup lang="ts">
defineOptions({
  name: 'Centered',
  inheritAttrs: false,
})
</script>

<template>
  <slot />
</template>

<style scoped>
:slotted(*) {
  display: grid;
  place-items: center;
}
</style>
