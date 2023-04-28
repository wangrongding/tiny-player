import { defineConfig } from 'vitepress'
import VueTypeImports from 'vite-plugin-vue-type-imports'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Tiny Player',
  description: 'A sparrow has all five organs.',
  head: [['link', { rel: 'icon', href: '/vite.svg' }]],
  vite: {
    server: {
      host: '0.0.0.0',
      port: 12345,
      open: true,
      hmr: true,
    },
    plugins: [VueTypeImports()],
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

    search: {
      provider: 'local',
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/markdown-examples' },
    ],

    sidebar: [
      {
        text: 'Docs',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/wangrongding' }],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-present <a href="https://github.com/wangrongding">Rongding</a>',
    },
  },
})
