<script setup lang="ts">
definePageMeta({
  name: 'home',
  layout: 'default',
})

useHead({
  title: 'Home',
})
</script>

<template>
  <UPageHero :title="$route.name?.toString()" />
</template>
