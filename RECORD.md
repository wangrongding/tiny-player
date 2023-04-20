# 从零到一，写一个 Web 视频播放器

## 项目背景

首先 DPlayer 的功能很强大，但是它的体积也很大，如果只是想要一个简单的视频播放器，那么 DPlayer 就有点大材小用了。

为了更好的贴合当前的需求场景，我们自己打算重构视频播放器，这里有两个途径：

1. 从零开始写一个全新的播放器 (需满足：轻量化，支持 mp4 等格式以及 m3u8，可以自定义播放器的 UI 结构，符合当前业务逻辑)
2. 删除/改写当前的 DPlayer 逻辑 （需满足：解耦该库中的耦合逻辑，筛选出必要的代码）

### 需要满足的点：

实现一个简单的 Web 视频播放器。

- 视频播放器界面设计和布局；
- 视频加载和播放控制逻辑；
- 对不同浏览器和设备的兼容性处理；
- 代码的组织和打包。

## 准备工作

安装相关依赖：

```sh
npm install typescript rollup rollup-plugin-typescript2 -D
```

创建一个 tsconfig.json 文件，配置 TypeScript 编译选项：

```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "es6",
    "esModuleInterop": true,
    "strict": true,
    "sourceMap": true,
    "outDir": "dist"
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 编写代码

创建一个 src/index.ts 文件，实现视频播放器的逻辑：

```typescript
class TinyPlayer {
  private readonly videoElement: HTMLVideoElement

  constructor(videoElementId: string) {
    this.videoElement = document.getElementById(videoElementId) as HTMLVideoElement
    this.init()
  }

  private init() {
    // 初始化视频播放器
    this.videoElement.controls = false
    this.videoElement.addEventListener('loadedmetadata', this.onLoadedMetadata)
    this.videoElement.addEventListener('play', this.onPlay)
    this.videoElement.addEventListener('pause', this.onPause)
  }

  private onLoadedMetadata = () => {
    // 当视频元数据加载完成时，设置视频播放器控制条
    const controls = document.createElement('div')
    controls.className = 'controls'
    controls.innerHTML = `
      <button class="play-pause">Play</button>
      <input type="range" class="seek-bar" value="0">
      <button class="mute">Mute</button>
      <input type="range" class="volume-bar" min="0" max="1" step="0.1" value="${this.videoElement.volume}">
      <button class="full-screen">Full Screen</button>
    `
    this.videoElement.parentNode.insertBefore(controls, this.videoElement.nextSibling)

    // 设置控制条按钮的事件处理函数
    const playPauseButton = controls.querySelector('.play-pause') as HTMLButtonElement
    playPauseButton.addEventListener('click', this.playPause)

    const muteButton = controls.querySelector('.mute') as HTMLButtonElement
    muteButton.addEventListener('click', this.mute)

    const fullScreenButton = controls.querySelector('.full-screen') as HTMLButtonElement
    fullScreenButton.addEventListener('click', this.fullScreen)

    // 设置控制条滑块的事件处理函数
    const seekBar = controls.querySelector('.seek-bar') as HTMLInputElement
    seekBar.addEventListener('input', this.seek)

    const volumeBar = controls.querySelector('.volume-bar') as HTMLInputElement
    volumeBar.addEventListener('input', this.setVolume)
  }

  private onPlay = () => {
    // 当视频开始播放时，更新播放器状态
    const playPauseButton = document.querySelector('.play-pause') as HTMLButtonElement
    playPauseButton.textContent = 'Pause'
  }
  private onPause = () => {
    // 当视频暂停播放时，更新播放器状态
    const playPauseButton = document.querySelector('.play-pause') as HTMLButtonElement
    playPauseButton.textContent = 'Play'
  }

  private playPause = () => {
    // 播放或暂停视频
    if (this.videoElement.paused) {
      this.videoElement.play()
    } else {
      this.videoElement.pause()
    }
  }

  private mute = () => {
    // 静音或取消静音
    this.videoElement.muted = !this.videoElement.muted
    const muteButton = document.querySelector('.mute') as HTMLButtonElement
    muteButton.textContent = this.videoElement.muted ? 'Unmute' : 'Mute'
  }

  private fullScreen = () => {
    // 进入或退出全屏模式
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      this.videoElement.requestFullscreen()
    }
  }

  private seek = () => {
    // 调整视频播放进度
    const seekBar = document.querySelector('.seek-bar') as HTMLInputElement
    this.videoElement.currentTime = Number(seekBar.value) * this.videoElement.duration
  }

  private setVolume = () => {
    // 调整视频音量
    const volumeBar = document.querySelector('.volume-bar') as HTMLInputElement
    this.videoElement.volume = Number(volumeBar.value)
  }
}
```

使用：

```typescript
new TinyPlayer('my-video')
```

## 打包代码

创建一个 `rollup.config.js` 文件，配置 Rollup 打包选项：

```javascript
import typescript from 'rollup-plugin-typescript2'

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'iife',
    name: 'TinyPlayer',
  },
  plugins: [typescript()],
}
```

```sh
npx rollup -c
```

示例：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Video Player</title>
    <style>
      .controls {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 50px;
        background-color: rgba(0, 0, 0, 0.5);
        padding: 5px;
        box-sizing: border-box;
        position: absolute;
        bottom: 0;
        left: 0;
      }
      .controls button,
      .controls input[type='range'] {
        margin-right: 5px;
        margin-left: 5px;
      }
      .controls button:focus,
      .controls input[type='range']:focus {
        outline: none;
      }
      .controls button:active,
      .controls input[type='range']:active {
        box-shadow: none;
      }
    </style>
  </head>
  <body>
    <video id="my-video" src="my-video.mp4"></video>
    <script src="dist/index.js"></script>
  </body>
</html>
```
