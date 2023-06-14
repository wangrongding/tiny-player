import controlTemplate from '@/assets/template/control.ejs'
import { isMobile, throttle, secondToTime, formatTime } from '@/utils/index'
import Icons from '@/assets/icons/index'
import { ControlOptions } from '../types/index'
import type TinyPlayer from '../index'

export default class Controller {
  player: TinyPlayer // 播放器实例

  autoHideTimer?: number // 自动隐藏计时器
  disableAutoHide: boolean = false // 禁用自动隐藏

  playButton!: HTMLElement // 播放按钮
  seekBar!: HTMLInputElement // 进度条
  bottomControlBar!: HTMLElement // 底部控制栏

  playTime?: HTMLElement // 播放时间
  volumeSlider?: HTMLInputElement // 是否显示音量控制栏
  volumeControlBar?: HTMLInputElement // 声音控制栏
  muteButton?: HTMLElement // 静音按钮
  fullScreenButton?: HTMLElement // 全屏按钮
  loading?: HTMLElement // 加载动画

  controlElement!: HTMLElement // 控制器节点
  mountTarget!: HTMLElement // 控制器挂载目标
  playRaf = 0 // 播放 requestAnimationFrame Id

  controlOptions: ControlOptions
  constructor(player: TinyPlayer) {
    this.player = player
    this.controlOptions = player.options.controlOptions || {}
    this.mountTarget = this.controlOptions.mountTarget || this.player.videoContainer

    this.initControls()
    this.initControlsEvent()
  }

  // 初始化播放器控制条
  private initControls = () => {
    // 控制面板节点
    this.controlElement = document.createElement('div')
    this.controlElement.className = 'tp-control-panel'
    this.controlElement.innerHTML = controlTemplate({ ...(this.player.options.controlOptions || {}), volume: this.player.options.volume })
    // 将控制面板添加到目标容器中
    !this.controlOptions.manualMount && !this.controlOptions.nativeControls && this.mountTarget.appendChild(this.controlElement)
    // loading 动画
    this.loading = this.controlElement.querySelector('.tp-loading') as HTMLElement
    this.loading.innerHTML = Icons.loading
    this.loading!.style.opacity = '0'
    this.bottomControlBar = this.controlElement.querySelector('.tp-control-bar') as HTMLElement
    this.bottomControlBar.addEventListener('mousedown', (event) => event.stopPropagation())

    this.initPlayButton()
    this.initSeekBar()
    this.initVolumeButton()
    this.initFullScreenButton()

    // 其他
    // if (!this.player.options.controlOptions) {}
  }

  // 初始化播放按钮
  private initPlayButton = () => {
    // 设置控制条按钮的事件处理函数
    this.playButton = this.controlElement.querySelector('.tp-play-icon') as HTMLElement
    this.playButton.innerHTML = Icons.play
    this.playButton.addEventListener('click', this.player.togglePlay)
  }

  // 初始化播放进度条
  private initSeekBar = () => {
    // 设置控制条滑块的事件处理函数
    this.seekBar = this.controlElement.querySelector('.tp-seek-slider') as HTMLInputElement
    let playStatus = false
    // 记录当前播放状态，并暂停播放
    const pausePlay = (event: Event) => {
      event.stopPropagation()
      // 记录当前播放状态
      playStatus = !this.player.video.paused
      // 先暂停播放
      this.player.pause()
    }
    // 恢复播放状态
    const resumePlay = (event: Event) => {
      event.stopPropagation()
      // 恢复播放状态
      playStatus && this.player.play()
    }
    this.seekBar.addEventListener('mousedown', pausePlay)
    this.seekBar.addEventListener('mouseup', resumePlay)
    this.seekBar.addEventListener('touchstart', pausePlay)
    this.seekBar.addEventListener('touchend', resumePlay)
    this.seekBar.addEventListener('touchmove', (event) => event.stopPropagation())
    this.seekBar.addEventListener('input', this.onSeeking)
    this.playTime = this.controlElement.querySelector('.tp-play-time') as HTMLInputElement
  }

  // 初始化音量控制栏
  private initVolumeButton = () => {
    const volume = this.player.options.volume ? (this.player.options.volume > 1 ? this.player.options.volume / 100 : this.player.options.volume) : 1
    this.player.video.volume = volume
    if (!this.controlOptions.volumeControl) return
    // 设置控制条声音控制栏的事件处理函数
    this.muteButton = this.controlElement.querySelector('.tp-volume-icon') as HTMLButtonElement
    this.muteButton.addEventListener('click', this.player.mute)
    this.switchVolumeIcon()
    this.volumeSlider = this.controlElement.querySelector('.tp-volume-slider') as HTMLInputElement
    this.volumeSlider.addEventListener('input', throttle(this.onVolumeChange, 100))
    this.volumeControlBar = this.controlElement.querySelector('.tp-volume-bar') as HTMLInputElement
  }

