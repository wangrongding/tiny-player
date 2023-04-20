import typescript from 'rollup-plugin-typescript2'

export default {
  input: 'src/index.ts',
  output: {
    dir: "./dist",
    format: "es",
    // file: 'dist/index.js',
    // format: 'iife',
    name: 'TinyPlayer',
  },
  plugins: [typescript()],
}
