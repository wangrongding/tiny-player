<script setup lang="ts">
import TinyPlayer from './TinyPlayer.vue'
import movie from '/movie.mp4'
import poster from '/movie.png'
import type { PlayerOptions } from 'tiny-player'

const options: Omit<PlayerOptions, 'container'> = {
  src: movie, // 视频地址
  poster: poster, // 封面地址
  width: '800px', // 宽度
  controls: true, // 是否显示控制栏
  loop: true, // 循环播放
  volume: 0.9, // 音量
}
</script>

<template>
  <TinyPlayer :playerOptions="options" />
</template>
