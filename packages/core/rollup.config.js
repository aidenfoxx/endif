import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: 'src/main.ts',
    output: {
      file: 'dist/main.js',
      format: 'esm',
      sourcemap: true
    },
    plugins: [
      nodeResolve(),
      typescript({ tsconfig: './tsconfig.json' }),
    ],
  },
];
