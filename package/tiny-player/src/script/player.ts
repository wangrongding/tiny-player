import tpl from '../layout/template.ejs'
import '../style/tiny-player.scss'
import { name, version } from '../../package.json'
import Icons from './icons'

export default class TinyPlayer {
  static title: string = name
  static version: string = version
  // 视频容器
  videoContainer: HTMLElement | undefined
  // 视频播放器
  video: HTMLVideoElement | undefined
  // 播放按钮
  playButton: HTMLElement | undefined
  // seek bar
  seekBar: HTMLInputElement | undefined
  // volume bar
  volumeBar: HTMLInputElement | undefined
  // 静音按钮
  muteButton: HTMLElement | undefined
  // 全屏按钮
  fullScreenButton: HTMLElement | undefined

  constructor(options: PlayerOptions) {
    this.setup(options)
  }

  private setup(options: PlayerOptions) {
    this.videoContainer = options.container
    // 初始化视频播放器
    const domNode = document.createElement('div')
    domNode.innerHTML = tpl(options)
    this.videoContainer.appendChild(domNode)

    // 设置视频相关回调函数
    this.video = this.videoContainer.querySelector('video') as HTMLVideoElement
    this.video.addEventListener('loadedmetadata', this.onLoadedMetadata)
    this.video.addEventListener('play', this.onPlay)
    this.video.addEventListener('pause', this.onPause)

    // 设置控制条按钮的事件处理函数
    this.playButton = this.videoContainer.querySelector('.tiny-player-play-icon') as HTMLElement
    this.playButton.style.backgroundImage = `url(${Icons.play})`
    this.playButton.addEventListener('click', this.togglePlay)

    // 设置控制条滑块的事件处理函数
    const seekBar = this.videoContainer.querySelector('.tiny-player-seek-bar') as HTMLInputElement
    seekBar.addEventListener('input', this.seek)

    this.volumeBar = this.videoContainer.querySelector('.tiny-player-volume-bar') as HTMLInputElement
    this.volumeBar.addEventListener('input', this.setVolume)

    // const muteButton = this.videoContainer.querySelector('.mute') as HTMLButtonElement
    // muteButton.addEventListener('click', this.mute)

    // const fullScreenButton = this.videoContainer.querySelector('.full-screen') as HTMLButtonElement
    // fullScreenButton.addEventListener('click', this.fullScreen)
  }

  // 当视频元数据加载完成时，设置视频播放器控制条
  private onLoadedMetadata = () => {}

  // 当视频开始播放时，
  private onPlay = () => {
    // 更新播放器状态
    this.playButton && (this.playButton.style.backgroundImage = `url(${Icons.pause})`)
    console.log('🚀🚀🚀 / Icons.play:', Icons.play)
  }

  // 当视频暂停播放时
  private onPause = () => {
    this.playButton && (this.playButton.style.backgroundImage = `url(${Icons.play})`)
    // 更新播放器状态
  }

  // 播放或暂停视频
  private togglePlay = () => {
    if (this.video!.paused) {
      this.video!.play()
    } else {
      this.video!.pause()
    }
  }

  private mute = () => {
    // 静音或取消静音
    // this.video.muted = !this.video.muted
    // const muteButton = document.querySelector('.mute') as HTMLButtonElement
    // muteButton.textContent = this.video.muted ? 'Unmute' : 'Mute'
  }

  private fullScreen = () => {
    // 进入或退出全屏模式
    // if (document.fullscreenElement) {
    //   document.exitFullscreen()
    // } else {
    //   this.video.requestFullscreen()
    // }
  }

  private seek = () => {
    // 调整视频播放进度
    // const seekBar = document.querySelector('.seek-bar') as HTMLInputElement
    // this.video.currentTime = Number(seekBar.value) * this.video.duration
  }

  private setVolume = () => {
    // 调整视频音量
    // const volumeBar = document.querySelector('.volume-bar') as HTMLInputElement
    // this.video.volume = Number(volumeBar.value)
  }
}
