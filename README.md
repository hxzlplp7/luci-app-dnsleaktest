<div align="center">
  <h1>luci-app-dnsleaktest</h1>
  <h3>一个为您提供快速、准确、可视化的 DNS 泄漏测试 LuCI 插件。</h3>
</div>
<hr/>
<div align="center">
  <img alt="License" src="https://img.shields.io/github/license/hxzlplp7/luci-app-dnsleaktest?style=for-the-badge">
  <img alt="Forks" src="https://img.shields.io/github/forks/hxzlplp7/luci-app-dnsleaktest?style=for-the-badge">
  <img alt="Release" src="https://img.shields.io/github/v/release/hxzlplp7/luci-app-dnsleaktest?style=for-the-badge">
  <img alt="Downloads" src="https://img.shields.io/github/downloads/hxzlplp7/luci-app-dnsleaktest/total?style=for-the-badge">
</div>
<br/>

## 简介

本项目是一个高度定制化且全面汉化的 OpenWrt LuCI 插件，灵感源自 [macvk/dnsleaktest](https://github.com/macvk/dnsleaktest)。在 v2.0+ 版本中，我们已全面迁移至 **ipleak.net** 探测引擎，为您提供更专业的隐私安全检测。

### 核心特性

- **增强型探测引擎**（v2.2+）：采用 `ipleak.net` 后端，通过 40 位随机 Token 与并发子域名探测，大幅提升在不同网络环境下的结果收集成功率。
- **深度信息补全**：不仅展示 DNS IP，更通过二次查询机制 100% 还原每一个探测到的 DNS 服务器的**国家/地区**、**运营商 (ISP)** 及详细地理位置。
- **完全汉化**：界面文本与结果提示均经过精细的简体中文本地化处理。
- **自动化部署**：支持一键安装脚本与 GitHub Actions 自动编译 IPK 包。

## 如何安装

### 直接使用终端一键安装

```bash
curl -s https://raw.githubusercontent.com/hxzlplp7/luci-app-dnsleaktest/master/zh-cn.sh | sh
```

*注：`zh-cn.sh` 会自动检测版本、注入中文翻译并重启 LuCI 界面。*

### 手动安装流程

1. 前往 [Releases](https://github.com/hxzlplp7/luci-app-dnsleaktest/releases) 页面下载最新的 `.ipk` 文件。
2. 同时下载 `luci-i18n-dnsleaktest-zh-cn` 语言包以获得完整的中文体验。
3. 使用 `opkg install` 指令进行安装。

## 致谢

- 原作者: [Hilman Maulana](https://github.com/animegasan)
- 灵感来源: [macvk/dnsleaktest](https://github.com/macvk/dnsleaktest)
- 后端服务提供商: [ipleak.net](https://ipleak.net)
