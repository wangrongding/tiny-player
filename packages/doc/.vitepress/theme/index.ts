import DefaultTheme from 'vitepress/theme'
import '../style/index.scss'
import HomePlayer from '../components/HomePlayer.vue'
import TinyPlayer from '../components/TinyPlayer.vue'

export default {
  extends: DefaultTheme,
  Layout: HomePlayer, // 注入到 layout 的组件
  async enhanceApp({ app }) {
    app.component('TinyPlayer', TinyPlayer) // 注册全局组件
  },
}
