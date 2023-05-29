// 节流
export const throttle = (fn: Function, delay: number) => {
  let timer: any = null
  return (...args: any[]) => {
    if (timer) {
      return
    }
    timer = setTimeout(() => {
      fn(...args)
      timer = null
    }, delay)
  }
}
// 防抖
export const debounce = (fn: Function, delay: number) => {
  let timer: any = null
  return (...args: any[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

// 是否是移动端
export const isMobile = /mobile/i.test(window.navigator.userAgent)
// 是否是火狐浏览器
export const isFirefox = /firefox/i.test(window.navigator.userAgent)
// 是否是谷歌浏览器
export const isChrome = /chrome/i.test(window.navigator.userAgent)
// 是否是Safari浏览器
export const isSafari = /safari/i.test(window.navigator.userAgent)
// 是否是IE浏览器
export const isIE = /msie/i.test(window.navigator.userAgent)
// 是否是Edge浏览器
export const isEdge = /edge/i.test(window.navigator.userAgent)
// Storage 操作
export const storage = {
  set: (key: string, value: string) => {
    localStorage.setItem(key, value)
  },
  get: (key: string) => localStorage.getItem(key),
}
// 事件名称
export const nameMap = {
  dragStart: isMobile ? 'touchstart' : 'mousedown',
  dragMove: isMobile ? 'touchmove' : 'mousemove',
  dragEnd: isMobile ? 'touchend' : 'mouseup',
}
// 解析秒到时间字符串 00:00 or 00:00:00
export const secondToTime = (second: number): string => {
  second = second || 0
  if (second === 0 || second === Infinity || second.toString() === 'NaN') {
    return '00:00'
  }
  const add0 = (num: number) => (num < 10 ? '0' + num : '' + num)
  const hour = Math.floor(second / 3600)
  const min = Math.floor((second - hour * 3600) / 60)
  const sec = Math.floor(second - hour * 3600 - min * 60)
  return (hour > 0 ? [hour, min, sec] : [min, sec]).map(add0).join(':')
}
// 颜色转数字
export const color2Number = (color: string) => {
  if (color[0] === '#') {
    color = color.substr(1)
  }
  if (color.length === 3) {
    color = `${color[0]}${color[0]}${color[1]}${color[1]}${color[2]}${color[2]}`
  }
  return (parseInt(color, 16) + 0x000000) & 0xffffff
}
// 数字转颜色
export const number2Color = (number: number) => '#' + ('00000' + number.toString(16)).slice(-6)
// 获取 transform 的值
export const getTransform = (str: string) => {
  str = str.replace(/\s/g, '').replace(/NaN/g, '0')
  const arr = str.split(')')
  let object = {} as any
  arr.forEach((item) => {
    const arr1 = item.split('(')
    if (arr1[0]) {
      object[arr1[0]] = arr1[1].split(',').map((v) => parseFloat(v))
    }
  })
  return object
}
// 设置 transform 的值
export const setTransform = (obj: Record<string, any>) => {
  let str = ''
  Object.keys(obj).forEach((key) => {
    str += `${key}(${obj[key].join(',')})`
  })
  return str
}
export default {
  isMobile: isMobile,
  isFirefox: isFirefox,
  isChrome: isChrome,
  storage,
  nameMap,
  secondToTime,
  color2Number,
  number2Color,
  getTransform,
  setTransform,
}
