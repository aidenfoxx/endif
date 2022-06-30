import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: [
      'src/main.ts',
      'src/assetWorker.ts',
    ],
    output: {
      dir: 'public',
      format: 'esm',
      sourcemap: true,
      chunkFileNames: 'main.[hash].js',
    },
    plugins: [
      typescript(),
      replace({
        'process.env.DEBUG': process.env.DEBUG,
        preventAssignment: true
      })
    ],
  }
];
