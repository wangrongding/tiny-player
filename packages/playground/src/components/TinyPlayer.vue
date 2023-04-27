<script setup lang="ts">
import { onMounted, ref } from 'vue'
import TinyPlayer from 'tiny-player'
import movie from '../assets/movie.mp4'
import poster from '../assets/movie.png'

defineProps<{ msg: string }>()
const title = ref<HTMLHeadingElement>()

onMounted(() => {
  title.value!.textContent = `${TinyPlayer.title} ${TinyPlayer.version}`

  // 创建 player
  new TinyPlayer({
    container: document.querySelector('#tiny-player')!, // 要挂载的目标容器
    src: movie, // 视频地址
    poster: poster, // 封面地址
    width: '800px', // 宽度
    controls: true, // 是否显示控制栏
    loop: true, // 循环播放
    volume: 0.9, // 音量
    // watermark: false, // 水印
    // autoplay: true, // 自动播放
    // muted: true, // 静音
    // nativeControl: true, // 原生控制栏
  })
})
</script>

<template>
  <h1 ref="title">{{ msg }}</h1>
  <div id="tiny-player"></div>
</template>

<style scoped></style>
