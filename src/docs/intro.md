# 简介

# BrickContainer 🧱✨

![Version](https://img.shields.io/badge/Version-1.0.0-blue) ![License](https://img.shields.io/badge/License-MIT-green) ![Platform](https://img.shields.io/badge/Platform-Linux-lightgrey)

## 项目简介 🚀

BrickContainer 是一个轻量级应用容器引擎。通过简化的配置和部署流程，帮助用户快速构建和管理容器化应用环境。

## 核心特性 ✨

- **📦 开箱即用**：预配置多种应用环境模板，快速部署
- **🔧 轻量高效**：基于容器技术，资源占用低，性能优异
- **🌐 跨平台支持**：兼容主流操作系统和云环境
- **📚 模板生态**：丰富的社区模板，持续更新扩展
- **⚡ 简易部署**：简化配置流程，降低使用门槛

## 启动容器

- 示例命令可以追加其他环境变量
- 其中，REPO,INSTALL_MODE,BRICK_PATH为必填变量

```bash
env REPO=nju PORT=5001 INSTALL_MODE=custom brick
```

## 环境变量

```bash
# (必填)仓库地址，目前仅可用nju,main
REPO
# (必填)安装模式，可选online在线安装，custom自定义安装
INSTALL_MODE
# 开发模式，填入true,false
DEV
# 其他变量直接追加即可，如template中需要，此变量必填
```

## 如何安装

```bash
curl -ssL https://codespace.lantian.pro/LantianCloud/BrickContainer/raw/branch/main/install.sh | bash
```

## 自定义镜像

1. 使用env指令追加环境变量BRICK_MODE=true，同时，将rootfs压缩包下载到$HOME/rootfs.tar.\*，仅支持.tar.gz,.tar.xz
2. 将自定义启动模板放在$HOME/template.sh
