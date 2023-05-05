<script setup lang="ts">
import { onMounted } from 'vue'
import type { PlayerOptions } from 'tiny-player'

const props = defineProps<{
  playerOptions: Omit<PlayerOptions, 'container'>
}>()

// 初始化 player
// if (!import.meta.env.SSR)
let TinyPlayer
async function initPlayer(options: PlayerOptions) {
  TinyPlayer = (await import('tiny-player')).default
  new TinyPlayer(options)
}

onMounted(() => {
  initPlayer({ container: document.querySelector('#tiny-player'), ...props.playerOptions })
})
</script>

<template>
  <div id="tiny-player"></div>
</template>
