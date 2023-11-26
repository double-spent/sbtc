/** @type {import('jest').Config} */

module.exports = {
  // preset: '@double-spent/sbtc-jest/node',
  transformIgnorePatterns: ['node_modules/(?!.pnpm|micro-packed|@scure/btc-signer)'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': 'babel-jest',
  },
};
