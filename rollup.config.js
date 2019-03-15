// rollup.config.js
import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import resolve from "rollup-plugin-node-resolve";
import sourceMaps from 'rollup-plugin-sourcemaps'


import pkg from './package.json';

const sharedConfig = {
  plugins: [
    typescript(),
    resolve({ jsnext: true }),
    commonjs(),
    sourceMaps(),
  ]
}

export default [

  Object.assign({}, sharedConfig, {
    input: './src/ps-web-apis.ts',
    output: [{
      file: pkg.module,
      format: 'es' ,
    }, {
      file: pkg.main, 
      format: 'cjs'
    }]
  }),

  Object.assign({}, sharedConfig, {
    input: './src/apiprovide.ts',
    output: [{
      file: 'dist/apiprovide.esm.js',
      format: 'es' ,
    }, {
      file: 'dist/apiprovide.cjs.js', 
      format: 'cjs'
    }]
  })

]
