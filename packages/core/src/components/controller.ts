import { isMobile, throttle, secondToTime } from '@/utils/index'
import controlTemplate from '../template/control.ejs'
import Icons from '@/assets/icons/index'
import type TinyPlayer from '../index'

export interface Controls {
  playButton?: HTMLElement // 播放按钮
  seekBar?: HTMLInputElement // 进度条
  playTime?: HTMLElement // 播放时间
  volumeBar?: HTMLInputElement // 声音控制栏
  muteButton?: HTMLElement // 静音按钮
  fullScreenButton?: HTMLElement // 全屏按钮
}

export default class Controller {
  player: TinyPlayer // 播放器实例
  autoHideTimer: number // 自动隐藏计时器
  disableAutoHide: boolean = false // 禁用自动隐藏
  controls: Controls = {} // 控制器
  controlNode?: HTMLElement // 控制器节点
  container: HTMLElement = document.createElement('div')
  playRaf = 0 // 播放 requestAnimationFrame Id

  constructor(player: TinyPlayer) {
    this.player = player

    this.autoHideTimer = 0
    if (!isMobile) {
      // this.player.container.addEventListener('mousemove', throttle(this.setAutoHide.bind(this), 100))
      // this.player.container.addEventListener('click', () => {
      //   this.setAutoHide()
      // })
      // this.player.on('play', () => {
      //   this.setAutoHide()
      // })
      // this.player.on('pause', () => {
      //   this.setAutoHide()
      // })
      // this.player.container.addEventListener('mouseleave', throttle(this.hide.bind(this), 100))
    } else {
      this.player.on('play', () => {
        this.setAutoHide()
      })
      this.player.on('pause', () => {
        this.setAutoHide()
      })

      // this.player.template.bezel.addEventListener('touchstart', (e: any) => {
      //   e.stopPropagation()
      //   if (this.player.isDisabled) return
      //   this.setAutoHide()
      // })
    }

    // this.initPlayButton()
    // this.initPlayedBar()
    // this.initVolumeButton()
    // if (!isMobile) {
    // }

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
      this.player.video.addEventListener(eventName, (e: Event) => {
        console.log(eventName, e.type)
      })
    })

    this.initControls()
  }

  // 初始化播放器控制条
  private initControls() {
    // 控制面板节点
    this.controlNode = document.createElement('div')
    this.controlNode.className = 'tiny-player-control-panel'
    this.controlNode.innerHTML = controlTemplate(this.player.options)
    document.querySelector('.tiny-player-container')!.appendChild(this.controlNode)

    // 设置控制条按钮的事件处理函数
    this.controls.playButton = this.player.videoContainer.querySelector('.tiny-player-play-icon') as HTMLElement
    this.controls.playButton && (this.controls.playButton.innerHTML = Icons.play)
    this.controls.playButton.addEventListener('click', this.player.togglePlay)

    // 设置控制条滑块的事件处理函数
    this.controls.seekBar = this.player.videoContainer.querySelector('.tiny-player-seek-bar') as HTMLInputElement
    this.controls.seekBar.addEventListener('input', this.player.seek)
    this.controls.playTime = this.player.videoContainer.querySelector('.tiny-player-play-time') as HTMLInputElement

    // 设置控制条声音控制栏的事件处理函数
    this.controls.muteButton = this.player.videoContainer.querySelector('.tiny-player-volume') as HTMLButtonElement
    this.controls.muteButton.addEventListener('click', this.player.mute)
    this.controls.muteButton && (this.controls.muteButton.innerHTML = Icons.volumeUp)
    this.controls.volumeBar = this.player.videoContainer.querySelector('.tiny-player-volume-bar') as HTMLInputElement
    this.controls.volumeBar.addEventListener('input', this.player.setVolume)

    // 设置控制条全屏按钮的事件处理函数
    this.controls.fullScreenButton = this.player.videoContainer.querySelector('.tiny-player-fullscreen') as HTMLElement
    this.controls.fullScreenButton && this.controls.fullScreenButton.addEventListener('click', this.player.fullScreen)
    this.controls.fullScreenButton && (this.controls.fullScreenButton.innerHTML = Icons.fullWeb)

    if (!this.player.options.controls) return
  }

  initPlayButton() {
    // this.player.template.playButton.addEventListener('click', () => {
    //     this.player.toggle();
    // });

    // this.player.template.mobilePlayButton.addEventListener('click', () => {
    //     console.log('mobilePlayButton-click',this.player.template.mobilePlayButton)
    //     this.player.toggle();
    // });

    if (!isMobile) {
      // this.player.template.playButton.addEventListener('click', () => {
      //   this.player.toggle()
      // })
      // this.player.template.videoWrap.addEventListener('click', () => {
      //   this.player.toggle()
      // })
      // this.player.template.controllerMask.addEventListener('click', () => {
      //   this.player.toggle()
      // })
    } else {
      // this.player.template.bezel.addEventListener('touchstart', (e: TouchEvent) => {
      //   e.stopPropagation()
      //   if (this.player.isDisabled) return
      //   this.player.container.classList.remove('dplayer-hide-controller')
      //   this.player.toggle()
      // })
      // this.player.template.controllerMask.addEventListener('touchstart', (e: TouchEvent) => {
      //   e.stopPropagation()
      //   if (this.player.isDisabled) return
      //   this.player.toggle()
      // })
    }
  }

  initVolumeButton() {}

  setAutoHide() {
    this.show()
    clearTimeout(this.autoHideTimer)
    this.autoHideTimer = setTimeout(() => {
      if (this.player.video.played.length && !this.player.paused && !this.disableAutoHide) {
        this.hide()
      }
    }, 3000)
  }

  show() {
    if (!isMobile) {
      this.player.container.classList.remove('tiny-player-hide-controller')
    }
    this.setVisible(true)
  }

  hide() {
    this.player.container.classList.add('tiny-player-hide-controller')
  }

  // 设置控制条是否显示
  setVisible(val: boolean) {
    this.container.style.opacity = val ? '1' : '0'
    if (!val && isMobile) this.container.style.display = 'none'
  }

  toggle() {
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

  // 更新播放时间
  onTimeupdate = () => {
    this.controls.playTime!.textContent = `${secondToTime(this.player.video!.currentTime)} / ${secondToTime(
      this.player.video.duration,
    )}`
  }

  // 切换音量图标
  switchVolumeIcon() {
    console.log('🚀🚀🚀 / this.player.video.volume:', this.player.video.volume)
    if (this.player.video.muted || this.player.video.volume === 0) {
      this.controls.muteButton!.innerHTML = Icons.volumeOff
    } else if (this.player.video.volume > 0 && this.player.video.volume <= 0.5) {
      this.controls.muteButton!.innerHTML = Icons.volumeDown
    } else {
      this.controls.muteButton!.innerHTML = Icons.volumeUp
    }
  }

  destroy() {
    clearTimeout(this.autoHideTimer)
  }
}
