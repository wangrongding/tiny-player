import typescript from 'rollup-plugin-typescript2'
import ejs from 'rollup-plugin-ejs'
import { terser } from 'rollup-plugin-terser'
import scss from 'rollup-plugin-scss'
import serve from 'rollup-plugin-serve'
import json from '@rollup/plugin-json'
import url from '@rollup/plugin-url'

export default {
  input: 'src/index.ts',

  output: [
    {
      file: 'dist/index.js',
      format: 'umd',
      name: 'TinyPlayer',
    },
    {
      file: 'dist/index.min.js',
      format: 'iife',
      name: 'version',
      plugins: [terser()],
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
    json(),
    serve({
      // open: true,
      openPage: 'index.html', // 指定打开的页面
      host: 'localhost', // 默认localhost
      port: 5500, // 默认10001
      contentBase: ['dist', 'test'], // 配置静态文件路径,默认为当前路径
    }),
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
    url({
      include: ['**/*.svg', '**/*.png', '**/*.jp(e)?g', '**/*.gif', '**/*.webp'],
      limit: 1024, // 内联文件的文件大小限制。如果文件超过此限制，它将被复制到目标文件夹并提供散列文件名。如果将 limit 设置为 0 ，将复制所有文件。
    }),
  ],
}
