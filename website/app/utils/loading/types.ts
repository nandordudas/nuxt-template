export interface Success<T> {
  success: true
  data: T
  error?: never
}

export interface Failure<E> {
  success: false
  error: E
  data?: never
}

export type Result<T, E = Error> = Success<T> | Failure<E>

export interface RetryContext<E> {
  attempt: number
  error: E
  maxAttempts: number
}

export interface RetryOptions {
  maxAttempts?: number
  delayMs?: number
  onRetry?: <E = unknown>(context: RetryContext<E>) => void
  signal?: AbortSignal
}

export type LoadingState = 'idle' | 'loading' | 'error' | 'success'

export interface LoadingError<E = Error> {
  error: E
  attempt: number
  maxAttempts: number
}

export interface LoadingStateOptions<E = Error> extends RetryOptions {
  initialState?: LoadingState
  persistent?: boolean
  onError?: (error: LoadingError<E>) => void
}
