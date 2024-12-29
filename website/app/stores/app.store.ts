import { consola } from 'consola'
import { StoreNames } from '~/shared/constants/store.constants'

export interface AppState {
  name: string
  packageVersion: string
}

const logger = consola.withTag(StoreNames.App)

export const useAppStore = defineStore(StoreNames.App, () => {
  logger.start('Initializing app store...')

  const { withLoading } = useLoadingState({
    name: StoreNames.App,
  })

  const state = shallowReactive<AppState>({
    name: StoreNames.App,
    packageVersion: '',
  })

  onNuxtReady(async () => {
    logger.success('App store really has been initialized')

    const result = await withLoading(() => $fetch('/api/test'))

    if (isSuccess(result))
      logger.success('API call succeeded', result.data)
  })

  const config = useRuntimeConfig()

  state.packageVersion = config.public.packageVersion

  return {
    state,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
