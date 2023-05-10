import playerTemplate from '../template/player.ejs'
import pkg from '../../package.json'
import Icons from './icons'
import Controller from './controller'
import Events from './events'
import { EventsList } from './events'

export interface Player {
  playPause(): void
  mute(): void
  seek(): void
  setVolume(): void
  // fullScreen(): void
}

export interface PlayerOptions {
  container: HTMLElement // 播放器容器
  src: string // 视频地址
  poster?: string // 视频封面
  loop?: boolean // 是否循环播放
  autoplay?: boolean // 是否自动播放
  controls?: boolean // 是否显示控制条
  muted?: boolean // 是否静音
  volume?: number // 音量
  playbackRate?: number // 播放速率
  width?: string // 播放器宽度 "123px"
  height?: string // 播放器高度 "123px"
}

const { name, version } = pkg
export default class TinyPlayer {
  static title: string = name // 播放器名称
  static version: string = version // 版本号
  options: PlayerOptions // 播放器配置
  container: HTMLElement // 挂载目标元素
  videoContainer!: HTMLElement // 视频容器
  video!: HTMLVideoElement // 播放器
  controller!: Controller // 控制器
  events!: Events // 事件
  paused: boolean = true // 是否暂停

  playRaf = 0 // 播放 requestAnimationFrame Id

  constructor(options: PlayerOptions) {
    this.container = options.container
    this.options = options
    this.setup()
  }

  private setup() {
    // 初始化视频播放器
    // this.videoContainer = document.createDocumentFragment().appendChild(document.createElement('div'))
    this.videoContainer = document.createElement('div') as HTMLElement
    this.videoContainer.className = 'tiny-player-container'
    // 播放器模板
    this.videoContainer.innerHTML = playerTemplate(this.options)
    // 将 player 添加到指定容器中
    this.container.appendChild(this.videoContainer)
    // 视频节点
    this.video = this.videoContainer.querySelector('video') as HTMLVideoElement
    // 播放器事件系统
    this.events = new Events()
    // 播放器控制器
    this.controller = new Controller(this)
    // 初始化视频
    this.initVideo()
  }

  // 初始化播放器
  private initVideo() {
    // 设置视频相关回调函数
    // this.video.addEventListener('play', this.onPlay)
    // this.video.addEventListener('pause', this.onPause)
    // this.video.addEventListener('loadedmetadata', this.onLoadedMetadata)
    // this.video.addEventListener('timeupdate', this.controller.onTimeupdate)

    // 播放回调
    this.on('play', () => {
      if (this.paused) {
        this.onPlay
      }
    })
    // 暂停播放
    this.on('pause', () => {
      if (!this.paused) {
        this.onPause()
      }
    })
    // 更新播放时间
    this.on('timeupdate', this.controller.onTimeupdate)

    // video end
    this.on('ended', () => {
      // if (!this.options.loop) {
      //   this.seek(0)
      //   this.pause()
      //   this.bezel.switch(Icons.play)
      // } else {
      //   this.seek(0)
      //   this.play()
      // }
      // if (this.danmaku) {
      //   this.danmaku.danIndex = 0
      // }
    })
  }

  // 注册事件
  on(name: EventsList, callback: Function) {
    this.events.on(name, callback)
  }

  // 当视频元数据加载完成时，设置视频播放器控制条
  private onLoadedMetadata = () => {}

  // 当视频开始播放时，
  private onPlay = () => {
    console.log('🚀🚀🚀 / onPlay:')

    this.paused = false
    const playButton = this.controller.controls.playButton
    // 更新播放器状态
    playButton && (playButton.innerHTML = Icons.pause)
    this.controller.updateSeekBar()
  }

  // 当视频暂停播放时
  private onPause = () => {
    console.log('🚀🚀🚀 / onPause:')

    this.paused = true
    const playButton = this.controller.controls.playButton
    // 更新播放器状态
    playButton && (playButton.innerHTML = Icons.play)
    cancelAnimationFrame(this.playRaf)
  }

  // 播放或暂停视频
  private togglePlay = () => {
    if (this.video!.paused) {
      this.video!.play()
    } else {
      this.video!.pause()
    }
  }

  // 调整视频播放进度
  private seek = () => {
    // 调整视频播放进度
    this.video!.currentTime = (Number(this.controller.controls.seekBar!.value) / 100) * this.video!.duration
    this.video!.play()
  }

  // 调整视频音量
  private setVolume = () => {
    // 调整视频音量
    this.video!.volume = Number(this.controller.controls.volumeBar!.value)
  }

  // 静音或取消静音
  private mute = () => {
    // 静音或取消静音
    this.video!.muted = !this.video!.muted
    this.controller.controls.volumeBar!.value = this.video!.muted ? '0' : this.video!.volume + ''
    this.controller.controls.muteButton!.innerHTML = this.video!.muted ? Icons.volumeOff : Icons.volumeUp
    this.controller.controls.muteButton!.querySelector('svg')?.setAttribute('fill', 'white')
  }
}
