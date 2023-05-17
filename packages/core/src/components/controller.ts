import controlTemplate from '@/assets/template/control.ejs'
import { isMobile, throttle, secondToTime } from '@/utils/index'
import Icons from '@/assets/icons/index'
import type TinyPlayer from '../index'

export interface Controls {
  playButton?: HTMLElement // 播放按钮
  seekBar?: HTMLInputElement // 进度条
  playTime?: HTMLElement // 播放时间
  volumeBar?: HTMLInputElement // 声音控制栏
  muteButton?: HTMLElement // 静音按钮
  fullScreenButton?: HTMLElement // 全屏按钮
  loading?: HTMLElement // 加载动画
}

export default class Controller {
  player: TinyPlayer // 播放器实例
  autoHideTimer?: number // 自动隐藏计时器
  disableAutoHide: boolean = false // 禁用自动隐藏
  controls: Controls = {} // 控制器
  controlNode!: HTMLElement // 控制器节点
  container: HTMLElement = document.createElement('div')
  playRaf = 0 // 播放 requestAnimationFrame Id

  constructor(player: TinyPlayer) {
    this.player = player
    console.log('🚀🚀🚀 / this.player:', this.player)

    this.initControls()
    this.initControlsEvent()
  }

  // 初始化播放器控制条
  private initControls = () => {
    // 控制面板节点
    this.controlNode = document.createElement('div')
    this.controlNode.className = 'tiny-player-control-panel'
    this.controlNode.innerHTML = controlTemplate(this.player.options)
    document.querySelector('.tiny-player-container')!.appendChild(this.controlNode)
    // loading 动画
    this.controls.loading = this.controlNode.querySelector('.tiny-player-loading') as HTMLElement
    this.controls.loading.innerHTML = Icons.loading
    this.controls.loading!.style.opacity = '0'

    this.initPlayButton()
    this.initSeekBar()
    this.initVolumeButton()
    this.initFullScreenButton()

    // 其他
    if (!this.player.options.controls) return
  }

  // 初始化控制栏相关事件
  private initControlsEvent = () => {
    if (isMobile) {
      this.player.on('play', () => this.setAutoHide())
      this.player.on('pause', () => this.setAutoHide())
      // this.player.template.bezel.addEventListener('touchstart', (e: any) => {
      //   e.stopPropagation()
      //   if (this.player.isDisabled) return
      //   this.setAutoHide()
      // })
    } else {
      // 播放，暂停后自动隐藏控制栏
      // this.player.on('pause', this.setAutoHide)
      // this.player.on('play', () => this.setAutoHide())
      // 由于暂时缺少数据，播放已停止。
      this.player.on('waiting', this.onWaiting)
      // 更新播放时间
      this.player.on('timeupdate', this.onTimeupdate)
      // 由于缺乏数据而暂停或延迟后，播放准备开始。
      this.player.on('playing', this.onPlaying)

      // this.player.container.addEventListener('mousemove', throttle(this.setAutoHide.bind(this), 100))
      // this.player.container.addEventListener('mouseleave', throttle(this.hide.bind(this), 100))
      // this.player.container.addEventListener('click', this.setAutoHide)
    }
  }

  // 初始化播放按钮
  private initPlayButton = () => {
    // 设置控制条按钮的事件处理函数
    this.controls.playButton = this.controlNode.querySelector('.tiny-player-play-icon') as HTMLElement
    this.controls.playButton && (this.controls.playButton.innerHTML = Icons.play)
    this.controls.playButton.addEventListener('click', this.player.togglePlay)
  }

  // 初始化播放进度条
  private initSeekBar = () => {
    // 设置控制条滑块的事件处理函数
    this.controls.seekBar = this.controlNode.querySelector('.tiny-player-seek-bar') as HTMLInputElement
    this.controls.seekBar.addEventListener('input', this.onSeeking)
    this.controls.playTime = this.controlNode.querySelector('.tiny-player-play-time') as HTMLInputElement
  }

  // 初始化音量控制栏
  private initVolumeButton = () => {
    // 设置控制条声音控制栏的事件处理函数
    this.controls.muteButton = this.controlNode.querySelector('.tiny-player-volume') as HTMLButtonElement
    this.controls.muteButton.addEventListener('click', this.player.mute)
    this.controls.muteButton && (this.controls.muteButton.innerHTML = Icons.volumeUp)
    this.controls.volumeBar = this.controlNode.querySelector('.tiny-player-volume-bar') as HTMLInputElement
    this.controls.volumeBar.addEventListener('input', this.player.setVolume)
  }

  // 初始化全屏按钮
  private initFullScreenButton = () => {
    // 设置控制条全屏按钮的事件处理函数
    this.controls.fullScreenButton = this.controlNode.querySelector('.tiny-player-fullscreen') as HTMLElement
    this.controls.fullScreenButton &&
      this.controls.fullScreenButton.addEventListener('click', this.player.toggleFullScreen)
    this.controls.fullScreenButton && (this.controls.fullScreenButton.innerHTML = Icons.fullWeb)
  }

  setAutoHide = () => {
    this.show()
    clearTimeout(this.autoHideTimer)
    this.autoHideTimer = setTimeout(() => {
      if (this.player.video.played.length && !this.player.paused && !this.disableAutoHide) {
        this.hide()
      }
    }, 3000)
  }

  show = () => {
    if (!isMobile) {
      this.player.container.classList.remove('tiny-player-hide-controller')
    }
    this.setVisible(true)
  }

  hide = () => {
    this.player.container.classList.add('tiny-player-hide-controller')
  }

  // 设置控制条是否显示
  setVisible(val: boolean) {
    this.container.style.opacity = val ? '1' : '0'
    if (!val && isMobile) this.container.style.display = 'none'
  }

  toggle = () => {
    if (!this.player.container.classList.contains('tiny-player-hide-controller')) {
      this.hide()
    } else {
      this.show()
    }
  }

  // 更新播放进度条
  updateSeekBar = () => {
    this.controls.seekBar!.value = ((this.player.video!.currentTime / this.player.video.duration) * 100).toString()
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

  // 更新播放时间
  onTimeupdate = () => {
    this.controls.playTime!.textContent = `${secondToTime(this.player.video!.currentTime)} / ${secondToTime(
      this.player.video.duration,
    )}`
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
      this.controls.loading!.style.opacity = '1'
      this.controls.playButton!.style.opacity = '0'
    } else {
      this.controls.loading!.style.opacity = '0'
      this.controls.playButton!.style.opacity = '1'
    }
  }

  // 切换音量图标
  switchVolumeIcon = () => {
    if (this.player.video.muted || this.player.video.volume === 0) {
      this.controls.muteButton!.innerHTML = Icons.volumeOff
    } else if (this.player.video.volume > 0 && this.player.video.volume <= 0.5) {
      this.controls.muteButton!.innerHTML = Icons.volumeDown
    } else {
      this.controls.muteButton!.innerHTML = Icons.volumeUp
    }
  }

  // 销毁事件
  destroy = () => {
    clearTimeout(this.autoHideTimer)
  }
}
