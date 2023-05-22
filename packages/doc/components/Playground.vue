<script setup lang="ts">
import { onMounted, reactive, ref, toRefs, unref, toValue, toRaw } from 'vue'
import type { PlayerOptions } from 'tiny-player'
import TinyPlayer from 'tiny-player'
import poster from '/movie.png'
import movie from '/movie.mp4'
import ResizeBox from './ResizeBox.vue'

// const videoSource = 'https://vip.lz-cdn10.com/20220808/2194_085d3e14/1200k/hls/mixed.m3u8'
// const videoSource = 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8'
const videoSource = movie

// 初始化 player
let player: TinyPlayer
async function initPlayer(options: PlayerOptions) {
  // SSR 改用 import() 方式引入
  let TinyPlayer = (await import('tiny-player')).default
  player = new TinyPlayer(options)
}

const playOptions: PlayerOptions = reactive({
  container: null,
  width: '800px', // 宽度
  controlOptions: {
    playTime: true, // 是否显示播放时间
    volumeBar: true, // 是否显示音量控制条
    fullScreenButton: true, // 是否显示全屏按钮
    mountTarget: null, // 挂载目标节点
    nativeControls: false, // 是否使用原生控制条
  },
  loop: true, // 循环播放
  volume: 0.9, // 音量
  preload: 'metadata', // 预加载
  poster: poster, // 封面地址
  src: videoSource, // 视频地址
  type: 'hls', // 视频类型
  waterMarkShow: true, // 是否显示水印
})

// 测试事件绑定注销用
function aaa() {
  console.log('aaaaaaaaaaaaaa')
}
function bbb() {
  console.log('bbbbbbbbbbbbbb')
}

// 显示隐藏水印
function toggleWaterMark(val) {
  player.handleWaterMarkShow(val)
}

// 挂载 control 到目标节点
function mountControl() {
  document.querySelector('.placeholder')?.remove()
  const target: HTMLElement = document.querySelector('.control-target')
  player.mountController(target)
}
// 恢复 control
function resetControl() {
  player.mountController(player.videoContainer)
}

onMounted(() => {
  playOptions.container = document.getElementById('tiny-player')
  const options = toRaw(playOptions)
  initPlayer(options)
})
</script>
<template>
  <div class="page-warp grid place-content-center mt-10">
    <div id="tiny-player"></div>
    <div>
      <p class="text-black bg-amber-200 leading-8 box-border my-4">💡 调试栏</p>
      <div class="gap-4 my-4 flex flex-col">
        <div>
          <el-button type="primary" @click="mountControl">转移控制栏到目标节点</el-button>
          <el-button type="primary" @click="resetControl">恢复控制栏</el-button>
        </div>
        <ResizeBox />
      </div>
      <div class="flex my-4 justify-between">
        <el-switch
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #686767"
          v-model="playOptions.waterMarkShow"
          class="px-4 select-none"
          inline-prompt
          active-text="显示水印"
          inactive-text="隐藏水印"
          @change="toggleWaterMark"
        />
        <el-button type="primary" @click="() => player.on('timeupdate', aaa)">挂载事件 A 到 timeupdate</el-button>
        <el-button type="primary" @click="() => player.on('timeupdate', bbb)">挂载事件 B 到 timeupdate</el-button>
        <el-button type="danger" @click="() => player.off('timeupdate', aaa)">从 timeupdate 回调，移除 A</el-button>
      </div>
    </div>
  </div>
</template>
