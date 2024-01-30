module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:import/typescript',
    'plugin:@typescript-eslint/eslint-recommended',
    'next',
    'next/core-web-vitals',
    'plugin:prettier/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 8,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'import'],
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  rules: {
    'react/prop-types': 'off',
    'no-console': 'off',
    'no-bitwise': 'off',
    'object-curly-newline': 'off',
    'react/require-default-props': 'off',
    'no-unused-expressions': 'off',
    'import/extensions': 'off',
    'react/jsx-filename-extension': [
      2,
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    ],
    'import/prefer-default-export': 0,
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 0,
    'react/jsx-props-no-spreading': 0,
    'react/function-component-definition': [
      2,
      {
        namedComponents: ['arrow-function', 'function-declaration'],
        unnamedComponents: 'arrow-function',
      },
    ],
    'react/no-unstable-nested-components': 'off',
    '@next/next/no-img-element': 'off',
    semi: [2, 'never'],
    'no-unused-vars': 'off',
    'react/react-in-jsx-scope': 'off',
    'max-classes-per-file': ['error', 3],
    'jsx-quotes': ['error', 'prefer-double'],
    'jsx-a11y/anchor-is-valid': 'off',
    'import/order': [
      'warn',
      {
        warnOnUnassignedImports: true,
        pathGroupsExcludedImportTypes: ['type'],
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['*.json'],
      rules: {
        quotes: ['error', 'double'],
        'quote-props': 0,
        'comma-dangle': 0,
      },
    },
  ],
}
