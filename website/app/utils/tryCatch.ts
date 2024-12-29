interface ResultBase {
  readonly success: boolean
}

export type Success<T> = ResultBase & {
  readonly success: true
  readonly data: T
}

export type Failure<E extends Error> = ResultBase & {
  readonly success: false
  readonly error: E
}

export type Result<T, E extends Error> =
  | Success<T>
  | Failure<E>

export interface ErrorTransformer<E extends Error> {
  transform: (error: unknown) => E
}

function success<T>(data: T): Success<T> {
  if (data === undefined || data === null)
    throw new TypeError('Success data cannot be undefined or null')

  return {
    success: true,
    data,
  }
}

function failure<E extends Error>(error: E): Failure<E> {
  if (!(error instanceof Error))
    throw new TypeError('Error must be an instance of Error')

  return {
    success: false,
    error,
  }
}

const defaultErrorTransformer: ErrorTransformer<Error> = {
  transform: (error: unknown) => {
    if (error instanceof Error)
      return error

    const message = typeof error === 'string'
      ? error
      : JSON.stringify(error, null, 2)

    return new Error(message, {
      cause: error,
    })
  },
}

interface TryCatchOptions<E extends Error> {
  errorTransformer?: ErrorTransformer<E>
}

export async function tryCatch<T, E extends Error>(
  operation: () => Promise<T>,
  options: TryCatchOptions<E> = {},
): Promise<Result<T, E>> {
  const {
    errorTransformer = defaultErrorTransformer,
  } = options

  try {
    const result: Awaited<T> = await operation()

    return success(result)
  }
  catch (error) {
    const transformedError = errorTransformer.transform(error) as E

    return failure(transformedError)
  }
}

export function isSuccess<T, E extends Error>(result: Result<T, E>): result is Success<T> {
  return result.success === true && 'data' in result
}

export function isFailure<T, E extends Error>(result: Result<T, E>): result is Failure<E> {
  return result.success === false && 'error' in result
}

export function unwrapResult<T, E extends Error>(
  result: Result<T, E>,
  errorHandler?: (error: E) => never,
): T {
  if (isSuccess(result))
    return result.data

  if (errorHandler)
    return errorHandler(result.error)

  throw result.error
}

// export function mapResult<T, U, E extends Error>(
//   result: Result<T, E>,
//   fn: (value: T) => U,
// ): Result<U, E> {
//   return isSuccess(result)
//     ? success(fn(result.data))
//     : result
// }

// export function flatMapResult<T, U, E extends Error>(
//   result: Result<T, E>,
//   fn: (value: T) => Promise<Result<U, E>>,
// ): Promise<Result<U, E>> {
//   return isSuccess(result)
//     ? fn(result.data)
//     : Promise.resolve(result)
// }

// [TODO] withTimeout
