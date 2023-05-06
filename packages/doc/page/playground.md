---
# https://vitepress.dev/reference/default-theme-home-page
layout: page
---

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { PlayerOptions } from 'tiny-player'
import movie from '/movie.mp4'
import poster from '/movie.png'


// 初始化 player
let TinyPlayer
async function initPlayer(options: PlayerOptions) {
  TinyPlayer = (await import('tiny-player')).default
  new TinyPlayer(options)
}
onMounted(() => {
  const options ={
    container: document.querySelector('#tiny-player'),
    src: movie, // 视频地址
    poster: poster, // 封面地址
    width: '800px', // 宽度
    controls: true, // 是否显示控制栏
    loop: true, // 循环播放
    volume: 0.9, // 音量 
  }
  initPlayer(options)
})
</script>

<div class="page-warp">
  <div id="tiny-player"></div>
</div>

<style lang="scss">
.page-warp{
  margin-top:100px;
  display:grid;
  place-items:center;
}
</style>
