import playerTemplate from '@/assets/template/player.ejs'
import pkg from '../package.json'
import './style/index.scss'
import Icons from '@/assets/icons/index'
import Controller from './components/controller'
import Events from './components/events'
import { EventsList } from './components/events'
import Hls from 'hls.js'

// 播放器配置
export interface PlayerOptions {
  container: HTMLElement // 播放器容器
  src: string // 视频地址
  width?: string // 播放器宽度 "123px"
  height?: string // 播放器高度 "123px"
  controls?: boolean // 是否显示控制条
  poster?: string // 视频封面
  loop?: boolean // 是否循环播放
  autoplay?: boolean // 是否自动播放
  preload: 'auto' | 'metadata' | 'none' // 预加载
  muted?: boolean // 是否静音
  volume?: number // 音量
  playbackRate?: number // 播放速率
  type: 'auto' | 'normal' | 'hls' // 视频类型
}

// 使用 hls 播放视频
const useHls = (video: any) => {
  const hls = new Hls()
  hls.loadSource(video.src)
  hls.attachMedia(video)
}

// 播放器名称和版本号
const { name, version } = pkg

// 控制台 banner
console.log(
  `${'\n'} %c ${name} v${version} ${'\n'}`,
  `color: white; font-size: 18px; background: linear-gradient(45deg, #ff0000 0%, #0092ff 80%);`,
)

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
    this.events = new Events(this)
    // 播放器控制器
    this.controller = new Controller(this)
    // 初始化视频
    this.initVideo()
  }

  initMSE(video: any, type: PlayerOptions['type']) {
    // this.options.type = type
    console.log('🚀🚀🚀 / type:', video, type)
    if (type === 'hls') {
      return useHls(video)
    }
    if (this.options.type === 'auto' && /m3u8(#|\?|$)/i.exec(video.src)) {
      return useHls(video)
    }

    if (
      this.options.type === 'hls' &&
      (video.canPlayType('application/x-mpegURL') || video.canPlayType('application/vnd.apple.mpegURL'))
    ) {
      this.options.type = 'normal'
    }
    this.options.type = 'normal'
  }

  // 初始化播放器,设置视频相关回调函数
  private initVideo() {
    this.initMSE(this.video, this.options.type)

    // 播放回调
    this.on('play', () => {
      this.paused && this.onPlay()
    })
    // 暂停播放
    this.on('pause', () => {
      !this.paused && this.onPause()
    })
    // 播放结束
    this.on('ended', () => {
      if (!this.options.loop) {
        this.seek(0)
        this.pause()
      } else {
        this.seek(0)
        this.play()
      }
    })
  }

  // 当视频开始播放时，
  private onPlay = () => {
    console.log('🚀🚀🚀 / onPlay')
    // 更新播放器状态
    this.paused = false
    const playButton = this.controller.controls.playButton
    playButton && (playButton.innerHTML = Icons.pause)
    this.controller.updateSeekBar()
  }

  // 当视频暂停播放时
  private onPause = () => {
    console.log('🚀🚀🚀 / onPause')
    // 更新播放器状态
    this.paused = true
    const playButton = this.controller.controls.playButton
    playButton && (playButton.innerHTML = Icons.play)
    // 取消动画
    cancelAnimationFrame(this.controller.playRaf)
  }

  // 注册事件
  on(name: EventsList, callback: () => void) {
    this.events.on(name, callback)
  }

  play = () => {
    this.video.play()
  }

  pause = () => {
    this.video.pause()
  }

  // 播放或暂停视频
  togglePlay = () => {
    if (this.video!.paused) {
      this.video!.play()
    } else {
      this.video!.pause()
    }
  }

  // 跳转到视频指定位置，调整视频播放进度
  seek = (time: number) => {
    this.video!.currentTime = time
  }

  // 调整视频音量
  setVolume = () => {
    // 调整视频音量
    this.volume(Number(this.controller.controls.volumeBar!.value))
  }

  // 设置音量
  volume(val: number | string) {
    let percentage = parseFloat((val || 0) as string)
    if (!isNaN(percentage)) {
      percentage = Math.max(percentage, 0)
      percentage = Math.min(percentage, 1)

      this.video.volume = percentage
      if (this.video.muted) {
        this.video.muted = false
      }
      this.controller.switchVolumeIcon()
    }
    return this.video.volume
  }

  // 静音或取消静音
  mute = () => {
    // 静音或取消静音
    this.video!.muted = !this.video!.muted
    this.controller.controls.volumeBar!.value = this.video!.muted ? '0' : this.video!.volume + ''
    this.controller.controls.muteButton!.innerHTML = this.video!.muted ? Icons.volumeOff : Icons.volumeUp
  }

  // 进入或退出全屏模式
  toggleFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      this.videoContainer.requestFullscreen()
    }
  }
}
