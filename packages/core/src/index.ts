import playerTemplate from '@/assets/template/player.ejs'
import pkg from '../package.json'
import './style/index.scss'
import Icons from '@/assets/icons/index'
import Controller from './components/controller'
import TinyPlayEvents from './components/events'
import { EventsList } from './components/events'
import { PlayerOptions as Options } from './types/index'
import Hls from 'hls.js'

export type PlayerOptions = Options
// 播放器名称和版本号
const { name, version } = pkg

// 控制台 banner
console.log(`${'\n'} %c ${name} v${version} ${'\n'}`, `color: white; font-size: 18px; background: linear-gradient(45deg, #ff0000 0%, #0092ff 80%);`)

const instances: TinyPlayer[] = []

export default class TinyPlayer {
  static title: string = name // 播放器名称
  static version: string = version // 版本号
  options: PlayerOptions // 播放器配置
  container: HTMLElement // 挂载目标元素
  videoContainer!: HTMLElement // 视频容器
  video!: HTMLVideoElement // 播放器
  paused: boolean = true // 是否暂停
  videoType: PlayerOptions['type'] = 'auto' // 视频类型
  hls?: Hls // hls 实例
  controller!: Controller // 控制器
  events!: TinyPlayEvents // 事件
  waterMark?: HTMLElement // 水印节点
  duration: number = 0 // 视频时长

  clipStart: number // 视频片段的开始时间
  clipEnd: number // 视频片段的结束时间
  handleVideoEndByOuter: boolean = false // 是否由外部控制视频结束

  constructor(options: PlayerOptions) {
    this.container = options.container
    this.options = options
    this.clipStart = options.clipStart || 0
    this.clipEnd = options.clipEnd || 0
    this.handleVideoEndByOuter = options.handleVideoEndByOuter || false
    this.setup()
  }

  private setup() {
    // 初始化视频播放器
    // this.videoContainer = document.createDocumentFragment().appendChild(document.createElement('div'))
    this.videoContainer = document.createElement('div') as HTMLElement
    this.videoContainer.className = 'tp-container'
    this.videoContainer.style.width = this.options.width || '100%'
    this.videoContainer.style.height = this.options.height || '100%'
    // 播放器模板
    this.videoContainer.innerHTML = playerTemplate(this.options)
    // 将 player 添加到指定容器中
    this.container.innerHTML = ''
    this.container.appendChild(this.videoContainer)
    // 视频节点
    this.video = this.videoContainer.querySelector('video') as HTMLVideoElement
    // 水印节点
    this.waterMark = this.videoContainer.querySelector('.tp-watermark') as HTMLElement
    // 设置水印图案
    this.waterMark.style.backgroundImage = `url(${this.options.waterMarkUrl})`

    // 播放器事件系统
    this.events = new TinyPlayEvents(this)
    // 初始化视频
    this.initVideo()
    // 播放器控制器
    this.controller = new Controller(this)
    this.handleWaterMarkShow(this.options.waterMarkShow)
    this.seek(this.clipStart)

    // 保存实例
    instances.push(this)
  }

  // 初始化播放器,设置视频相关回调函数
  private initVideo() {
    // 初始化 MSE 支持
    this.initMSE(this.video, this.options.type)

    // 播放回调
    this.on('play', this.onPlay)
    // 暂停播放
    this.on('pause', this.onPause)
    // 播放结束
    this.on('ended', () => {
      if (this.clipEnd) return
      if (!this.options.loop) {
        !this.paused && this.seek(this.clipStart)
        this.pause()
      } else {
        !this.paused && this.seek(this.clipStart)
        this.play()
      }
      this.controller.updateSeekBar(true)
    })
    // 视频元数据加载完成
    this.on('loadedmetadata', this.onLoadedMetadata)
  }

  private onLoadedMetadata = () => {
    // 更新视频时长
    this.duration = this.clipEnd - this.clipStart || this.video.duration
    this.controller.onTimeupdate()
  }

  // 当视频开始播放时，
  private onPlay = () => {
    // 更新播放器状态
    this.paused = false
    const playButton = this.controller.playButton
    playButton && (playButton.innerHTML = Icons.pause)
    this.controller.updateSeekBar()
  }

  // 当视频暂停播放时
  private onPause = () => {
    // 更新播放器状态
    this.paused = true
    const playButton = this.controller.playButton
    playButton && (playButton.innerHTML = Icons.play)
    // 取消动画
    cancelAnimationFrame(this.controller.playRaf)
  }

