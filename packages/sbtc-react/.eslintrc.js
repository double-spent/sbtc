module.exports = {
  root: true,
  extends: ['sbtc'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['.eslintrc.js', 'jest.config.js'],
};
