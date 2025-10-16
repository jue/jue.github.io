---
title: "Mac 下 Kilo Code 集成 Gemini CLI 报错 403 终极修复指南"
description: "适用环境 - 操作系统：macOS - 平台：VS Code + Kilo Code 扩展 - 功能：集成 Google Gemini CLI  问题背景 在 macOS 上，Gemini CLI 命令行可正常用，但在 Kilo Code (VSCode 插件) 环境下报 403 权限错误。主要是环..."
date: 2025-10-16
lastUpdated: 2025-10-16
authors:
  - name: "jue"
    link: "https://github.com/jue"
    avatar: "https://avatars.githubusercontent.com/u/377499?v=4"
categories:
  - "Tech Talk"
wordCount: 646
readingTime: 2
githubIssue: 11
githubUrl: "https://github.com/jue/jue.github.io/issues/11"
---
### 适用环境

- 操作系统：**macOS**
- 平台：VS Code + Kilo Code 扩展
- 功能：集成 Google Gemini CLI

***

### 问题背景

在 macOS 上，Gemini CLI 命令行可正常用，但在 Kilo Code (VSCode 插件) 环境下报 `403` 权限错误。主要是环境变量和 Google Cloud API 权限导致。

***

### 常见报错及成因

#### 1. `Permission denied on resource project default`

**原因**  
Kilo Code 读取不到正确的 `GOOGLE_CLOUD_PROJECT` 环境变量，导致默认项目为“default”。

**Mac 专属操作指引**  
1. 打开**终端终端 (Terminal)**，进入配置目录：
    ```bash
    cd ~/.gemini
    ```
2. 新建或编辑 `.env` 文件，**用文本编辑器写入**：
    ```bash
    export GOOGLE_CLOUD_PROJECT="你的Google Cloud 项目ID"
    ```
    推荐命令：  
    ```bash
    touch ~/.gemini/.env
    open -e ~/.gemini/.env   # 打开文本编辑器
    ```
3. 保存并关闭。

4. **重启 VS Code**，重启后 Kilo Code 才会加载 `.env`。

***

#### 2. `Gemini for Google Cloud API has not been used...`

**原因**  
你的 Google Cloud 项目尚未启用 Gemini for Google Cloud API (`cloudaicompanion.googleapis.com`)。

**Mac 下启用方法**  
- 推荐在 Mac 上用浏览器直接点此链接，手动启用：  
  ```
  https://console.developers.google.com/apis/api/cloudaicompanion.googleapis.com/overview?project=你的项目ID
  ```
- 命令行也可（macOS 默认内置 gcloud 工具时）：
    ```bash
    gcloud services enable cloudaicompanion.googleapis.com --project=你的项目ID
    ```

- **等三五分钟**，云端权限变更才会在本机生效！

***

### 认证方式说明 (适用 macOS)

- **OAuth 认证**（通常 Mac 用户都选择，需有订阅/官方邀请）：  
  - 需生成 `~/.gemini/oauth_creds.json`  
  - 要配置 `~/.gemini/.env` 文件
  - 必须启用 `cloudaicompanion.googleapis.com`
  - 否则会频繁 `403`

- **API Key 认证**（需要自助申请 API Key）：  
  - 从 AI Studio 获取 API Key  
  - 设置后走 `generativelanguage.googleapis.com` 不必配置 Cloud 项目

***

### 配置检查清单（Mac 专属）

- `~/.gemini/oauth_creds.json` 已生成（OAuth认证）
- `~/.gemini/.env` 文件已设置、内容为正确的项目ID
- Gemini API 在 Google Cloud 控制台内已启用

***

### 常见问题与建议

- 终端（Terminal）可用但 Kilo Code 报错？一定要显式写 `.env`，Mac 的 VS Code APP 不会自动承接 shell 环境变量！
- 如果你 OAuth 凭证路径自定义，`.env` 也要放进 `~/.gemini/`
- 未订阅 Gemini Code Assist 时，API 用量可能单独计费

***

### 验证流程

- 在 Mac 终端输入 `gemini`，看 CLI 工作是否正常
- VS Code 中重启 Kilo Code，测试一个基本指令
- `gemini auth status` 检查认证

***

### 总结

在 macOS 下配置 VS Code 插件 Kilo Code 搭配 Gemini CLI 时，只要
- 正确配置 `~/.gemini/.env` 指定 Cloud 项目ID
- 云端启用 Gemini for Google Cloud API

即可让 CLI 与插件都无缝可用。如果还是报错，建议逐步核查账号类型、Google Cloud 权限与本地文件路径设置。

---