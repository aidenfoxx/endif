import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/main.ts',
  output: {
    file: 'public/main.js',
    format: 'esm',
    sourcemap: true
  },
  plugins: [
    typescript()
  ],
};
