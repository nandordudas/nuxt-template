import type { UserConfig } from '@commitlint/types'

export default {
  extends: [
    '@commitlint/config-conventional',
  ],
  parserPreset: 'conventional-changelog-atom',
  formatter: '@commitlint/format',
  rules: {
    'type-enum': [2, 'always', ['foo']],
  },
} satisfies UserConfig
