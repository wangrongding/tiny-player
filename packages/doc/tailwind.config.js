/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,vue}',
    './page/**/*.{js,ts,vue}',
    './.vitepress/**/*.{js,ts,vue,scss}',
    './page/**/*.md',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