  // 初始化全屏按钮
  private initFullScreenButton = () => {
    // 设置控制条全屏按钮的事件处理函数
    this.fullScreenButton = this.controlElement.querySelector('.tp-fullscreen') as HTMLElement
    if (!this.fullScreenButton) return
    this.fullScreenButton.addEventListener('click', this.player.toggleFullScreen)
    this.fullScreenButton.innerHTML = Icons.fullWeb
  }

  // 监听控制栏的尺寸变化, 控制显示隐藏 播放按钮，视频时间和音量控制栏
  private watchControlResize = () => {
    const resizeObserver = new ResizeObserver(
      throttle((entries: ResizeObserverEntry[]) => {
        for (const entry of entries) {
          if (!entry.contentBoxSize) return

          const { inlineSize, blockSize } = entry.contentBoxSize[0]
          // 播放按钮的显示隐藏
          if (blockSize < 40 || inlineSize < 40) {
            this.playButton.style.display = 'none'
          } else {
            this.playButton.style.display = 'grid'
          }
          // 控制栏的显示隐藏
          if (blockSize < 75 || inlineSize < 60) {
            this.bottomControlBar.style.display = 'none'
          } else {
            this.bottomControlBar.style.display = 'flex'
          }
          // 播放按钮的缩放
          if (blockSize < 100 || inlineSize < 100) {
            this.playButton.style.scale = '0.5'
          } else {
            this.playButton.style.scale = '1'
          }
          // 控制全屏按钮的显示隐藏
          if (this.fullScreenButton && inlineSize < 200) {
            this.fullScreenButton.style.display = 'none'
          } else {
            this.fullScreenButton && (this.fullScreenButton.style.display = 'block')
          }
          // 控制播放时间显示隐藏
          if (this.playTime && inlineSize < 330) {
            this.playTime.style.display = 'none'
          } else {
            this.playTime && (this.playTime.style.display = 'block')
          }
          // 控制音量控制栏的显示隐藏
          if (this.volumeControlBar && inlineSize < 400) {
            this.volumeControlBar.style.display = 'none'
          } else {
            this.volumeControlBar && (this.volumeControlBar.style.display = 'flex')
          }
        }
      }, 30),
    )

    resizeObserver.observe(this.controlElement)
  }

  // 初始化控制栏相关事件
  private initControlsEvent = () => {
    if (isMobile) {
      // do something
    } else {
    }
    // 由于暂时缺少数据，播放已停止。
    this.player.on('waiting', this.onWaiting)
    // 更新播放时间
    this.player.on('timeupdate', this.onTimeupdate)
    // 由于缺乏数据而暂停或延迟后，播放准备开始。
    this.player.on('playing', this.onPlaying)
    this.player.on('canplay', () => this.toggleLoading(false))
    this.player.on('seeked', () => this.onSeeked)
    this.player.on('loadedmetadata', this.initTimeTip)
    // 播放，暂停后自动隐藏控制栏
    this.player.on('pause', this.setAutoHide)
    this.player.on('play', this.setAutoHide)
    this.initMountTargetEvent()
    // 监听控制栏的尺寸变化
    this.watchControlResize()
  }

