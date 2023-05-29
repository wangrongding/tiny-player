import chokidar from 'chokidar'
// 引入 rollup 配置文件
import { spawn } from 'child_process'

function build() {
  try {
    spawn('rollup', ['-c', './rollup.config.js'], {
      cwd: process.cwd(),
      stdio: 'inherit',
    })
  } catch (error) {
    console.error(error)
  }
}

function onFileChange() {
  console.log('🏃🏃🏃🏃🏃🏃🏃文件更改，正在重新构建...')
  build()
}

// 监听 src中所有文件的变化
const chokidarWatcher = chokidar.watch(['src/**/*'], {
  ignored: /(^|[\/\\])\../, // 忽略点开头的文件
  persistent: true, // 保持监听状态
})

// 当文件变化时，重新构建
chokidarWatcher.on('change', onFileChange)
build()
