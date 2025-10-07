import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: [
    '@vechain/connex',
    '@vechain/connex-driver',
    '@vechain/connex-framework',
    'thor-devkit',
  ],
});
