<script setup lang="ts">
import { onMounted } from 'vue'

let startX, startY, startWidth, startHeight, resizableDiv, dragDiv

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
  dragDiv = document.querySelector('.drag-el')
  dragDiv.addEventListener('mousedown', initResize)
})
</script>
<template>
  <div
    class="control-target max-w-[800px] min-w-[200px] min-h-[50px] select-none bg-gradient-to-r border-blue-400 border-2 border-solid from-red-500 to-sky-500 h-[200px] relative grid place-content-center"
    id="resizable-div"
  >
    <span class="placeholder">目标节点</span>
    <div class="drag-el absolute right-[-5px] bottom-[-5px] w-[10px] h-[10px] bg-yellow-400 cursor-nwse-resize"></div>
  </div>
</template>
<style lang="scss" scoped></style>
