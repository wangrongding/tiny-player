import type TinyPlayer from '../index'

export enum VideoEventsEnum {
  audioprocess = 'audioprocess', // 当音频处理程序处理缓冲区时触发。(The input buffer of a ScriptProcessorNode is ready to be processed.)
  canplay = 'canplay', // 浏览器可以播放媒体文件了，但估计没有足够的数据来支撑播放到结束，不必停下来进一步缓冲内容。
  canplaythrough = 'canplaythrough', // 浏览器估计它可以在不停止内容缓冲的情况下播放媒体直到结束。
  complete = 'complete', // OfflineAudioContext 渲染完成。
  durationchange = 'durationchange', // duration 属性的值改变时触发。
  emptied = 'emptied', // 媒体内容变为空；例如，当这个 media 已经加载完成（或者部分加载完成），则发送此事件，并调用 load() 方法重新加载它。
  ended = 'ended', // 视频停止播放，因为 media 已经到达结束点。
  loadeddata = 'loadeddata', // media 中的首帧已经完成加载。
  loadedmetadata = 'loadedmetadata', // 已加载元数据。
  pause = 'pause', // 播放已暂停。
  play = 'play', // 播放已开始。
  playing = 'playing', //由于缺乏数据而暂停或延迟后，播放准备开始。
  progress = 'progress', // 在浏览器加载资源时周期性触发。
  ratechange = 'ratechange', // 播放速率发生变化。
  seeked = 'seeked', // 跳帧（seek）操作完成。
  seeking = 'seeking', // 跳帧（seek）操作开始。
  stalled = 'stalled', // 用户代理（user agent）正在尝试获取媒体数据，但数据意外未出现。
  suspend = 'suspend', // 媒体数据加载已暂停。
  timeupdate = 'timeupdate', // currentTime 属性指定的时间发生变化。
  volumechange = 'volumechange', // 音量发生变化。
  waiting = 'waiting', // 由于暂时缺少数据，播放已停止。

  mozaudioavailable = 'mozaudioavailable', // 当音频数据可用时触发。
  error = 'error', // 在发生错误时触发。
  abort = 'abort', // 在视频/音频（audio/video）终止加载时触发。
  // loadstart = 'loadstart', // 在浏览器开始加载媒体数据时触发。
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
    this.playerEvents = Object.keys(PlayerEventsEnum).map((key) => PlayerEventsEnum[key as keyof typeof PlayerEventsEnum])

    // TODO 测试用
    this.videoEvents.forEach((eventName) => {
      this.player.video.addEventListener(eventName, (e: Event) => {
        console.log(eventName, e.type)
      })
    })
  }

  // 判断事件类型
  type(name: EventsList) {
    if (this.playerEvents.indexOf(name as PlayerEventsEnum) !== -1) {
      return 'player'
    } else if (this.videoEvents.indexOf(name as VideoEventsEnum) !== -1) {
      return 'video'
    }

    console.error(`${name} 事件不存在，可以查看下文档：https://baidu.com `)
    return null
  }

  // 绑定事件
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

  // 移除事件
  off(name: EventsList, callback: () => void) {
    if (this.type(name) && this.events[name] && this.events[name].length) {
      const index = this.events[name].indexOf(callback)
      console.log('🚀🚀🚀 / index:', index)
      if (index === -1) return
      this.events[name].splice(index, 1)
      // 移除事件监听器
      if (this.type(name) === 'video') {
        this.player.video.removeEventListener(name, callback)
      }
    }
  }

  // 触发事件
  emit(name: string, info?: any) {
    if (this.events[name] && this.events[name].length) {
      for (let i = 0; i < this.events[name].length; i++) {
        this.events[name][i](info)
      }
    }
  }
}
