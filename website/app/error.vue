<script lang="ts">
import type { NuxtError } from '#app'
import { en } from '@nuxt/ui/locale'

interface ErrorPageProps {
  error: NuxtError
}
</script>

<script setup lang="ts">
defineProps<ErrorPageProps>()

const lang = computed(() => en.code)
const dir = computed(() => en.dir)

useHead({
  htmlAttrs: { dir, lang },
})
</script>

<template>
  <UApp :locale="en">
    <UError :error />
  </UApp>
</template>
