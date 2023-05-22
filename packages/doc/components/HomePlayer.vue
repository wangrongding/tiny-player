<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import TinyPlayer from './TinyPlayer.vue'
import movie from '/movie.mp4'
import poster from '/movie.png'
import type { PlayerOptions } from 'tiny-player'

const options: Omit<PlayerOptions, 'container'> = {
  src: movie, // 视频地址
  poster: poster, // 封面地址
  width: '600px', // 宽度
  controlOptions: {
    playTime: true, // 是否显示播放时间
    volumeBar: true, // 是否显示音量控制条
    fullScreenButton: true, // 是否显示全屏按钮
    mountTarget: null, // 挂载目标节点
    nativeControls: false, // 是否使用原生控制条
  },
  loop: true, // 循环播放
  volume: 0.9, // 音量
  type: 'auto',
}
const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #home-hero-image>
      <TinyPlayer :playerOptions="options" />
    </template>
  </Layout>
</template>
