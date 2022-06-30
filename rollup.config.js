import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: [
      'src/main.ts',
      'packages/endif/dist/assetWorker.js',
    ],
    output: {
      dir: 'public',
      format: 'esm',
      sourcemap: true,
      chunkFileNames: 'main.[hash].js',
    },
    plugins: [
      nodeResolve(),
      replace({
        'process.env.DEBUG': process.env.DEBUG,
        preventAssignment: true
      }),
      typescript(),
    ],
  },
];
