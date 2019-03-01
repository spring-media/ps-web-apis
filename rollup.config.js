// rollup.config.js
import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import resolve from "rollup-plugin-node-resolve";
import sourceMaps from 'rollup-plugin-sourcemaps'


import pkg from './package.json';


export default {
  input: './src/ps-web-apis.ts',
  plugins: [
    typescript(),
    resolve({ jsnext: true }),
    commonjs(),
    sourceMaps(),

  ],
  output: [{
    file: pkg.module,
    format: 'es' ,
  }, {
    file: pkg.main, 
    format: 'cjs'
  }]
}
