<script setup>
import { defineClientComponent } from 'vitepress'

const ClientComponent = defineClientComponent(() => {
  return import('./TinyPlayer.vue')
})
</script>

<template>
  <ClientComponent />
</template>
