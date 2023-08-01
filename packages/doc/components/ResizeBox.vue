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
    class="control-target relative grid h-[200px] min-h-[50px] min-w-[200px] max-w-[800px] select-none place-content-center border-2 border-solid border-blue-400 bg-gradient-to-r from-red-500 to-sky-500"
    id="resizable-div"
  >
    <span class="placeholder">目标节点</span>
    <div class="drag-el absolute bottom-[-8px] right-[-8px] grid h-[16px] w-[16px] cursor-nwse-resize place-content-center bg-blue-500 text-lg font-bold">
      ⤡
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
