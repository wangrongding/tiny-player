<script setup lang="ts">
import { onMounted } from 'vue'

let startX
let startY
let startWidth
let startHeight
let resizableDiv

function initResize(e) {
  startX = e.clientX
  startY = e.clientY
  startWidth = resizableDiv.offsetWidth
  startHeight = resizableDiv.offsetHeight
  document.documentElement.addEventListener('mousemove', doResize)
  document.documentElement.addEventListener('mouseup', stopResize)
}

function doResize(e) {
  const dx = e.clientX - startX
  const dy = e.clientY - startY
  resizableDiv.style.width = startWidth + dx + 'px'
  resizableDiv.style.height = startHeight + dy + 'px'
}

function stopResize() {
  document.documentElement.removeEventListener('mousemove', doResize)
  document.documentElement.removeEventListener('mouseup', stopResize)
}

onMounted(() => {
  resizableDiv = document.getElementById('resizable-div')
  resizableDiv.addEventListener('mousedown', initResize)
})
</script>
<template>
  <div
    class="control-target bg-gradient-to-r border-blue-400 border-2 border-solid from-red-500 to-sky-500 h-[200px] relative grid place-content-center"
    id="resizable-div"
  >
    目标节点
  </div>
</template>
<style lang="scss" scoped>
#resizable-div::after {
  content: '';
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 10px;
  height: 10px;
  background-color: #ccc;
  cursor: nwse-resize;
}
</style>
