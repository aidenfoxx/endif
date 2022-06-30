import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

export default [
  {
    input: [
      'src/main.ts',
      'src/assetWorker.ts',
    ],
    output: {
      dir: 'dist',
      format: 'esm',
      sourcemap: true,
      chunkFileNames: 'main.[hash].js',
    },
    plugins: [typescript()],
  },
  {
    input: 'dist/dts/main.d.ts',
    output: {
      file: 'dist/main.d.ts',
      format: 'esm',
    },
    plugins: [dts()],
  },
];
