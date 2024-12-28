import type { RetryOptions } from '~/utils/loading/types'

export const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  delayMs: 1_000,
  onRetry: () => {},
  signal: AbortSignal.timeout(5_000),
}
