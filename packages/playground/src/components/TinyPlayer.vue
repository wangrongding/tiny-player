<script setup lang="ts">
import { onMounted } from 'vue'
import TinyPlayer from 'tiny-player'
import movie from '../assets/movie.mp4'
import poster from '../assets/movie.png'

defineProps<{ msg: string }>()

onMounted(() => {
  document.querySelector('h1')!.textContent = `${TinyPlayer.title} ${TinyPlayer.version}`

  // 创建 player
  new TinyPlayer({
    container: document.querySelector('#tiny-player'), // 要挂载的目标容器
    // src: './movie.mp4', // 视频地址
    src: movie, // 视频地址
    poster: poster, // 封面地址
    width: '800px', // 宽度
    controls: true,
    loop: true,
    volume: 0.9,
    // autoplay: true,
    // muted: true,
    // nativeControl: true, // 原生控制栏
  })
})
</script>

<template>
  <h1>{{ msg }}</h1>
  <div id="tiny-player"></div>
</template>

<style scoped></style>