  // 初始化时间 tip 逻辑
  initTimeTip = () => {
    const tooltip = this.controlElement.querySelector('.tp-play-time-tip') as HTMLElement
    const duration = this.player.duration
    let hasMoved = false
    let outOfBounds = false
    this.seekBar.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement
      tooltip.textContent = formatTime((+target.value / 100) * duration)
      if (isMobile && hasMoved && !outOfBounds) tooltip.style.display = 'block'
    })

    // 显示 tip
    const showTip = (event: MouseEvent | TouchEvent) => {
      const seekBarWidth = this.seekBar.getBoundingClientRect().width
      let positionX = 0
      if (event instanceof MouseEvent) {
        tooltip.style.display = 'block'
        positionX = event.offsetX
        const timeStamp = (positionX / seekBarWidth) * duration
        tooltip.textContent = formatTime(timeStamp)
      }
      if (event instanceof TouchEvent) {
        const touch = event.touches[0]
        const target = event.target as HTMLElement
        let rect = target.getBoundingClientRect()
        positionX = touch.clientX - rect.left
        hasMoved = true
      }
      if (positionX < 0 || positionX > seekBarWidth) {
        tooltip.style.display = 'none'
        outOfBounds = true
      }
      outOfBounds = false
      tooltip.style.left = positionX - tooltip.clientWidth / 2 + 10 + 'px'
    }

    this.seekBar.addEventListener('touchmove', showTip)
    this.seekBar.addEventListener('mousemove', showTip)
    // 隐藏 tip
    const hideTip = () => {
      setTimeout(() => {
        tooltip.style.display = 'none'
        hasMoved = false
      }, 100)
    }
    this.seekBar.addEventListener('mouseleave', hideTip)
    this.seekBar.addEventListener('touchend', hideTip)
  }

  // 初始化控制栏容器相关事件
  initMountTargetEvent = () => {
    if (isMobile) this.mountTarget.addEventListener('touchstart', this.setAutoHide)
    this.mountTarget.addEventListener('click', this.setAutoHide)
    this.mountTarget.addEventListener('mousemove', this.setAutoHide)
  }

  // 移除控制栏容器相关事件
  removeMountTargetEvent = () => {
    // this.mountTarget?.removeEventListener('mousemove', this.setAutoHide)
    // this.mountTarget?.removeEventListener('mouseleave', this.hide)
  }

  // 设置控制栏的自动隐藏
  setAutoHide = () => {
    this.show()
    clearTimeout(this.autoHideTimer)
    this.autoHideTimer = setTimeout(() => {
      !this.player.paused && this.hide()
    }, 2 * 1000)
  }

  // 显示控制栏
  show = () => {
    this.mountTarget.classList.remove('tp-hide-controller')
  }

  // 隐藏控制栏
  hide = () => {
    this.mountTarget.classList.add('tp-hide-controller')
  }

  // 设置控制条是否显示
  setVisible(val: boolean) {
    val ? this.show() : this.hide()
  }

  // 切换控制条显示隐藏
  toggle = () => {
    if (!this.mountTarget.classList.contains('tp-hide-controller')) {
      this.hide()
    } else {
      this.show()
    }
  }

  // 更新播放进度条
  updateSeekBar = (once?: boolean) => {
    this.seekBar.value = (((this.player.video.currentTime - this.player.clipStart) / this.player.duration) * 100).toString()
    if (once) return
    this.playRaf = window.requestAnimationFrame(() => this.updateSeekBar())
  }

  // 拖动进度条
  onSeeking = (event: Event) => {
    event.preventDefault()
    event.stopPropagation()
    const target = event.target as HTMLInputElement
    const seekTime = Number((parseFloat(target.value) / 100) * this.player.duration) + Number(this.player.clipStart)
    this.player.seek(seekTime)
  }

  // 快进结束
  onSeeked = () => {
    // 取消动画
    this.playRaf && cancelAnimationFrame(this.playRaf)
    this.updateSeekBar(true)
  }

  // 更新播放时间
  onTimeupdate = () => {
    if (!this.playTime && !this.controlOptions.manualMount) return
    const progress = +this.seekBar.value
    const currentTime = progress * this.player.duration * 0.01
    this.playTime && (this.playTime.textContent = `${secondToTime(currentTime < 0 ? 0 : currentTime)} / ${secondToTime(this.player.duration)}`)
    const videoCurrentTime = this.player.video.currentTime
    // 当前播放时间大于结束时间时，暂停播放 / 循环播放
    if (!this.player.handleVideoEndByOuter && this.player.clipEnd && videoCurrentTime >= this.player.clipEnd - 0.1) {
      this.player.pause()
      this.player.seek(Number(this.player.clipStart))
      this.updateSeekBar(true)
      if (this.player.options.loop) this.player.play()
    }
  }

  // 调整视频音量
  onVolumeChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    // 调整视频音量
    this.player.volume(Number(target.value))
  }

  // waiting 事件处理函数
  onWaiting = () => {
    if (!this.player.paused) this.player.paused = true
    this.toggleLoading(true)
  }

  // playing 事件处理函数
  onPlaying = () => {
    if (this.player.paused) this.player.paused = false
    this.toggleLoading(false)
  }

  // 控制 loading 动画的显示与隐藏
  toggleLoading(show: boolean) {
    if (show) {
      this.loading!.style.opacity = '1'
      this.playButton!.style.opacity = '0'
    } else {
      this.loading!.style.opacity = '0'
      this.playButton!.style.opacity = '1'
    }
  }

  // 切换音量图标
  switchVolumeIcon = () => {
    if (!this.controlOptions.volumeControl) return
    if (this.player.video.muted || this.player.video.volume === 0) {
      this.muteButton!.innerHTML = Icons.volumeOff
    } else if (this.player.video.volume > 0 && this.player.video.volume < 1) {
      this.muteButton!.innerHTML = Icons.volumeDown
    } else {
      this.muteButton!.innerHTML = Icons.volumeUp
    }
  }

  // 销毁事件
  destroy = () => {
    clearTimeout(this.autoHideTimer)
  }
}
