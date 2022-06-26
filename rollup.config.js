import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';

console.log(process.env.DEBUG);

export default {
  input: 'src/main.ts',
  output: {
    file: 'public/main.js',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    typescript(),
    replace({
      'process.env.DEBUG': process.env.DEBUG,
      preventAssignment: true
    })
  ],
};
