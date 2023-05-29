import typescript from 'rollup-plugin-typescript2'
import ejs from 'rollup-plugin-ejs'
import { terser } from 'rollup-plugin-terser'
import scss from 'rollup-plugin-scss'
import json from '@rollup/plugin-json'
import svg from 'rollup-plugin-svg-import'
import del from 'rollup-plugin-delete'
import alias from '@rollup/plugin-alias'
import { nodeResolve } from '@rollup/plugin-node-resolve'

const isDev = process.env.IS_DEV
console.log('🌸🌸🌸isDev:', isDev)

/**
 * @type {import('rollup').RollupOptions}
 */
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
      globals: {
        'hls.js': 'Hls',
      },
    },
    {
      file: 'dist/index.iife.js',
      format: 'iife',
      name: 'iife',
      globals: {
        'hls.js': 'Hls',
      },
    },
  ],
  // external: !isDev ? ['hls.js'] : [], // 不被打包到库中，沿用外部依赖

  plugins: [
    !isDev && nodeResolve(),
    !isDev && del({ targets: 'dist/*' }),
    alias({ entries: [{ find: '@', replacement: 'src' }] }),
    svg({
      stringify: true, // process SVG to DOM Node or String. Default: false
    }),
    json(),
    scss({
      fileName: 'bundle.css',
      insert: true, // 将 CSS 插入到 HTML 中
    }),
    typescript({
      useTsconfigDeclarationDir: true,
    }),
    ejs({
      // inlineStyles: true, // 编译 scss 插入行间样式，默认为 false
      exclude: ['**/index.html'], // optional, undefined by default
      compilerOptions: { client: true }, // optional, any options supported by ejs compiler
    }),
  ],
  // 无法观察到部分非 js/ts 文件的变化
  // watch: {
  //   include: 'src/**',
  //   clearScreen: true, // 清除控制台
  //   // buildDelay: 1000, // 延迟多少毫秒后再次构建
  //   chokidar: {
  //     depth: 99,
  //     usePolling: true, // 底层实际是：选择 fs.watchFile（由轮询支持）还是 fs.watch。如果轮询导致 CPU 使用率较高，请考虑将其设置为 false 。
  //     interval: 2000, // 文件系统轮询的间隔，以毫秒为单位。
  //     binaryInterval: 2000, // 文件系统轮询二进制文件的间隔。
  //   },
  // },
}
