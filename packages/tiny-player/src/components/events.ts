enum VideoEventsEnum {
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
  mozaudioavailable = 'mozaudioavailable',
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
}
enum playerEvents {
  screenshot = 'screenshot',
  destroy = 'destroy',
  resize = 'resize',
  fullscreen = 'fullscreen',
  fullscreen_cancel = 'fullscreen_cancel',
  webfullscreen = 'webfullscreen',
  webfullscreen_cancel = 'webfullscreen_cancel',
}

class Events {
  private events: { [key: string]: Function[] }
  private videoEvents: VideoEventsEnum[]
  private playerEvents: string[]
  constructor() {
    this.events = {}

    this.videoEvents = Object.keys(VideoEventsEnum).map((key) => VideoEventsEnum[key as keyof typeof VideoEventsEnum])

    this.playerEvents = Object.keys(playerEvents).map((key) => playerEvents[key as keyof typeof playerEvents])
  }

  on(name: string, callback: Function) {
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

  type(name: any) {
    if (this.playerEvents.indexOf(name) !== -1) {
      return 'player'
    } else if (this.videoEvents.indexOf(name) !== -1) {
      return 'video'
    }

    console.error(`Unknown event name: ${name}`)
    return null
  }
}

export default Events
