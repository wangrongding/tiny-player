<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { PlayerOptions } from 'tiny-player'

const props = defineProps<{
  playerOptions: Omit<PlayerOptions, 'container'>
}>()

// 初始化 player
let TinyPlayer
async function initPlayer(options: PlayerOptions) {
  TinyPlayer = (await import('tiny-player')).default
  new TinyPlayer(options)
}

onMounted(() => {
  console.log('🚀🚀🚀 / props:', props)
  initPlayer(
    Object.assign(
      {
        container: document.querySelector('#tiny-player') as HTMLElement,
      },
      props.playerOptions,
    ),
  )
  // if (!import.meta.env.SSR) return
})
</script>

<template>
  <div id="tiny-player"></div>
</template>
