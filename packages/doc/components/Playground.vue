<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { PlayerOptions } from 'tiny-player'
import poster from '/movie.png'
import movie from '/movie.mp4'

// const videoSource = 'https://vip.lz-cdn10.com/20220808/2194_085d3e14/1200k/hls/mixed.m3u8'
// const videoSource = 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8'
const videoSource = movie

// 初始化 player
let player
async function initPlayer(options: PlayerOptions) {
  // SSR 改用 import() 方式引入
  let TinyPlayer = (await import('tiny-player')).default
  player = new TinyPlayer(options)
}

onMounted(() => {
  const options: PlayerOptions = {
    container: document.querySelector('#tiny-player'),
    width: '800px', // 宽度
    controls: true, // 是否显示控制栏
    loop: true, // 循环播放
    volume: 0.9, // 音量
    preload: 'metadata', // 预加载
    poster: poster, // 封面地址
    src: videoSource, // 视频地址
    type: 'hls', // 视频类型
  }
  initPlayer(options)
})

function aaa() {
  console.log('aaaaaaaaaaaaaa')
}
function bbb() {
  console.log('bbbbbbbbbbbbbb')
}
</script>
<template>
  <div class="page-warp grid place-content-center mt-10">
    <div id="tiny-player"></div>
    <div>
      <p class="text-black bg-amber-200 leading-8 box-border my-4">💡 调试栏</p>
      <div class="flex gap-8 my-4">
        <el-button type="primary" @click="() => player.on('timeupdate', aaa)">挂载事件 aaa 到 timeupdate</el-button>
        <el-button type="primary" @click="() => player.on('timeupdate', bbb)">挂载事件 bbb 到 timeupdate</el-button>
        <el-button type="danger" @click="() => player.off('timeupdate', aaa)">从 timeupdate 回调，移除 aaa</el-button>
      </div>
      <div class="flex gap-8 my-4">开关水印</div>
    </div>
  </div>
</template>
