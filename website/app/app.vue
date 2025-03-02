<script setup lang="ts">
const { locale } = useHeadCommon()
</script>

<template>
  <UApp :locale>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage :page-key="route => route.fullPath" />
    </NuxtLayout>
  </UApp>
</template>
