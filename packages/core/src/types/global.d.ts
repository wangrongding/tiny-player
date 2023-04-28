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
