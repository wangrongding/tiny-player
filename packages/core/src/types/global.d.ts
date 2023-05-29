declare module '*.css' {
  const css: string
  export default css
}
declare module '*.scss' {
  const css: string
  export default css
}

declare module '*.svg' {
  const src: string
  export default src
}

// 通过 rollup-plugin-ejs 编译后的模板函数
declare module '*.ejs' {
  const fn: (...arg: any) => string
  export default fn
}

declare module '*.json' {
  const value: Record<string, any>
  export default value
}

declare module 'hls.js' {
  import Hls from 'node_modules/hls.js/dist/hls.js'
  export default Hls
}

// 扩展 window 对象
interface Window {
  // Hls: typeof import('hls.js')
  Hls: any
  Flv: any
  Dash: any
  TinyPlayer: any
}
