interface VideoEvents {
  abort: () => void
  canplay: () => void
  canplaythrough: () => void
  durationchange: () => void
  emptied: () => void
  ended: () => void
  error: () => void
  loadeddata: () => void
  loadedmetadata: () => void
  loadstart: () => void
  mozaudioavailable: () => void
  pause: () => void
  play: () => void
  playing: () => void
  progress: () => void
  ratechange: () => void
  seeked: () => void
  seeking: () => void
  stalled: () => void
  suspend: () => void
  timeupdate: () => void
  volumechange: () => void
  waiting: () => void
}

class Events {
  private events: { [key: string]: Function[] }
  private videoEvents: string[]
  private playerEvents: string[]
  constructor() {
    this.events = {}

    this.videoEvents = [
      'abort',
      'canplay',
      'canplaythrough',
      'durationchange',
      'emptied',
      'ended',
      'error',
      'loadeddata',
      'loadedmetadata',
      'loadstart',
      'mozaudioavailable',
      'pause',
      'play',
      'playing',
      'progress',
      'ratechange',
      'seeked',
      'seeking',
      'stalled',
      'suspend',
      'timeupdate',
      'volumechange',
      'waiting',
    ]
    this.playerEvents = [
      'screenshot',
      'destroy',
      'resize',
      'fullscreen',
      'fullscreen_cancel',
      'webfullscreen',
      'webfullscreen_cancel',
    ]
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

  type(name: string) {
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
