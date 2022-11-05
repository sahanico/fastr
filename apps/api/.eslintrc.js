module.exports = {
  root: true,
  extends: [
    'airbnb-base',
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  env: {
    es2022: true,
    node: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  parser: '@typescript-eslint/parser',
  plugins: ['typescript', 'eslint-plugin-tsdoc', '@typescript-eslint'],
  rules: {
    'no-var': 'off',
    'vars-on-top': 'off',
    'no-underscore-dangle': 'off',
    'no-unused-vars': 'off',
    'global-require': 'off',
    'no-plusplus': 'off',
    'no-await-in-loop': 'off',
    'function-paren-newline': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'tsdoc/syntax': 'warn',
    // 'import/no-unused-modules': [
    //   'error',
    //   {
    //     unusedExports: true,
    //   },
    // ],
    'import/prefer-default-export': 'off',
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { ignoreRestSiblings: true, args: 'after-used' },
    ],
    'object-curly-spacing': ['error', 'always'],
    'import/no-absolute-path': ['error'],
    // this just sorts destructured value imports, ignoreDecSort allows import/order to handle
    'sort-imports': [
      'error',
      { ignoreCase: true, ignoreDeclarationSort: true },
    ],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: false,
        },
        'newlines-between': 'always',
      },
    ],
    'default-case-last': 'error',
    'default-param-last': 'error',
    'no-else-return': [
      'error',
      {
        allowElseIf: false,
      },
    ],
    'no-lonely-if': 'error',
    'no-empty': 'error',
    'no-throw-literal': 'error',
    'prefer-promise-reject-errors': 'error',
    'spaced-comment': ['error', 'always', { block: { balanced: true } }],
    'padding-line-between-statements': 'off',
    '@typescript-eslint/padding-line-between-statements': [
      // https://eslint.org/docs/rules/padding-line-between-statements#options
      'error',

      // ensures newlines come after the block of import statements
      { blankLine: 'always', prev: 'import', next: '*' },
      { blankLine: 'any', prev: 'import', next: 'import' },

      // ensures functions (block like) are separated by a new line
      { blankLine: 'always', prev: 'block-like', next: 'block-like' },

      // ensures exports have a new line if next block is a function
      { blankLine: 'always', prev: 'export', next: 'block-like' },

      // ensures functions have a new line if next block is an export
      { blankLine: 'always', prev: 'block-like', next: 'export' },
    ],
    'prettier/prettier': ['warn', { singleQuote: true }],
    eqeqeq: ['error', 'smart'],
    quotes: [2, 'single', 'avoid-escape'],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
  },
};
