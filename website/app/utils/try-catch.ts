import type { Constructor, TryCatch } from '~~/types'

export class Predicate {
  static isFunction(value: unknown): value is CallableFunction {
    return typeof value === 'function'
  }

  static instanceOf<T>(value: unknown, constructor: Constructor<T>): value is T {
    return value instanceof constructor
  }
}

export class Assert {
  static ensureFunction(fn: unknown): asserts fn is CallableFunction {
    if (!Predicate.isFunction(fn))
      throw new TypeError('fn must be a function.')
  }
}

export class Try {
  static sync<T, E extends Error>(fn: () => T): TryCatch.Result<T, E> {
    try {
      Assert.ensureFunction(fn)

      const result = fn()

      return Result.createSuccess(result)
    }
    catch (error) {
      return Result.createFailureFrom<E>(error)
    }
  }

  static async async<T, E extends Error>(fn: Promise<T>): Promise<TryCatch.Result<T, E>>
  static async async<T, E extends Error>(fn: () => Promise<T>): Promise<TryCatch.Result<T, E>>
  static async async<T, E extends Error>(fn: (() => Promise<T>) | Promise<T>): Promise<TryCatch.Result<T, E>> {
    try {
      if (Predicate.instanceOf(fn, Promise)) {
        const result = await fn

        return Result.createSuccess(result)
      }

      Assert.ensureFunction(fn)

      const result = await fn()

      return Result.createSuccess(result)
    }
    catch (error) {
      return Result.createFailureFrom<E>(error)
    }
  }
}

class Result {
  static destructure<T, E extends Error>(result: TryCatch.Result<T, E>) {
    if (result.ok)
      return { data: result.value, error: null }

    return { data: null, error: result.error }
  }

  static isSuccess<T, E extends Error>(result: TryCatch.Result<T, E>): result is TryCatch.Success<T> {
    return result.ok
  }

  static isFailure<T, E extends Error>(result: TryCatch.Result<T, E>): result is TryCatch.Failure<E> {
    return !result.ok
  }

  static createSuccess<T>(value: T): TryCatch.Success<T> {
    return { ok: true, value }
  }

  static createFailure<E extends Error>(error: E): TryCatch.Failure<E> {
    return { ok: false, error }
  }

  static createFailureFrom<E extends Error>(value: unknown): TryCatch.Failure<E> {
    const error = (value instanceof Error ? value : new Error(String(value))) as E

    return Result.createFailure(error)
  }

  static match<T, E extends Error>(
    result: TryCatch.Result<T, E>,
    options: { onResult: (result: T) => T, onFailure: (error: E) => E } = {
      onResult: value => value,
      onFailure: error => error,
    },
  ): T | E {
    return result.ok ? options.onResult(result.value) : options.onFailure(result.error)
  }
}
