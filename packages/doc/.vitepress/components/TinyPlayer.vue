<script setup lang="ts">
import { onMounted, ref } from 'vue'
import TinyPlayer from 'tiny-player'
import type { PlayerOptions } from 'tiny-player'
import movie from '/movie.mp4'
import poster from '/movie.png'

const title = ref<HTMLHeadingElement>()
const props = withDefaults(defineProps<PlayerOptions>(), {
  container: document.querySelector('#tiny-player') as any, // // 这里的 any 类型是为了解决目前 vue3 中，defineProps 仍然对外部导入或者推导出的类型不友好的问题！(都两年了...)// issue: https://github.com/vuejs/core/issues/4294 , https://github.com/vuejs/core/pull/8083
  src: movie, // 视频地址
  poster: poster, // 封面地址
  width: '800px', // 宽度
  controls: true, // 是否显示控制栏
  loop: true, // 循环播放
  volume: 0.9, // 音量
})

// 初始化 player
function initPlayer(options: PlayerOptions) {
  // new TinyPlayer(options)
  new TinyPlayer(options)
}

onMounted(() => {
  initPlayer({
    container: document.querySelector('#tiny-player')!, // 要挂载的目标容器
    src: movie, // 视频地址
    poster: poster, // 封面地址
    width: '800px', // 宽度
    controls: true, // 是否显示控制栏
    loop: true, // 循环播放
    volume: 0.9, // 音量
  })
})
</script>

<template>
  <div id="tiny-player"></div>
</template>
