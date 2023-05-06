import { defineConfig } from 'vitepress'
import VueTypeImports from 'vite-plugin-vue-type-imports'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Tiny Player',
  description: 'A sparrow has all five organs.',
  head: [['link', { rel: 'icon', href: '/vite.svg' }]],
  // 主题配置
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // 搜索配置
    search: {
      provider: 'local',
    },
    // 页面顶部的导航栏。它包含站点标题、全局菜单链接等
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/page/001-快速开始' },
      {
        text: 'Follow me',
        items: [
          { text: 'twitter', link: 'https://twitter.com/wangrongding' },
          { text: 'github', link: 'https://github.com/wangrongding' },
        ],
      },
    ],
    // 侧边栏
    sidebar: [
      {
        text: 'Docs',
        items: [
          { text: '快速开始', link: '/page/001-快速开始' },
          { text: '参数与事件', link: '/page/002-参数与事件' },
          { text: 'MSE支持', link: '/page/003-MSE支持' },
          { text: 'Playground', link: '/page/playground' },
          { text: '常见问题', link: '/page/009-常见问题' },
          { text: '开发记录', link: '/page/开发记录' },
          // { text: 'Markdown Examples', link: '/page/markdown-examples' },
          // { text: 'Runtime API Examples', link: '/page/api-examples' },
        ],
      },
    ],
    // 社交网站
    socialLinks: [{ icon: 'github', link: 'https://github.com/wangrongding' }],
    // 页脚
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-present <a href="https://github.com/wangrongding">Rongding</a>',
    },
  },
  // 覆盖默认的 Vite 配置
  vite: {
    server: {
      host: '0.0.0.0',
      port: 12345,
      open: false,
      hmr: true,
    },
    plugins: [VueTypeImports()],
  },
})
