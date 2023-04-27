export interface Player {
  playPause(): void
  mute(): void
  fullScreen(): void
  seek(): void
  setVolume(): void
}

export interface PlayerOptions {
  container: HTMLElement
  src: string
  poster?: string
  loop?: boolean
  autoplay?: boolean
  controls?: boolean
  muted?: boolean
  volume?: number
  playbackRate?: number
  width?: number
  height?: number
}