  // 注册事件
  on(name: EventsList, callback: (...arg: any) => void) {
    this.events.on(name, callback)
  }

  // 注册一次性事件
  once(name: EventsList, callback: (...arg: any) => void) {
    this.events.once(name, callback)
  }

  // 手动触发事件
  emit(name: EventsList, data?: any) {
    this.events.emit(name, data)
  }

  // 移除事件
  off(name: EventsList, callback: (...arg: any) => void) {
    this.events.off(name, callback)
  }

  // MSE 支持
  initMSE(video: any, type: PlayerOptions['type']) {
    this.videoType = type
    if (type === 'hls') {
      this.videoType = 'hls'
      // 如果浏览器支持播放 HLS 视频流。
      if (video.canPlayType('application/x-mpegURL') || video.canPlayType('application/vnd.apple.mpegURL')) this.videoType = 'normal'
      // 错误传参时，纠正播放类型
      if (/.mp4(#|\?|$)/i.exec(video.src)) this.videoType = 'normal'
    }
    if (type === 'auto') {
      if (/m3u8(#|\?|$)/i.exec(video.src)) this.videoType = 'hls'
      if (/.flv(#|\?|$)/i.exec(video.src)) this.videoType = 'flv'
      if (/.mpd(#|\?|$)/i.exec(video.src)) this.videoType = 'dash'
      this.videoType = 'normal'
    }
    switch (this.videoType) {
      case 'flv':
        console.error('暂不支持 flv 格式视频')
        break
      case 'dash':
        console.error('暂不支持 dash 格式视频')
        break
      case 'hls':
        this.useHls(video)
        break
    }
    console.log(`🚀🚀🚀 MSE: 预设播放模式：${type},实际播放模式：${this.videoType}, 视频链接：${video.src}`)
  }

  // 使用 hls 播放视频
  useHls = (video: any) => {
    this.hls = new Hls()
    this.hls.loadSource(video.src)
    this.hls.attachMedia(video)

    // TODO 走外部依赖的形式
    // if (!window.Hls) return console.error("Error: Can't find Hls.")
    // if (window.Hls.isSupported()) return console.error('Hls is not supported')
    // const hls = new window.Hls()
    // hls.loadSource(video.src)
    // hls.attachMedia(video)
  }

  // 销毁 hls 实例
  destroyHls = () => {
    this.hls && this.hls.destroy()
  }

  // 播放视频
  play = async () => {
    await this.video.play()
  }

  // 暂停视频
  pause = async () => {
    await this.video.pause()
  }

  // 切换播放状态
  togglePlay = async (event?: Event) => {
    if (this.video!.paused) {
      await this.play()
    } else {
      await this.pause()
    }
    // event.preventDefault()
    // event.stopPropagation()
  }

  // 跳转到视频指定位置，调整视频播放进度
  seek = (time: number) => {
    this.video.currentTime = Number(time)
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
    this.controller.volumeSlider!.value = this.video!.muted ? '0' : this.video!.volume + ''
    this.controller.muteButton!.innerHTML = this.video!.muted ? Icons.volumeOff : Icons.volumeUp
  }

  // 进入或退出全屏模式
  toggleFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      this.videoContainer.requestFullscreen()
    }
  }

  // 控制水印的显示与隐藏
  handleWaterMarkShow = (show: boolean | undefined) => {
    if (this.waterMark) this.waterMark.style.display = show ? 'block' : 'none'
  }

  // 挂载控制器到目标节点
  mountController = (mountTarget: HTMLElement) => {
    if (this.options.controlOptions.nativeControls) return
    this.controller.removeMountTargetEvent()
    this.controller.mountTarget = mountTarget
    this.controller.initMountTargetEvent()
    mountTarget.appendChild(this.controller.controlElement)
  }

  // 选取视频片段
  cutVideo = (start: number, end: number) => {
    this.clipStart = start
    this.clipEnd = end
    this.duration = end - start
    this.seek(start)
    this.controller.initTimeTip()
    this.controller.updateSeekBar(true)
  }

  // 销毁播放器
  destroy = () => {
    this.destroyHls()
    instances.splice(instances.indexOf(this), 1)
    this.pause()
    this.video.src = ''
    this.container.innerHTML = ''
    this.controller.destroy()
    // this.timer.destroy()
    // this.events.trigger('destroy')
  }
}
