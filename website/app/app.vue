<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator />

  <NuxtLayout>
    <NuxtPage :page-key="route => route.fullPath" />
  </NuxtLayout>
</template>
