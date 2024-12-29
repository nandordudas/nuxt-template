export type LoadingState =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error'

interface LoadingStateOptions<E extends Error> {
  initialState?: LoadingState
  onError?: (error: E) => void
}

const stateMap = new WeakMap<object, LoadingState>()

export function useLoadingState<E extends Error>(
  key: { name: string },
  options: LoadingStateOptions<E> = {},
) {
  const {
    initialState = 'idle',
    onError = console.error,
  } = options

  const state = useState<LoadingState>(
    `loading-${key.name}`,
    () => stateMap.get(key) ?? initialState,
  )

  const currentError = useState<E | null>(
    `error-${key.name}`,
    () => null,
  )

  watch(state, (newState) => {
    stateMap.set(key, newState)

    if (newState !== 'error')
      currentError.value = null
  })

  async function withLoading<T>(operation: () => Promise<T>): Promise<Result<T, E>> {
    state.value = 'loading'

    const result = await tryCatch<T, E>(operation)

    if (result.success) {
      state.value = 'success'
    }
    else {
      state.value = 'error'
      currentError.value = result.error
      onError(result.error)
    }

    return result
  }

  function reset(): void {
    state.value = initialState
    currentError.value = null
  }

  return {
    // state
    state,
    // getters
    currentError: computed(() => currentError.value),
    isLoading: computed(() => state.value === 'loading'),
    isSuccess: computed(() => state.value === 'success'),
    isError: computed(() => state.value === 'error'),
    // actions
    withLoading,
    reset,
  }
}
