---
title: 'Proxmox VE下实现虚拟机（Guest OS）宕机后自动重启的问题'
description: '前言：为什么需要这个功能？ 作为 Proxmox VE (PVE) 用户，我们都享受着它带来的强大虚拟化能力。但一个常见的痛点是：PVE 主机本身稳定如山，可里面的某台虚拟机（Guest OS）却可能因为应用 Bug、内存溢出或内核崩溃而陷入“假死”状态。此时，虚拟机进程在 PVE 上看是运行的，但...'
author: 'jue'
date: 2025-08-22
lastUpdated: 2025-09-02
category: 'Tech Talk'
cover: 'https://github.com/user-attachments/assets/ca3655dd-9bac-411c-9baa-ecb0e6262c0b'
wordCount: 1752
issue_number: 3
---
#### 前言：为什么需要这个功能？

作为 Proxmox VE (PVE) 用户，我们都享受着它带来的强大虚拟化能力。但一个常见的痛点是：PVE 主机本身稳定如山，可里面的某台虚拟机（Guest OS）却可能因为应用 Bug、内存溢出或内核崩溃而陷入“假死”状态。此时，虚拟机进程在 PVE 上看是运行的，但其内部系统已经停止响应，导致服务中断。

手动登录 PVE 然后重启虚拟机固然可以解决，但这显然不够自动化和高可用。本教程将带你从零开始，构建一个稳定可靠的“哨兵”系统，让 PVE 能够自动侦测到虚拟机的“假死”状态，并果断执行重启操作，实现服务的自动恢复。

<img width="3840" height="2160" alt="Image" src="https://github.com/user-attachments/assets/ca3655dd-9bac-411c-9baa-ecb0e6262c0b" />

#### 核心思路

我们的目标分为两大步：

1.  **建立“生命线”**：在 PVE 主机和虚拟机之间建立一条可靠的通信渠道。这样 PVE 才能准确“感知”到虚拟机内部的真实状态。我们将使用官方推荐的 **QEMU Guest Agent** 来实现。
2.  **创建“哨兵”**：在 PVE 主机上部署一个监控脚本。这个脚本会定期通过“生命线”去探测虚拟机，如果发现对方没有回应，就立即执行重启命令。

-----

### 第一部分：建立“生命线” - 配置 QEMU Guest Agent

这是整个系统最关键的基础。只有通信顺畅，后续的监控才有意义。

#### 步骤 1: 在 Ubuntu 虚拟机内部安装 Agent

首先，我们需要在被监控的虚拟机（以 Ubuntu 为例）内部安装代理程序。

1.  通过 SSH 或 PVE 控制台登录您的 Ubuntu 虚拟机。
2.  执行以下命令安装 `qemu-guest-agent`：
    ```bash
    sudo apt update
    sudo apt install qemu-guest-agent
    ```
3.  安装后，启用并启动该服务：
    ```bash
    sudo systemctl enable qemu-guest-agent
    sudo systemctl start qemu-guest-agent
    ```
4.  检查服务状态，确保其显示 `active (running)`：
    ```bash
    sudo systemctl status qemu-guest-agent
    ```

#### 步骤 2: 在 PVE 中为虚拟机启用 Agent 功能

现在，回到 PVE 主机，告诉它去使用虚拟机里的这个 Agent。

1.  在 PVE Web 界面，**彻底关闭** 您的虚拟机。这一步非常重要，很多配置无法在运行时修改。
2.  选中虚拟机，进入 `Hardware`（硬件）标签页。点击 `Add`（添加），然后选择 `Guest Agent`。使用默认设置添加即可。
3.  切换到 `Options`（选项）标签页，找到 `QEMU Guest Agent` 这一项，双击编辑，勾选 `Enabled`（启用）。

**强烈推荐：更稳定可靠的一步到位命令行方法**

为了避免 Web 界面的各种缓存或显示问题，可以直接在 **PVE 主机** 的 Shell 中执行一条命令来完成上述所有 PVE 侧的配置。这条命令会强制使用最高效的 `virtio` 通信方式。

```bash
# 将 101 替换成你的虚拟机 ID
qm set 101 --agent enabled=1,type=virtio
```

#### 步骤 3: 验证“生命线”是否通畅

完成以上配置后，启动您的虚拟机。等待启动完成后，在 PVE 界面选中该虚拟机，查看 `Summary`（概要）页面。

  * **成功标志**：在 "IPs" 区域，您能清楚地看到虚拟机的 IP 地址。
  * **失败标志**：您会看到红字的提示 "Guest Agent not running"。

