interface Player {
  playPause(): void
  mute(): void
  fullScreen(): void
  seek(): void
  setVolume(): void
}

interface PlayerOptions {
  container: string
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
declare module '*.html'
