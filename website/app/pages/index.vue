<script setup lang="ts">
definePageMeta({
  name: 'index',
  layout: 'default',
  // redirect: '/welcome',
})

useHead({
  title: 'Index',
})

const appStore = useAppStore()
const { isLoading } = useLoadingState<any, Error>({
  name: appStore.state.name,
})
</script>

<template>
  <Centered>
    <section class="h-dvh">
      <Stacked>
        <article>
          <Centered>
            <h1 style="order: 2; width: max-content; margin-inline: auto; padding: 1rem" class="bg-tomato-ish">
              {{ $route.name }} - isLoading: {{ isLoading }}
            </h1>
          </Centered>

          <Centered>
            <p style="order: 1; padding: 1rem" class="bg-tomato-ish">
              Use {{ appStore.state.name }} store, package version is {{ appStore.state.packageVersion }}
            </p>
          </Centered>
        </article>
      </Stacked>
    </section>
  </Centered>
</template>

<style scoped>
.h-dvh {
  height: 100dvh;
}

.bg-tomato-ish {
  background-color: rgb(from tomato r g b / 0.5);
}
</style>
