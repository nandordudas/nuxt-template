import type { UserConfig } from '@commitlint/types'

export default {
  extends: ['@commitlint/config-conventional'],
  parserPreset: 'conventional-changelog-atom',
  formatter: '@commitlint/format',
  rules: { /* [TODO] https://commitlint.js.org/reference/rules.html */ },
} satisfies UserConfig
