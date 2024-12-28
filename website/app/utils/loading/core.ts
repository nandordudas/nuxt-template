import type { Failure, Result, RetryContext, RetryOptions, Success } from '~/utils/loading/types'
import { DEFAULT_RETRY_OPTIONS } from '~/utils/loading/constants'

const setTimeout = globalThis.setTimeout.bind(globalThis)
const clearTimeout = globalThis.clearTimeout.bind(globalThis)

export class RetryError extends Error {
  constructor(
    public readonly attempt: number,
    public readonly maxAttempts: number,
    public readonly originalError: Error,
  ) {
    super(`Operation failed on attempt ${attempt} of ${maxAttempts}: ${originalError.message}`)
  }
}

async function createAbortableDelay(delayMs: number, signal: AbortSignal): Promise<void> {
  const { promise, reject, resolve } = Promise.withResolvers<void>()
  const timeout = setTimeout(resolve, delayMs)

  signal.addEventListener('abort', () => {
    clearTimeout(timeout)
    reject(signal.reason ?? new Error('Operation aborted'))
  }, { once: true })

  return promise
}

async function executeOperation<T, E>(
  operation: () => Promise<T>,
  signal: AbortSignal,
): Promise<Result<T, E>> {
  try {
    if (signal.aborted)
      throw signal.reason ?? new Error('Operation aborted')

    const result = await operation()

    return success(result)
  }
  catch (error) {
    return failure(error as E)
  }
}

interface HandleRetryParams<E> {
  context: RetryContext<E>
  delayMs: number
  signal: AbortSignal
  onRetry: (context: RetryContext<E>) => void
}

async function handleRetry<E>({
  context,
  delayMs,
  signal,
  onRetry,
}: HandleRetryParams<E>): Promise<void> {
  onRetry(context)
  await createAbortableDelay(delayMs, signal)
}

function validateRetryOptions(options: RetryOptions): asserts options is Required<RetryOptions> {
  if (options.maxAttempts !== undefined && options.maxAttempts <= 0)
    throw new Error('maxAttempts must be greater than 0')

  if (options.delayMs !== undefined && options.delayMs < 0)
    throw new Error('delayMs must be non-negative')
}

function validateOperation(operation: unknown): asserts operation is () => Promise<unknown> {
  if (typeof operation !== 'function')
    throw new TypeError('Operation must be a function')
}

interface AttemptsController {
  hasAttemptsLeft: (attempt: number) => boolean
  isLastAttempt: (attempt: number) => boolean
}

function attemptsFactory(maxAttempts: number): AttemptsController {
  function hasAttemptsLeft(attempt: number) {
    return attempt < maxAttempts
  }

  function isLastAttempt(attempt: number) {
    return attempt === maxAttempts
  }

  return { hasAttemptsLeft, isLastAttempt }
}

export async function executeWithRetry<T, E = Error>(
  operation: () => Promise<T>,
  options: RetryOptions = {},
): Promise<Result<T, E>> {
  const { maxAttempts, delayMs, signal, onRetry } = {
    ...DEFAULT_RETRY_OPTIONS,
    ...options,
  }

  validateOperation(operation)
  validateRetryOptions(options)

  const { hasAttemptsLeft, isLastAttempt } = attemptsFactory(maxAttempts)

  function shouldReturnResult(result: Result<T, E>, attempt: number) {
    return isSuccess(result) || isLastAttempt(attempt)
  }

  let attempt: number = 1

  while (hasAttemptsLeft(attempt)) {
    try {
      const result = await executeOperation<T, E>(operation, signal)

      if (shouldReturnResult(result, attempt))
        return result

      await handleRetry({
        context: {
          attempt,
          error: result.error,
          maxAttempts,
        },
        delayMs,
        signal,
        onRetry,
      })
    }
    catch (abortError) {
      return failure(abortError as E)
    }

    attempt++
  }

  return failure(new RetryError(attempt, maxAttempts, new Error('Unexpected error')) as E)
}

export function isSuccess<T, E>(result: Result<T, E>): result is Success<T> {
  return result.success
}

export function isFailure<T, E>(result: Result<T, E>): result is Failure<E> {
  return !isSuccess(result)
}

export function success<T>(data: T): Success<T> {
  return {
    success: true,
    data,
  }
}

export function failure<E>(error: E): Failure<E> {
  return {
    success: false,
    error,
  }
}

export function mapSuccess<T, U, E>(
  result: Result<T, E>,
  fn: (data: T) => U,
): Result<U, E> {
  return isSuccess(result) ? success(fn(result.data)) : result
}

export function mapError<T, E, F>(
  result: Result<T, E>,
  fn: (error: E) => F,
): Result<T, F> {
  return isFailure(result) ? failure(fn(result.error)) : result
}
