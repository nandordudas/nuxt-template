import { consola } from 'consola'
import { StoreNames } from '~/shared/constants/store.constants'

export interface AppState {
  name: string
  packageVersion: string
}

const logger = consola.withTag(StoreNames.App)

export const useAppStore = defineStore(StoreNames.App, () => {
  logger.start('Initializing app store...')

  const state = shallowReactive<AppState>({
    name: StoreNames.App,
    packageVersion: '',
  })

  onNuxtReady(() => {
    logger.success('App store really has been initialized')
  })

  const config = useRuntimeConfig()

  state.packageVersion = config.public.packageVersion

  return {
    state,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
