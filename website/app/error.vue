<script lang="ts">
import type { NuxtError } from '#app'

interface ErrorPageProps {
  error: NuxtError
}
</script>

<script setup lang="ts">
defineProps<ErrorPageProps>()

const { locale } = useHeadCommon()
</script>

<template>
  <UApp :locale>
    <UError :error />
  </UApp>
</template>
