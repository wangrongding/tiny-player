import controlTemplate from '@/assets/template/control.ejs'
import { isMobile, throttle, secondToTime } from '@/utils/index'
import Icons from '@/assets/icons/index'
import type TinyPlayer from '../index'

// 控制器配置
export interface ControlOptions {
  playTime?: boolean // 是否显示播放时间
  volumeBar?: boolean // 是否显示音量控制栏
  fullScreenButton?: boolean // 是否显示全屏按钮
  mountTarget?: HTMLElement // 控制器挂载目标
  nativeControls?: boolean // 是否使用原生控制条
}

export default class Controller {
  player: TinyPlayer // 播放器实例

  autoHideTimer?: number // 自动隐藏计时器
  disableAutoHide: boolean = false // 禁用自动隐藏

  playButton!: HTMLElement // 播放按钮
  seekBar!: HTMLInputElement // 进度条

  playTime?: HTMLElement // 播放时间
  volumeBar?: HTMLInputElement // 是否显示音量控制栏
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
    this.controlOptions = player.options.controlOptions
    this.mountTarget = this.controlOptions.mountTarget || this.player.videoContainer

    this.initControls()
    this.initControlsEvent()
  }

  // 初始化播放器控制条
  private initControls = () => {
    // 控制面板节点
    this.controlElement = document.createElement('div')
    this.controlElement.className = 'tp-control-panel'
    this.controlElement.innerHTML = controlTemplate(this.player.options)
    // 将控制面板添加到目标容器中
    !this.controlOptions.nativeControls && this.mountTarget.appendChild(this.controlElement)
    // loading 动画
    this.loading = this.controlElement.querySelector('.tp-loading') as HTMLElement
    this.loading.innerHTML = Icons.loading
    this.loading!.style.opacity = '0'

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
    this.playButton && (this.playButton.innerHTML = Icons.play)
    this.playButton.addEventListener('click', this.player.togglePlay)
  }

  // 初始化播放进度条
  private initSeekBar = () => {
    // 设置控制条滑块的事件处理函数
    this.seekBar = this.controlElement.querySelector('.tp-seek-slider') as HTMLInputElement
    this.seekBar.addEventListener('input', this.onSeeking)
    this.playTime = this.controlElement.querySelector('.tp-play-time') as HTMLInputElement
  }

  // 初始化音量控制栏
  private initVolumeButton = () => {
    if (!this.controlOptions.volumeBar) return
    // 设置控制条声音控制栏的事件处理函数
    this.muteButton = this.controlElement.querySelector('.tp-volume-icon') as HTMLButtonElement
    this.muteButton.addEventListener('click', this.player.mute)
    this.muteButton.innerHTML = Icons.volumeUp
    this.volumeBar = this.controlElement.querySelector('.tp-volume-slider') as HTMLInputElement
    this.volumeBar.addEventListener('input', throttle(this.onVolumeChange, 100))
    this.volumeControlBar = this.controlElement.querySelector('.tp-volume-bar') as HTMLInputElement
  }

  // 初始化全屏按钮
  private initFullScreenButton = () => {
    // 设置控制条全屏按钮的事件处理函数
    this.fullScreenButton = this.controlElement.querySelector('.tp-fullscreen') as HTMLElement
    this.fullScreenButton && this.fullScreenButton.addEventListener('click', this.player.toggleFullScreen)
    this.fullScreenButton && (this.fullScreenButton.innerHTML = Icons.fullWeb)
  }

  // 监听控制栏的尺寸变化, 控制显示隐藏 播放按钮，视频时间和音量控制栏
  private watchControlResize = () => {
    const playButton = this.playButton
    const playTime = this.playTime
    const volumeBar = this.volumeBar
    const resizeObserver = new ResizeObserver(
      throttle((entries: ResizeObserverEntry[]) => {
        console.log('Size changed', entries)
        for (const entry of entries) {
          if (!entry.contentBoxSize) return

          const { inlineSize, blockSize } = entry.contentBoxSize[0]
          // 控制播放按钮的显示隐藏
          if (blockSize < 120) {
            playButton.style.display = 'none'
          } else {
            playButton.style.display = 'grid'
          }
          // 控制全屏按钮的显示隐藏
          if (this.fullScreenButton && inlineSize < 200) {
            this.fullScreenButton.style.display = 'none'
          } else {
            this.fullScreenButton && (this.fullScreenButton.style.display = 'block')
          }
          // 控制播放时间显示隐藏
          if (playTime && inlineSize < 330) {
            playTime.style.display = 'none'
          } else {
            playTime && (playTime.style.display = 'block')
          }
          // 控制音量控制栏的显示隐藏
          if (this.volumeControlBar && inlineSize < 400) {
            this.volumeControlBar.style.display = 'none'
          } else {
            this.volumeControlBar && (this.volumeControlBar.style.display = 'flex')
          }
          console.log('🚀🚀🚀 / inlineSize, blockSize:', inlineSize, blockSize)
        }
      }, 50),
    )

    resizeObserver.observe(this.controlElement)
  }

  // 初始化控制栏相关事件
  private initControlsEvent = () => {
    if (isMobile) {
      this.player.on('play', () => this.setAutoHide())
      this.player.on('pause', () => this.setAutoHide())
    } else {
      // 由于暂时缺少数据，播放已停止。
      this.player.on('waiting', this.onWaiting)
      // 更新播放时间
      this.player.on('timeupdate', this.onTimeupdate)
      // 由于缺乏数据而暂停或延迟后，播放准备开始。
      this.player.on('playing', this.onPlaying)
      this.player.on('loadedmetadata', this.initTimeTip)
      // 播放，暂停后自动隐藏控制栏
      // this.player.on('pause', this.setAutoHide)
      // this.player.on('play', this.setAutoHide)
      this.initMountTargetEvent()
    }
    // 监听控制栏的尺寸变化
    this.watchControlResize()
  }

  // 初始化时间 tip 逻辑
  initTimeTip = () => {
    const tooltip = this.controlElement.querySelector('.tp-play-time-tip') as HTMLElement
    const seekBarWidth = this.seekBar.clientWidth
    const duration = this.player.video.duration
    this.seekBar.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement
      tooltip.textContent = secondToTime((+target.value / 100) * duration)
    })

    this.seekBar.addEventListener('mousemove', (event) => {
      const positionX = event.offsetX - tooltip.clientWidth / 2 + 10
      tooltip.style.left = positionX + 'px'
      tooltip.style.display = 'block'

      const text = (event.offsetX / seekBarWidth) * duration
      tooltip.textContent = secondToTime(text)

      if (event.offsetX < 0 || event.offsetX > seekBarWidth) {
        tooltip.style.display = 'none'
      }
    })
    this.seekBar.addEventListener('mouseleave', function () {
      tooltip.style.display = 'none'
    })
  }

  // 初始化控制栏容器相关事件
  initMountTargetEvent = () => {
    // if (isMobile) {
    //   this.mountTarget.addEventListener('touchstart', (e: any) => {
    //     e.stopPropagation()
    //     if (this.player.isDisabled) return
    //     this.setAutoHide()
    //   })
    // }
    // this.mountTarget.addEventListener('click', this.setAutoHide)
    // this.mountTarget.addEventListener('mousemove', this.setAutoHide)
    // this.mountTarget.addEventListener('mouseleave', this.hide)
  }

  // 移除控制栏容器相关事件
  removeMountTargetEvent = () => {
    this.mountTarget.removeEventListener('mousemove', this.setAutoHide)
    this.mountTarget.removeEventListener('mouseleave', this.hide)
  }

  // 设置控制栏的自动隐藏
  setAutoHide = () => {
    this.show()
    clearTimeout(this.autoHideTimer)
    this.autoHideTimer = setTimeout(() => {
      if (this.player.video.played.length && !this.player.paused && !this.disableAutoHide) {
        this.hide()
      }
    }, 3000)
  }

  // 显示控制栏
  show = () => {
    if (!isMobile) {
      this.mountTarget.classList.remove('tp-hide-controller')
    }
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
  updateSeekBar = () => {
    this.seekBar!.value = ((this.player.video!.currentTime / this.player.video.duration) * 100).toString()
    this.playRaf = window.requestAnimationFrame(() => {
      this.updateSeekBar()
    })
  }

  // 拖动进度条
  onSeeking = (event: Event) => {
    const target = event.target as HTMLInputElement
    const seekTime = (parseFloat(target.value) / 100) * this.player.video.duration
    this.player.seek(seekTime)
  }

  // 调整视频音量
  onVolumeChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    // 调整视频音量
    this.player.volume(Number(target.value))
  }

  // 更新播放时间
  onTimeupdate = () => {
    if (this.playTime) {
      this.playTime.textContent = `${secondToTime(this.player.video!.currentTime)} / ${secondToTime(this.player.video.duration)}`
    }
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
    if (this.player.video.muted || this.player.video.volume === 0) {
      this.muteButton!.innerHTML = Icons.volumeOff
    } else if (this.player.video.volume > 0 && this.player.video.volume <= 0.5) {
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
