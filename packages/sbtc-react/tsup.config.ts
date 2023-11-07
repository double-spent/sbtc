import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.tsx',
  },
  banner: {
    js: "'use client'",
  },
  format: ['cjs', 'esm'],
  external: ['react'],
  dts: true,
});
