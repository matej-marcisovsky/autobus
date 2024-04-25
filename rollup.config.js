import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';

export default {
  input: 'dist/client/app.js',
  output: {
    file: 'dist/client/static/bundle.js',
    format: 'iife',
  },
  plugins: [
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    nodeResolve(),
    commonjs({
      include: 'node_modules/**',
    }),
  ],
};
