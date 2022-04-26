import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'dist/autobus.js',
  output: {
    file: 'app/bundle.js',
    format: 'iife'
  },
  plugins: [
    nodeResolve(),
    commonjs({
      include: 'node_modules/**'
    })
  ]
};