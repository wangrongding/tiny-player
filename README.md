# Tiny Player

![](https://assets.fedtop.com/picbed/202305051938108.png)

## 简介

极简的视频播放器，内置硬解功能，软解功能，可支持原生控件样式，自定义控件样式。旨在用最小的体积实现所需全部功能的播放器！

- 不依赖任何框架，任何浏览器都可以使用，支持移动端。
- 支持自定义控制栏挂载目标节点，支持自定义控制栏组件显示隐藏。
- 仅 10kb 大小，gzip 压缩后仅 4kb 大小。

## 功能

- [x] 支持 mp4、webm、ogg 等多种常见格式
- [x] 支持 m3u8
- [ ] 自定义控制栏组件显示隐藏
- [ ] 自定义水印
- [ ] 挂载目标节点

## 使用

见 [文档](packages/doc/page/001-快速开始.md)

## 开发

确保 node 版本 >= 16 ，且全局安装 pnpm

```sh
npm install -g pnpm
```

```sh
# 安装依赖
pnpm i
# 开发调试
pnpm dev
# 构建
pnpm build
```
