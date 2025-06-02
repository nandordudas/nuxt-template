declare module 'nuxt/schema' {
  interface RuntimeConfig {
    /* [TODO] */
  }

  interface PublicRuntimeConfig {
    /* [TODO] */
  }
}

export type Constructor<T> = new (...args: any[]) => T

export declare namespace TryCatch {
  interface Success<T> {
    readonly ok: true
    readonly value: T
    readonly error?: never
  }

  interface Failure<E extends Error> {
    readonly ok: false
    readonly value?: never
    readonly error: E
  }

  type Result<T, E extends Error> = Success<T> | Failure<E>
}

export {}
