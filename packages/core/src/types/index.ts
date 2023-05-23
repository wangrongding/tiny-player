/**
 * @description 播放器入参配置
 */
export interface PlayerOptions {
  container: HTMLElement // 播放器容器
  controlTarget?: HTMLElement // 控制器挂载目标
  src: string // 视频地址
  controlOptions: ControlOptions // 是否显示控制条
  autoplay?: boolean // 是否自动播放
  loop?: boolean // 是否循环播放
  width?: string // 播放器宽度 "123px"
  height?: string // 播放器高度 "123px"
  poster?: string // 视频封面
  preload?: 'auto' | 'metadata' | 'none' // 预加载
  muted?: boolean // 是否静音
  volume?: number // 音量
  playbackRate?: number // 播放速率
  type: 'auto' | 'normal' | 'hls' | 'flv' | 'dash' // 视频类型
  waterMarkShow?: boolean // 是否显示水印
}

/**
 * @description 控制器配置
 */
export interface ControlOptions {
  playTime?: boolean // 是否显示播放时间
  volumeControl?: boolean // 是否显示音量控制栏
  fullScreenControl?: boolean // 是否显示全屏按钮
  mountTarget?: HTMLElement // 控制器挂载目标
  nativeControls?: boolean // 是否使用原生控制条
}

/**
 * @description Video 事件
 */
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

  error = 'error', // 在发生错误时触发。
  abort = 'abort', // 在视频/音频（audio/video）终止加载时触发。
  loadstart = 'loadstart', // 在浏览器开始加载媒体数据时触发。
  mozaudioavailable = 'mozaudioavailable', // 当音频数据可用时触发。
}

/**
 * @description 播放器事件
 */
export enum PlayerEventsEnum {
  destroy = 'destroy',
  resize = 'resize',
  screenshot = 'screenshot',

  // fullscreen = 'fullscreen',
  // fullscreen_cancel = 'fullscreen_cancel',
  // webfullscreen = 'webfullscreen',
  // webfullscreen_cancel = 'webfullscreen_cancel',
}
