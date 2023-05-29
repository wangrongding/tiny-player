import DefaultTheme from 'vitepress/theme'
import '../style/index.scss'
import './tailwind.postcss'
import 'element-plus/dist/index.css'

import HomePlayer from '../../components/HomePlayer.vue'
import TinyPlayer from '../../components/TinyPlayer.vue'

export default {
  extends: DefaultTheme,
  Layout: HomePlayer, // 注入到 layout 的组件
  async enhanceApp({ app }) {
    app.component('TinyPlayer', TinyPlayer) // 注册全局组件

    const elementPlus = await import('element-plus')
    app.use(elementPlus)
  },
}
