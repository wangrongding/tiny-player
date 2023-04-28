import TinyPlayer from './components/player'

console.log(
  `${'\n'} %c ${TinyPlayer.title} v${TinyPlayer.version} ${'\n'}`,
  `color: white; font-size: 18px; background: linear-gradient(45deg, #ff0000 0%, #0092ff 80%);`,
)

export interface Player {
  playPause(): void
  mute(): void
  fullScreen(): void
  seek(): void
  setVolume(): void
}

export interface PlayerOptions {
  container: HTMLElement // 播放器容器
  src: string // 视频地址
  poster?: string // 视频封面
  loop?: boolean // 是否循环播放
  autoplay?: boolean // 是否自动播放
  controls?: boolean // 是否显示控制条
  muted?: boolean // 是否静音
  volume?: number // 音量
  playbackRate?: number // 播放速率
  width?: number | string // 播放器宽度
  height?: number | string // 播放器高度
}

export default TinyPlayer
