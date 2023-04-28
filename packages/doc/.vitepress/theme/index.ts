import DefaultTheme from 'vitepress/theme'
import '../style/index.scss'
import Player from '../components/Player.vue'
import HomePlayer from '../components/HomePlayer.vue'

export default {
  extends: DefaultTheme,
  Layout: HomePlayer, // 注入到 layout 的组件
  async enhanceApp({ app }) {
    // 注册全局组件
    app.component('TinyPlayer', Player)
    // app.component('TinyPlayer', TinyPlayer)

    // if (!import.meta.env.SSR) {
    //   const TinyPlayer = await import('../components/TinyPlayer.vue')
    // }
  },
}
