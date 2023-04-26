import playerTemplate from '../template/player.ejs'
import controlTemplate from '../template/control.ejs'
import '../style/index.scss'
import { name, version } from '../../package.json'
import Icons from './icons'
import utils from '../utils/index'

export default class TinyPlayer {
  static title: string = name
  static version: string = version
  options: PlayerOptions
  // 挂载目标元素
  targetElement: HTMLElement
  // 视频节点
  videoContainer!: HTMLElement
  // 播放器
  video?: HTMLVideoElement
  // 控制器节点
  controlNode?: HTMLElement
  // 控制器
  controls: {
    // 播放按钮
    playButton?: HTMLElement
    // 进度条
    seekBar?: HTMLInputElement
    // 播放时间
    playTime?: HTMLElement
    // 声音控制栏
    volumeBar?: HTMLInputElement
    // 静音按钮
    muteButton?: HTMLElement
    // 全屏按钮
    fullScreenButton?: HTMLElement
  } = {}
  // 播放 requestAnimationFrame Id
  playRaf = 0

  constructor(options: PlayerOptions) {
    this.targetElement = options.container
    this.options = options
    this.setup()
  }

  private setup() {
    // 初始化视频播放器
    // this.videoContainer = document.createDocumentFragment().appendChild(document.createElement('div'))
    this.videoContainer = document.createElement('div') as HTMLElement
    // 播放器模板
    this.videoContainer.innerHTML = playerTemplate(this.options)
    // 将 player 添加到指定容器中
    this.targetElement.appendChild(this.videoContainer)
    this.initVideo()
    this.initControls()
  }

  // 初始化播放器
  private initVideo() {
    // 设置视频相关回调函数
    this.video = this.videoContainer.querySelector('video') as HTMLVideoElement
    this.video.addEventListener('loadedmetadata', this.onLoadedMetadata)
    this.video.addEventListener('play', this.onPlay)
    this.video.addEventListener('pause', this.onPause)
    this.video.addEventListener('timeupdate', this.onTimeupdate)

    // TODO 测试用
    const eventList = [
      'audioprocess', // 当音频处理程序处理缓冲区时触发。(The input buffer of a ScriptProcessorNode is ready to be processed.)
      'canplay', // 浏览器可以播放媒体文件了，但估计没有足够的数据来支撑播放到结束，不必停下来进一步缓冲内容。
      'canplaythrough', // 浏览器估计它可以在不停止内容缓冲的情况下播放媒体直到结束。
      'complete', // OfflineAudioContext 渲染完成。
      'durationchange', // duration 属性的值改变时触发。
      'emptied', // 媒体内容变为空；例如，当这个 media 已经加载完成（或者部分加载完成），则发送此事件，并调用 load() 方法重新加载它。
      'ended', // 视频停止播放，因为 media 已经到达结束点。
      'loadeddata', // media 中的首帧已经完成加载。
      'loadedmetadata', // 已加载元数据。
      'play', // 播放已开始。
      'pause', // 播放已暂停。
      'progress', // 在浏览器加载资源时周期性触发。
      'ratechange', // currentTime 属性指定的时间发生变化。
      'seeked', // 跳帧（seek）操作完成。
      'seeking', // 跳帧（seek）操作开始。
      'stalled', // 用户代理（user agent）正在尝试获取媒体数据，但数据意外未出现。
      'suspend', // 媒体数据加载已暂停。
      'timeupdate', // currentTime 属性指定的时间发生变化。
      'volumechange', // 音量发生变化。
      'waiting', // 由于暂时缺少数据，播放已停止。
      'error',
      'abort',
    ]
    eventList.forEach((eventName) => {
      this.video!.addEventListener(eventName, (e) => {
        console.log(eventName, e.type)
      })
    })
  }

  // 初始化播放器控制条
  private initControls() {
    this.controlNode = document.createElement('div')
    this.controlNode.innerHTML = controlTemplate(this.options)
    document.querySelector('.tiny-player-container')!.appendChild(this.controlNode)

    // 设置控制条按钮的事件处理函数
    this.controls.playButton = this.videoContainer.querySelector('.tiny-player-play-icon') as HTMLElement
    this.controls.playButton && (this.controls.playButton.innerHTML = Icons.play)
    this.controls.playButton.addEventListener('click', this.togglePlay)

    // 设置控制条滑块的事件处理函数
    this.controls.seekBar = this.videoContainer.querySelector('.tiny-player-seek-bar') as HTMLInputElement
    this.controls.seekBar.addEventListener('input', this.seek)
    this.controls.playTime = this.videoContainer.querySelector('.tiny-player-play-time') as HTMLInputElement

    // 设置控制条声音控制栏的事件处理函数
    this.controls.muteButton = this.videoContainer.querySelector('.tiny-player-volume') as HTMLButtonElement
    this.controls.muteButton.addEventListener('click', this.mute)
    this.controls.muteButton && (this.controls.muteButton.innerHTML = Icons.volumeUp)
    this.controls.volumeBar = this.videoContainer.querySelector('.tiny-player-volume-bar') as HTMLInputElement
    this.controls.volumeBar.addEventListener('input', this.setVolume)

    this.controls.fullScreenButton = this.videoContainer.querySelector('.tiny-player-fullscreen') as HTMLElement
    this.controls.fullScreenButton.addEventListener('click', this.fullScreen)
    this.controls.fullScreenButton && (this.controls.fullScreenButton.innerHTML = Icons.fullWeb)

    if (!this.options.controls) return
  }

  // 当视频元数据加载完成时，设置视频播放器控制条
  private onLoadedMetadata = () => {}

  // 当视频开始播放时，
  private onPlay = () => {
    // 更新播放器状态
    this.controls.playButton && (this.controls.playButton.innerHTML = Icons.pause)
    this.updateSeekBar()
  }

  // 当视频暂停播放时
  private onPause = () => {
    // 更新播放器状态
    this.controls.playButton && (this.controls.playButton.innerHTML = Icons.play)
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

  // 更新播放进度条
  private updateSeekBar = () => {
    this.controls.seekBar!.value = (this.video!.currentTime / this.video!.duration) * 100 + ''
    this.playRaf = window.requestAnimationFrame(() => {
      this.updateSeekBar()
    })
  }

  // 更新播放时间
  private onTimeupdate = () => {
    this.controls.playTime!.textContent = `${utils.secondToTime(this.video!.currentTime)} / ${utils.secondToTime(
      this.video!.duration,
    )}`
  }

  // 调整视频播放进度
  private seek = () => {
    // 调整视频播放进度
    this.video!.currentTime = (Number(this.controls.seekBar!.value) / 100) * this.video!.duration
    this.video!.play()
  }

  // 调整视频音量
  private setVolume = () => {
    // 调整视频音量
    this.video!.volume = Number(this.controls.volumeBar!.value)
  }

  // 静音或取消静音
  private mute = () => {
    // 静音或取消静音
    this.video!.muted = !this.video!.muted
    this.controls.volumeBar!.value = this.video!.muted ? '0' : this.video!.volume + ''
    this.controls.muteButton!.innerHTML = this.video!.muted ? Icons.volumeOff : Icons.volumeUp
    this.controls.muteButton!.querySelector('svg')?.setAttribute('fill', 'white')
  }

  private fullScreen = () => {
    // 进入或退出全屏模式
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      this.videoContainer!.requestFullscreen()
    }
  }
}
