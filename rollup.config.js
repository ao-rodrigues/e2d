import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: 'index.js',
  output: {
    file: 'dist/e2d.js',
    format: 'umd',
    name: 'e2d'
  },
  watch: {
    include: ['./src/**', './index.js']
  },
  plugins: [
    commonjs({}),
    nodeResolve({
      jsnext: true,
      main: true
    }),
  ]
}