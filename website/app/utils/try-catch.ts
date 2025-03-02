export type Constructor<T> = new (...args: any[]) => T

export function raiseError(
  message: string,
  ErrorConstructor: Constructor<Error> = Error,
  cause?: unknown,
): never {
  if (typeof message !== 'string')
    throw new TypeError('Message must be a string.')

  if (!(ErrorConstructor.prototype instanceof Error))
    throw new TypeError('ErrorConstructor must be a subclass of Error.')

  throw new ErrorConstructor(message, { cause })
}

export function identity<T>(value: T): T {
  return value
}

export function isFunction(value: unknown): value is CallableFunction {
  return typeof value === 'function'
}

export function ensureFunction(value: unknown): asserts value is CallableFunction {
  if (!isFunction(value))
    raiseError('Expected a function but received a non-function value.')
}

/*  */

export interface Success<T> {
  readonly ok: true
  readonly value: T
  readonly error?: never
}

export interface Failure<E extends Error = Error> {
  readonly ok: false
  readonly value?: never
  readonly error: E
}

export type Result<T, E extends Error = Error> =
  | Success<T>
  | Failure<E>

export const isSuccess = <T, E extends Error>(result: Result<T, E>): result is Success<T> => result.ok === true
export const isFailure = <T, E extends Error>(result: Result<T, E>): result is Failure<E> => result.ok === false
export const createSuccess = <T>(value: T): Success<T> => ({ ok: true, value } as const)
export const createFailure = <E extends Error>(error: E): Failure<E> => ({ ok: false, error } as const)

export function assertSuccess<T, E extends Error>(result: Result<T, E>): asserts result is Success<T> {
  if (!isSuccess(result)) {
    raiseError(
      `Expected a success result, but got a failure: ${result.error.message}`,
      result.error.constructor as Constructor<Error>,
      result.error.cause,
    )
  }
}

export function unwrapOr<T, E extends Error>(
  result: Result<T, E>,
  defaultValue: T,
): T {
  return result.ok
    ? result.value
    : defaultValue
}

export function unwrapOrThrow<T, E extends Error>(result: Result<T, E>): T {
  assertSuccess(result)

  return result.value
}

export function map<T, U, E extends Error>(
  result: Result<T, E>,
  fn: (value: T) => U,
): Result<U, E> {
  return result.ok
    ? createSuccess(fn(result.value))
    : result
}

export function tap<T, E extends Error>(
  result: Result<T, E>,
  fn: (value: T) => void,
): Result<T, E> {
  if (result.ok)
    fn(result.value)

  return result
}

export function combine<A, B, E extends Error>(
  resultA: Result<A, E>,
  resultB: Result<B, E>,
): Result<[A, B], E> {
  return resultA.ok
    ? resultB.ok
      ? createSuccess([resultA.value, resultB.value])
      : resultB
    : resultA
}

export function recover<T, U, E extends Error>(
  result: Result<T, E>,
  fn: (error: E) => U,
): Result<T | U, never> {
  return result.ok
    ? result
    : createSuccess(fn(result.error))
}

export function chain<T, U, E extends Error>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>,
): Result<U, E> {
  return result.ok
    ? fn(result.value)
    : result
}

export function mapError<T, E extends Error, F extends Error>(
  result: Result<T, E>,
  fn: (error: E) => F,
): Result<T, F> {
  return result.ok
    ? result
    : createFailure(fn(result.error))
}

export interface MatchHandlers<T, E extends Error, R> {
  onSuccess: (value: T) => R
  onFailure: (error: E) => R
}

export function match<T, E extends Error, R>(
  result: Result<T, E>,
  handlers: MatchHandlers<T, E, R>,
): R
export function match<T, E extends Error, R>(
  result: Promise<Result<T, E>>,
  handlers: MatchHandlers<T, E, R>,
): Promise<R>

export function match<T, E extends Error, R>(
  result: Result<T, E> | Promise<Result<T, E>>,
  handlers: MatchHandlers<T, E, R>,
): R | Promise<R> {
  if (result instanceof Promise) {
    return result
      .then(result => match(result, handlers))
      .catch(error => handlers.onFailure(defaultTransformError(error) as E))
  }

  return result.ok
    ? handlers.onSuccess(result.value)
    : handlers.onFailure(result.error)
}

type SyncFunction<T = any> = (...args: any[]) => T
type AsyncFunction<T = any> = (...args: any[]) => Promise<T>

export type AnyFunction<T = any> =
  | SyncFunction<T>
  | AsyncFunction<T>

export type TryCatchReturn<F extends AnyFunction, E extends Error = Error> =
  ReturnType<F> extends Promise<infer R>
    ? Promise<Result<R, E>>
    : Result<ReturnType<F>, E>

export interface ResultErrorOptions<E extends Error = Error> {
  transformError?: (error: unknown) => E
}

function defaultTransformError<E extends Error = Error>(error: unknown): E {
  return (
    error instanceof Error
      ? error
      : new Error(String(error))
  ) as E
}

export function tryCatch<T, E extends Error>(fn: SyncFunction<T>): TryCatchReturn<SyncFunction<T>, E>
export function tryCatch<T, E extends Error>(fn: AsyncFunction<T>): TryCatchReturn<AsyncFunction<T>, E>
export function tryCatch<T, E extends Error>(
  fn: SyncFunction<T>,
  options: ResultErrorOptions,
): TryCatchReturn<SyncFunction<T>, E>
export function tryCatch<T, E extends Error>(
  fn: AsyncFunction<T>,
  options: ResultErrorOptions,
): TryCatchReturn<AsyncFunction<T>, E>

export function tryCatch<T, E extends Error>(
  fn: AnyFunction<T>,
  options: ResultErrorOptions = { transformError: defaultTransformError },
): TryCatchReturn<AnyFunction<T>, E> {
  ensureFunction(fn)

  function handleFailure(error: unknown): Failure<Error> {
    if (options.transformError)
      return createFailure(options.transformError(error))

    return createFailure(defaultTransformError(error))
  }

  try {
    const result = fn()

    if (result instanceof Promise) {
      return result
        .then(createSuccess)
        .catch(handleFailure) as TryCatchReturn<AnyFunction<T>, E>
    }

    return createSuccess(result) as TryCatchReturn<AnyFunction<T>, E>
  }
  catch (error) {
    return handleFailure(error) as TryCatchReturn<AnyFunction<T>, E>
  }
}
