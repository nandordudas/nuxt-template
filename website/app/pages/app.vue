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
  <UPage>
    <UPageBody>
      <h1>{{ state.routeName }}</h1>
    </UPageBody>
  </UPage>
</template>
