import * as rollup from 'rollup'
import chokidar from 'chokidar'
// 引入 rollup 配置文件
import rollupConfig from './rollup.config.js'

async function build() {
  try {
    const bundle = await rollup.rollup(rollupConfig)
    // bundle.write() 目前不支持数组，所以需要遍历写入
    // await bundle.write(rollupConfig.output)
    const outputOptions = rollupConfig.output
    await Promise.all(outputOptions.map((options) => bundle.write(options))).then(() => {
      const outputFiles = outputOptions.map((options) => options.file)
      console.log('🥳已生成文件:', outputFiles.join(', '))
    })
  } catch (error) {
    console.error(error)
  }
}
build()

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
