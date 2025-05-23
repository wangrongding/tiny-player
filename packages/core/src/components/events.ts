import type TinyPlayer from '../index'
import { VideoEventsEnum, PlayerEventsEnum } from '../types/index'

export type EventsList = keyof typeof VideoEventsEnum | keyof typeof PlayerEventsEnum

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
    // this.videoEvents.forEach((eventName) => this.on(eventName, () => console.log(eventName)))
    // this.on('timeupdate', (e) => console.log('timeupdate',e.target.currentTime))
  }

  // 判断事件类型
  type(name: EventsList) {
    if (this.playerEvents.indexOf(name as PlayerEventsEnum) !== -1) return 'player'
    if (this.videoEvents.indexOf(name as VideoEventsEnum) !== -1) return 'video'
    console.error(`${name} 事件不存在，请查看下文档`)
    return null
  }

  // 绑定事件
  on(name: EventsList, callback: (...arg: any) => void) {
    const type = this.type(name)
    if (type && typeof callback !== 'function') return console.error(`${name} 事件的回调函数必须是一个函数`)
    if (!this.events[name]) this.events[name] = []
    // 重复代码 移除
    // this.events[name].push(callback)
    // video 事件，直接绑定到 video 元素上
    if (type === 'video') {
      this.player.video.addEventListener(name, callback)
    }
    // 播放器的事件
    if (type === 'player') {
      this.events[name].push(callback)
    }
  }

  // 移除事件
  off(name: EventsList, callback: () => void) {
    if (this.type(name) && this.events[name] && this.events[name].length) {
      const index = this.events[name].indexOf(callback)
      if (index === -1) return
      this.events[name].splice(index, 1)
      // 移除事件监听器
      if (this.type(name) === 'video') {
        this.player.video.removeEventListener(name, callback)
      }
    }
  }

  // 触发事件
  emit(name: string, data?: any) {
    if (!this.events[name] || !this.events[name].length) return
    this.events[name].forEach((callback) => {
      callback(data)
    })
  }

  // 触发一次后自动注销
  once(name: EventsList, callback: (...arg: any) => void) {
    const fn = (...arg: any) => {
      callback(...arg)
      this.off(name, fn)
    }
    this.on(name, fn)
  }
}
