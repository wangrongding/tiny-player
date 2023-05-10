import playerTemplate from '../template/player.ejs'
import pkg from '../../package.json'
import Icons from './icons'
import Controller from './controller'
import Events from './events'
import { EventsList } from './events'

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

  // 初始化播放器,设置视频相关回调函数
  private initVideo() {
    // 播放回调
    this.on('play', () => {
      this.paused && this.onPlay()
    })
    // 暂停播放
    this.on('pause', () => {
      !this.paused && this.onPause()
    })
    // 更新播放时间
    this.on('timeupdate', this.controller.onTimeupdate)
    this.on('loadedmetadata', this.onLoadedMetadata)

    // video end
    this.on('ended', () => {
      if (!this.options.loop) {
        // this.seek(0)
        this.pause()
        // this.bezel.switch(Icons.play)
      } else {
        // this.seek(0)
        this.play()
      }
    })

    // for (let i = 0; i < this.events.videoEvents.length; i++) {
    //   this.video.addEventListener(this.events.videoEvents[i], () => {
    //     this.events.trigger(this.events.videoEvents[i])
    //   })
    // }
  }

  // 当视频元数据加载完成时，设置视频播放器控制条
  private onLoadedMetadata = () => {
    // this.controller.hide()
  }

  // 当视频开始播放时，
  private onPlay = () => {
    console.log('🚀🚀🚀 / onPlay')
    this.paused = false
    const playButton = this.controller.controls.playButton
    // 更新播放器状态
    playButton && (playButton.innerHTML = Icons.pause)
    this.controller.updateSeekBar()
  }

  // 当视频暂停播放时
  private onPause = () => {
    console.log('🚀🚀🚀 / onPause')
    this.paused = true
    const playButton = this.controller.controls.playButton
    // 更新播放器状态
    playButton && (playButton.innerHTML = Icons.play)
    cancelAnimationFrame(this.controller.playRaf)
  }

  // 注册事件
  on(name: EventsList, callback: Function) {
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

  // 调整视频播放进度
  seek = () => {
    // 调整视频播放进度
    this.video!.currentTime = (Number(this.controller.controls.seekBar!.value) / 100) * this.video!.duration
    // this.video!.play()
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
    this.controller.controls.muteButton!.querySelector('svg')?.setAttribute('fill', 'white')
  }

  // TODO
  // initFullButton() {
  //   this.player.template.browserFullButton.addEventListener('click', () => {
  //     this.player.fullScreen.toggle('browser')
  //   })
  //   this.player.template.webFullButton.addEventListener('click', () => {
  //     this.player.fullScreen.toggle('web')
  //   })
  // }
  // TODO: 全屏
  fullScreen = () => {
    // 进入或退出全屏模式
    // if (document.fullscreenElement) {
    //   document.exitFullscreen()
    // } else {
    //   this.player.videoContainer!.requestFullscreen()
    // }
  }
}
