import antfu from '@antfu/eslint-config'

const MAXIMUM_CODE_LINE_LENGTH: number = 120
const MAXIMUM_CYCLOMATIC_COMPLEXITY: number = 5

export default antfu()
  .override('antfu/stylistic/rules', {
    rules: {
      'curly': ['error', 'multi-or-nest', 'consistent'],
      'style/brace-style': ['error', 'stroustrup', {
        allowSingleLine: false,
      }],
      'style/max-len': ['error', {
        code: MAXIMUM_CODE_LINE_LENGTH,
        ignorePattern: '.*\\n.*|class="[^"]*"',
        ignoreComments: true,
        ignoreUrls: true,
      }],
      'unicorn/numeric-separators-style': ['error', {
        number: {
          minimumDigits: 4,
          groupLength: 3,
        },
      }],
    },
  })
  .override('antfu/typescript/rules', {
    rules: {
      'complexity': ['error', MAXIMUM_CYCLOMATIC_COMPLEXITY],
      'no-restricted-syntax': ['error', 'DebuggerStatement', 'LabeledStatement', 'WithStatement'],
      'ts/max-params': ['error', {
        max: 3,
      }],
    },
  })
