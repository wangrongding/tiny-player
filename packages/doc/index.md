---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'Tiny Player'
  text: 'A sparrow has all five organs.'
  # tagline: 🦄 Wow, such a lovely HTML5 video player
  # image:
  #   src: /movie.png
  #   alt: VitePress
  actions:
    - theme: brand
      text: Get Started
      link: /page/001-快速开始
    - theme: brand
      text: Playground
      link: /page/playground
    - theme: alt
      text: View on GitHub
      link: https://github.com/wangrongding/tiny-player

features:
  - title: 🧩 兼容性好
    details: 0 依赖，任何框架和浏览器都可以使用，支持移动端。
  - title: 🌸 多格式支持，支持流式播放
    details: 支持 mp4、webm、ogg 等多种常见格式，支持 m3u8，支持自动切换。
  - title: 🌟 控制栏可插拔
    details: 支持自定义控制栏，控制栏挂载到目标节点，支持自定义控制栏组件显示隐藏。
  - title: 🎬 支持指定片段播放
    details: 通过入参指定片段播放，类裁剪。
  - title: 🎨 轻量
    details: 仅 25kb 大小，gzip 压缩后仅 7kb 大小。
  - title: 🥳 软解（wip）
    details: 支持音视频软解，支持自定义解码器，解决各个浏览器的兼容性问题。（开发中）
---
