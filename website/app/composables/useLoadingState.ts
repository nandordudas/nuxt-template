import type { LoadingError, LoadingState, LoadingStateOptions, Result } from '~/utils/loading/types'
import { executeWithRetry, isSuccess } from '~/utils/loading/core'

const stateMap = new WeakMap<object, LoadingState>()
const DEFAULT_INITIAL_STATE = 'idle'
const DEFAULT_ON_ERROR = console.error

export function useLoadingState<E = Error>(
  key: { name: string },
  options: LoadingStateOptions<E> = {},
) {
  const {
    initialState = DEFAULT_INITIAL_STATE,
    onError = DEFAULT_ON_ERROR,
    ...retryOptions
  } = options

  const state = useState<LoadingState>(
    `loading-${key.name}`,
    () => stateMap.get(key) ?? initialState,
  )

  const currentError = useState<LoadingError<E> | null>(
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

    const result = await executeWithRetry<T, E>(operation, retryOptions)

    if (isSuccess(result)) {
      state.value = 'success'
    }
    else {
      state.value = 'error'

      currentError.value = {
        error: result.error,
        attempt: retryOptions.maxAttempts ?? 3,
        maxAttempts: retryOptions.maxAttempts ?? 3,
      }

      onError(currentError.value)
    }

    return result
  }

  function reset(): void {
    state.value = initialState
    currentError.value = null
  }

  return {
    state,
    currentError: computed(() => currentError.value),
    isLoading: computed(() => state.value === 'loading'),
    isSuccess: computed(() => state.value === 'success'),
    isError: computed(() => state.value === 'error'),
    withLoading,
    reset,
  }
}
