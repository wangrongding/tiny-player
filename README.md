# Tiny Player

![](https://assets.fedtop.com/picbed/202305051938108.png)

## 简介

极简的视频播放器，内置硬解功能，软解功能，可支持原生控件样式，自定义控件样式。旨在用最小的体积实现所需全部功能的播放器！

- 不依赖任何框架，任何浏览器都可以使用，支持移动端。
- 支持自定义控制栏挂载目标节点，支持自定义控制栏组件显示隐藏。
- 仅 10kb 大小，gzip 压缩后仅 4kb 大小。

## 功能 & 使用

见 [线上文档](https://tiny-player.vercel.app) （访问失败可能需要挂梯子）  
或 [文档](packages/doc/page/001-快速开始.md)

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

### 在其他项目中调试

通用型：

```sh
# 开发
pnpm dev
# 获取项目地址
cd packages/core && pwd # "/Users/xxx/xxx/chuangkit-tiny-player/packages/core"
# 在其他项目中安装
pnpm add "/Users/xxx/xxx/chuangkit-tiny-player/packages/core"
yarn add "/Users/xxx/xxx/chuangkit-tiny-player/packages/core"
npm i "/Users/xxx/xxx/chuangkit-tiny-player/packages/core"
```

软连接形式：

```sh
pnpm dev
# 如果其他项目以 npm 作为包管理器
cd packages/core && npm link
# 如果其他项目以 yarn 作为包管理器
cd packages/core && yarn link
# 如果其他项目以 pnpm 作为包管理器
cd packages/core && pnpm link

# 在其他项目中安装
# npm
npm link tiny-player
# yarn
yarn link tiny-player
# pnpm
pnpm link tiny-player
```
