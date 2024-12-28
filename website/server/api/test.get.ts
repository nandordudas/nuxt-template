import { setTimeout } from 'node:timers/promises'

export default defineEventHandler(() => {
  return setTimeout(1_000, {
    message: 'ok',
  } as const)
})
