<script setup lang="ts">
definePageMeta({
  name: 'app',
  layout: 'default',
})

useHead({
  title: 'App',
})

const appStore = useAppStore()
const { state } = storeToRefs(appStore)
</script>

<template>
  <UPageHero :title="state.routeName" />
</template>
