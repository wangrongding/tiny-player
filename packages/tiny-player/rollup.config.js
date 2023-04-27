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
      format: 'es',
      sourcemap: true,
    },
    {
      file: 'dist/index.min.js',
      format: 'es',
      plugins: [terser()],
    },
    {
      file: 'dist/index.umd.js',
      format: 'umd', // umd是兼容amd/cjs/iife的通用打包格式，适合浏览器
      name: 'TinyPlayer', // cdn方式引入时挂载在window上的名字
    },
    {
      file: 'dist/index.cjs',
      format: 'cjs',
    },
    {
      file: 'dist/index.iife.js',
      format: 'iife',
      name: 'iife',
    },
  ],

  plugins: [
    // watch({ include: 'src/**' }),
    del({
      targets: 'dist/*',
      runOnce: true,
    }),
    svg({
      stringify: true, // process SVG to DOM Node or String. Default: false
    }),
    json(),
    scss({
      fileName: 'bundle.css',
      insert: true, // 将 CSS 插入到 HTML 中
    }),
    typescript({
      tsconfig: './tsconfig.json',
    }),
    ejs({
      // inlineStyles: true, // 编译 scss 插入行间样式，默认为 false
      exclude: ['**/index.html'], // optional, undefined by default
      compilerOptions: { client: true }, // optional, any options supported by ejs compiler
    }),
  ],
}
