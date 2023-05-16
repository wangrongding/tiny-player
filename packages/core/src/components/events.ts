import type TinyPlayer from '../index'

export enum VideoEventsEnum {
  abort = 'abort',
  canplay = 'canplay',
  canplaythrough = 'canplaythrough',
  durationchange = 'durationchange',
  emptied = 'emptied',
  ended = 'ended',
  error = 'error',
  loadeddata = 'loadeddata',
  loadedmetadata = 'loadedmetadata',
  loadstart = 'loadstart',
  pause = 'pause',
  play = 'play',
  playing = 'playing',
  progress = 'progress',
  ratechange = 'ratechange',
  seeked = 'seeked',
  seeking = 'seeking',
  stalled = 'stalled',
  suspend = 'suspend',
  timeupdate = 'timeupdate',
  volumechange = 'volumechange',
  waiting = 'waiting',
  mozaudioavailable = 'mozaudioavailable',
}
export enum PlayerEventsEnum {
  destroy = 'destroy',
  resize = 'resize',
  screenshot = 'screenshot',

  // fullscreen = 'fullscreen',
  // fullscreen_cancel = 'fullscreen_cancel',
  // webfullscreen = 'webfullscreen',
  // webfullscreen_cancel = 'webfullscreen_cancel',
}

export type EventsList = keyof typeof PlayerEventsEnum | keyof typeof VideoEventsEnum

export default class TinyPlayEvents {
  events: { [key: string]: Function[] } = {}
  player: TinyPlayer
  videoEvents: VideoEventsEnum[]
  playerEvents: PlayerEventsEnum[]

  constructor(player: TinyPlayer) {
    this.player = player
    // 视频相关事件
    this.videoEvents = Object.keys(VideoEventsEnum).map((key) => VideoEventsEnum[key as keyof typeof VideoEventsEnum])
    // 播放器相关事件
    this.playerEvents = Object.keys(PlayerEventsEnum).map(
      (key) => PlayerEventsEnum[key as keyof typeof PlayerEventsEnum],
    )

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
      'playing', //由于缺乏数据而暂停或延迟后，播放准备开始。
      'error',
      'abort',
    ]
    eventList.forEach((eventName) => {
      this.player.video.addEventListener(eventName, (e: Event) => {
        console.log(eventName, e.type)
      })
    })
  }

  on(name: EventsList, callback: () => void) {
    const type = this.type(name)
    if (type && typeof callback === 'function') {
      if (!this.events[name]) this.events[name] = []
      this.events[name].push(callback)

      // video 事件，直接绑定到 video 元素上
      if (type === 'video') {
        this.player.video.addEventListener(name, callback)
      }
      // 播放器的事件
      if (type === 'player') {
      }
    }
  }

  off(name: EventsList, callback: Function) {
    if (this.type(name) && this.events[name] && this.events[name].length) {
      for (let i = 0; i < this.events[name].length; i++) {
        if (this.events[name][i] === callback) {
          this.events[name].splice(i, 1)
          break
        }
      }
    }
  }

  trigger(name: string, info?: any) {
    if (this.events[name] && this.events[name].length) {
      for (let i = 0; i < this.events[name].length; i++) {
        this.events[name][i](info)
      }
    }
  }

  type(name: EventsList) {
    if (this.playerEvents.indexOf(name as PlayerEventsEnum) !== -1) {
      return 'player'
    } else if (this.videoEvents.indexOf(name as VideoEventsEnum) !== -1) {
      return 'video'
    }

    console.error(`${name} 事件不存在，可以查看下文档：https://baidu.com `)
    return null
  }
}
