<script lang="ts">
import type { NuxtError } from '#app'

interface ErrorPageProps {
  error: NuxtError
}
</script>

<script setup lang="ts">
defineProps<ErrorPageProps>()
</script>

<template>
  <UApp>
    <UError :error />
  </UApp>
</template>