如果看到成功标志，恭喜您，最困难的部分已经完成！可以跳到第二部分。如果失败，请参阅文末的“疑难解答”部分。

-----

### 第二部分：创建“哨兵” - 部署监控重启脚本

现在“生命线”已经打通，我们可以部署哨兵来站岗了。

#### 步骤 1: 在 PVE 主机上创建脚本

1.  登录到您的 **PVE 主机** 的 Shell（不是虚拟机）。

2.  创建一个新的脚本文件：

    ```bash
    nano /usr/local/bin/vm-watchdog.sh
    ```

3.  将以下脚本内容完整复制进去。**请记得修改 `VMID` 和 `VMNAME` 为您自己的虚拟机信息**。

    ```bash
    #!/bin/bash

    # --- 请修改为您的虚拟机信息 ---
    VMID=101
    VMNAME="ubuntu-dev"
    # ---------------------------

    # 日志文件路径
    LOG_FILE="/var/log/vm-watchdog.log"

    # 通过 Guest Agent ping 虚拟机，设置5秒超时
    # 2>/dev/null 的作用是忽略掉命令执行中可能出现的错误信息，只关心返回值
    agent_status=$(timeout 5 qm agent ${VMID} ping 2>/dev/null)

    # 检查 ping 的结果
    if [[ "$agent_status" == *"error"* || "$agent_status" == "" ]]; then
        # 如果 Agent 返回错误或因超时导致结果为空，则认为 VM 宕机
        echo "$(date): Watchdog detected ${VMNAME} (ID: ${VMID}) is down. Attempting to reboot." >> ${LOG_FILE}
        
        # 使用 reset 命令强制重启虚拟机，这比 stop/start 更有效
        qm reset ${VMID} --force
        
        echo "$(date): Reboot command sent to ${VMNAME} (ID: ${VMID})." >> ${LOG_FILE}
    else
        # VM 正常，不做任何事，也可以取消下面一行的注释来记录健康检查日志
        # echo "$(date): Watchdog checked ${VMNAME} (ID: ${VMID}). Status: OK." >> ${LOG_FILE}
        :
    fi

    exit 0
    ```

#### 步骤 2: 授权并自动化

1.  为脚本添加可执行权限：
    ```bash
    chmod +x /usr/local/bin/vm-watchdog.sh
    ```
2.  设置一个定时任务 (Cron Job)，让系统每分钟自动运行一次这个脚本：
    ```bash
    crontab -e
    ```
3.  在文件的最末尾，添加新的一行并保存退出：
    ```
    * * * * * /usr/local/bin/vm-watchdog.sh
    ```

至此，整个哨兵系统已经部署完毕！它会从此开始，年复一年、日复一日地为您守护虚拟机的稳定运行。

-----

### 疑难解答 (Troubleshooting)

我们在配置过程中也遇到了很多“坑”，这里总结出来，希望能帮助你节省时间：

1.  **问题：PVE 概要页显示 "Guest Agent not running"**

      * **原因 A**：您没有在**关机状态**下为虚拟机配置 Agent。PVE 的很多硬件相关设置需要关机才能生效。
      * **原因 B**：虚拟机内部的 `qemu-guest-agent` 服务没有成功运行。请登录虚拟机执行 `sudo systemctl status qemu-guest-agent` 查看具体错误。

2.  **问题：虚拟机内部服务报错，找不到 `/dev/virtio-ports/org.qemu.guest_agent.0`**

      * 这是最核心的问题！它意味着 PVE 没有成功地为虚拟机创建 VirtIO 通信设备。**根本原因**通常是 PVE 侧的 Agent 配置没有被正确应用。
      * **最佳解决方案**：彻底关闭虚拟机，然后在 PVE 主机 Shell 中执行 `qm set 你的VMID --agent enabled=1,type=virtio`，再开机。这条命令会强制以正确的方式创建通信渠道。

3.  **问题：Web 界面 `Hardware -> Add` 菜单里找不到 `Guest Agent` 选项**

      * 99% 的可能性是您的虚拟机正在运行。请先将其**彻底关机**再尝试。

#### 结语

通过 QEMU Guest Agent 与一个简单的 Cron 脚本相结合，我们为 Proxmox VE 构建了一套轻量、稳定且高效的虚拟机健康监控和自动恢复机制。它虽然不能防止应用本身出错，但却能在系统层面发生灾难性故障时，第一时间介入处理，大大提高了服务的可用性。希望这篇教程能对你有所帮助！