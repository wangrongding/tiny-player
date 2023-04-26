interface Player {
  playPause(): void
  mute(): void
  fullScreen(): void
  seek(): void
  setVolume(): void
}

interface PlayerOptions {
  container: HTMLElement
  loop?: boolean
  autoplay?: boolean
  controls?: boolean
  muted?: boolean
  volume?: number
  playbackRate?: number
  width?: number
  height?: number
}

declare module '*.ejs'
declare module '*.svg'
declare module '*.json'
