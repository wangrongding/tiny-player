import typescript from 'rollup-plugin-typescript2'
import ejs from 'rollup-plugin-ejs'
import { terser } from 'rollup-plugin-terser'
import scss from 'rollup-plugin-scss'
import json from '@rollup/plugin-json'
import svg from 'rollup-plugin-svg-import'
import del from 'rollup-plugin-delete'

export default {
  input: 'src/index.ts',

  output: [
    {
      file: 'dist/index.js',
      format: 'umd',
      name: 'TinyPlayer',
      sourcemap: true,
    },
    {
      file: 'dist/index.min.js',
      format: 'umd',
      name: 'TinyPlayer',
      plugins: [terser()],
    },
    {
      file: 'dist/index.iife.js',
      format: 'iife',
      name: 'iife',
    },
    {
      file: 'dist/index.cjs',
      format: 'cjs',
    },
    {
      file: 'dist/index.mjs',
      format: 'es',
    },
    {
      file: 'dist/index.amd.js',
      format: 'amd',
    },
  ],

  plugins: [
    // watch({ include: 'src/**' }),
    del({
      targets: 'dist/*',
      // runOnce: true,
    }),
    svg({
      stringify: true, // process SVG to DOM Node or String. Default: false
    }),
    json(),
    scss({
      fileName: 'bundle.css',
      insert: true, // 将 CSS 插入到 HTML 中
    }),
    typescript(),
    ejs({
      // inlineStyles: true, // 编译 scss 插入行间样式，默认为 false
      exclude: ['**/index.html'], // optional, undefined by default
      compilerOptions: { client: true }, // optional, any options supported by ejs compiler
    }),
  ],
}
