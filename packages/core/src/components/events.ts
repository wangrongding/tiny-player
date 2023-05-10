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
  private events: { [key: string]: Function[] }
  private videoEvents: VideoEventsEnum[]
  private playerEvents: PlayerEventsEnum[]
  constructor() {
    this.events = {}

    // 视频相关事件
    this.videoEvents = Object.keys(VideoEventsEnum).map((key) => VideoEventsEnum[key as keyof typeof VideoEventsEnum])
    // 播放器相关事件
    this.playerEvents = Object.keys(PlayerEventsEnum).map(
      (key) => PlayerEventsEnum[key as keyof typeof PlayerEventsEnum],
    )
  }

  on(name: EventsList, callback: Function) {
    if (this.type(name) && typeof callback === 'function') {
      if (!this.events[name]) {
        this.events[name] = []
      }
      this.events[name].push(callback)
    }
  }

  trigger(name: string, info: any) {
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

    console.error(`Unknown event name: ${name}`)
    return null
  }
}
