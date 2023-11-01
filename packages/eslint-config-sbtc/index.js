module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['next', 'turbo', 'prettier'],
  plugins: ['@typescript-eslint', 'simple-import-sort', 'unused-imports'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    '@typescript-eslint/consistent-type-exports': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
    ],
    'simple-import-sort/imports': [
      'warn',
      {
        groups: [['^\\w'], ['^@\\w'], ['^\\..\\/'], ['^\\.\\/']],
      },
    ],
  },
};
