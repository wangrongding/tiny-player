/**
 * @description 播放器入参配置
 */
export interface PlayerOptions {
  /**
   * @description 播放器容器
   */
  container: HTMLElement
  /**
   * @description 视频地址
   */
  src: string
  /**
   * @description 视频类型
   */
  type: 'auto' | 'normal' | 'hls' | 'flv' | 'dash'
  /**
   * @description 控制器的挂载目标
   */
  controlTarget?: HTMLElement
  /**
   * @description 是否显示控制条
   */
  controlOptions: ControlOptions
  /**
   * @description 是否自动播放
   */
  autoplay?: boolean
  /**
   * @description  是否循环播放
   */
  loop?: boolean
  /**
   * @description 播放器宽度 "123px"
   */
  width?: string
  /**
   * @description 播放器高度 "123px"
   */
  height?: string
  /**
   * @description 视频封面
   */
  poster?: string
  /**
   * @description 预加载
   */
  preload?: 'auto' | 'metadata' | 'none'
  /**
   * @description 是否静音
   */
  muted?: boolean
  /**
   * @description 音量
   */
  volume?: number
  /**
   * @description 播放速率
   */
  playbackRate?: number
  /**
   * @description 是否显示水印
   */
  waterMarkShow?: boolean
  /**
   * @description 视频片段的开始时间
   */
  clipStart?: number
  /**
   * @description 视频片段的结束时间
   */
  clipEnd?: number
}

/**
 * @description 控制器配置
 */
export interface ControlOptions {
  /**
   * @description 是否显示播放时间
   */
  playTime?: boolean
  /**
   * @description 是否显示音量控制栏
   */
  volumeControl?: boolean
  /**
   * @description 是否显示全屏按钮
   */
  fullScreenControl?: boolean
  /**
   * @description 控制器挂载目标
   */
  mountTarget?: HTMLElement
  /**
   * @description  是否手动挂载
   * @default false
   */
  manualMount?: boolean
  /**
   * @description 是否使用原生控制条
   */
  nativeControls?: boolean
}

/**
 * @description Video 事件
 * 以 https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/video#%E4%BA%8B%E4%BB%B6 为准。
 */
export enum VideoEventsEnum {
  /**
   * @description 当音频处理程序处理缓冲区时触发。(The input buffer of a ScriptProcessorNode is ready to be processed.)
   */
  audioprocess = 'audioprocess',
  /**
   * @description 浏览器可以播放媒体文件了，但估计没有足够的数据来支撑播放到结束，不必停下来进一步缓冲内容。
   */
  canplay = 'canplay',
  /**
   * @description 浏览器估计它可以在不停止内容缓冲的情况下播放媒体直到结束。
   */
  canplaythrough = 'canplaythrough',
  /**
   * @description OfflineAudioContext 渲染完成。
   */
  complete = 'complete',
  /**
   * @description  duration 属性的值改变时触发。
   */
  durationchange = 'durationchange',
  /**
   * @description 媒体内容变为空；例如，当这个 media 已经加载完成（或者部分加载完成），则发送此事件，并调用 load() 方法重新加载它。
   */
  emptied = 'emptied',
  /**
   * @description 视频停止播放，因为 media 已经到达结束点。
   */
  ended = 'ended',
  /**
   * @description media 中的首帧已经完成加载。
   */
  loadeddata = 'loadeddata',
  /**
   * @description 已加载元数据。
   */
  loadedmetadata = 'loadedmetadata',
  /**
   * @description 播放已暂停。
   */
  pause = 'pause',
  /**
   * @description 播放已开始。
   */
  play = 'play',
  /**
   * @description //由于缺乏数据而暂停或延迟后，播放准备开始。
   */
  playing = 'playing',
  /**
   * @description 在浏览器加载资源时周期性触发。
   */
  progress = 'progress',
  /**
   * @description 播放速率发生变化。
   */
  ratechange = 'ratechange',
  /**
   * @description 跳帧（seek）操作完成。
   */
  seeked = 'seeked',
  /**
   * @description 跳帧（seek）操作开始。
   */
  seeking = 'seeking',
  /**
   * @description 用户代理（user agent）正在尝试获取媒体数据，但数据意外未出现。
   */
  stalled = 'stalled',
  /**
   * @description 媒体数据加载已暂停。
   */
  suspend = 'suspend',
  /**
   * @description currentTime 属性指定的时间发生变化。
   */
  timeupdate = 'timeupdate',
  /**
   * @description 音量发生变化。
   */
  volumechange = 'volumechange',
  /**
   * @description 由于暂时缺少数据，播放已停止。
   */
  waiting = 'waiting',

  /**
   *
   *
   *
   *
   * @description 在发生错误时触发。
   */
  error = 'error',
  /**
   * @description 在视频/音频（audio/video）终止加载时触发。
   */
  abort = 'abort',
  /**
   * @description 在浏览器开始加载媒体数据时触发。
   */
  loadstart = 'loadstart',
  /**
   * @description 当音频数据可用时触发。
   */
  mozaudioavailable = 'mozaudioavailable',
}

/**
 * @description 播放器事件
 */
export enum PlayerEventsEnum {
  /**
   * @description 播放器销毁时。
   */
  destroy = 'destroy',
  /**
   * @description 播放器 resize 时。
   */
  resize = 'resize',
  /**
   * @description 播放器截屏时。
   */
  screenshot = 'screenshot',

  // fullscreen = 'fullscreen',
  // fullscreen_cancel = 'fullscreen_cancel',
  // webfullscreen = 'webfullscreen',
  // webfullscreen_cancel = 'webfullscreen_cancel',
}
