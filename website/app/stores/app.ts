export interface AppState {
  routeName: string | undefined
}

export const useAppStore = defineStore('app', () => {
  const route = useRoute()

  const state = reactive<AppState>({
    routeName: route.name?.toString(),
  })

  return {
    state,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
