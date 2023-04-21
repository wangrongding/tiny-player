import tpl from '../layout/template.ejs'
import '../style/tiny-player.scss'
import { name, version } from '../../package.json'

export default class TinyPlayer {
  static title: string = name
  static version: string = version
  private readonly videoContainer: HTMLElement

  constructor(options: PlayerOptions) {
    this.videoContainer = document.getElementById(options.container)!
    console.log('🚀🚀🚀 / this.videoContainer:', this.videoContainer)
    this.init(options)
  }

  private init(options: PlayerOptions) {
    // 初始化视频播放器
    const domNode = document.createElement('div')
    domNode.innerHTML = tpl(options)
    this.videoContainer.appendChild(domNode)
    // this.videoElement.controls = false;
    // this.videoElement.addEventListener('loadedmetadata', this.onLoadedMetadata)
    // this.videoElement.addEventListener('play', this.onPlay)
    // this.videoElement.addEventListener('pause', this.onPause)
  }

  // private onLoadedMetadata = () => {
  //   // 当视频元数据加载完成时，设置视频播放器控制条
  //   const controls = document.createElement('div')
  //   controls.className = 'controls'
  //   controls.innerHTML = `
  //     <button class="play-pause">Play</button>
  //     <input type="range" class="seek-bar" value="0">
  //     <button class="mute">Mute</button>
  //     <input type="range" class="volume-bar" min="0" max="1" step="0.1" value="${this.videoElement.volume}">
  //     <button class="full-screen">Full Screen</button>
  //   `
  //   this.videoElement.parentNode!.insertBefore(controls, this.videoElement.nextSibling)
  //   console.log(this.videoElement.parentNode)

  //   // 设置控制条按钮的事件处理函数
  //   const playPauseButton = controls.querySelector('.play-pause') as HTMLButtonElement
  //   playPauseButton.addEventListener('click', this.playPause)

  //   const muteButton = controls.querySelector('.mute') as HTMLButtonElement
  //   muteButton.addEventListener('click', this.mute)

  //   const fullScreenButton = controls.querySelector('.full-screen') as HTMLButtonElement
  //   fullScreenButton.addEventListener('click', this.fullScreen)

  //   // 设置控制条滑块的事件处理函数
  //   const seekBar = controls.querySelector('.seek-bar') as HTMLInputElement
  //   seekBar.addEventListener('input', this.seek)

  //   const volumeBar = controls.querySelector('.volume-bar') as HTMLInputElement
  //   volumeBar.addEventListener('input', this.setVolume)
  // }

  // private onPlay = () => {
  //   // 当视频开始播放时，更新播放器状态
  //   const playPauseButton = document.querySelector('.play-pause') as HTMLButtonElement
  //   playPauseButton.textContent = 'Pause'
  // }

  // private onPause = () => {
  //   // 当视频暂停播放时，更新播放器状态
  //   const playPauseButton = document.querySelector('.play-pause') as HTMLButtonElement
  //   playPauseButton.textContent = 'Play'
  // }

  // private playPause = () => {
  //   // 播放或暂停视频
  //   if (this.videoElement.paused) {
  //     this.videoElement.play()
  //   } else {
  //     this.videoElement.pause()
  //   }
  // }

  // private mute = () => {
  //   // 静音或取消静音
  //   this.videoElement.muted = !this.videoElement.muted
  //   const muteButton = document.querySelector('.mute') as HTMLButtonElement
  //   muteButton.textContent = this.videoElement.muted ? 'Unmute' : 'Mute'
  // }

  // private fullScreen = () => {
  //   // 进入或退出全屏模式
  //   if (document.fullscreenElement) {
  //     document.exitFullscreen()
  //   } else {
  //     this.videoElement.requestFullscreen()
  //   }
  // }

  // private seek = () => {
  //   // 调整视频播放进度
  //   const seekBar = document.querySelector('.seek-bar') as HTMLInputElement
  //   this.videoElement.currentTime = Number(seekBar.value) * this.videoElement.duration
  // }

  // private setVolume = () => {
  //   // 调整视频音量
  //   const volumeBar = document.querySelector('.volume-bar') as HTMLInputElement
  //   this.videoElement.volume = Number(volumeBar.value)
  // }
}
