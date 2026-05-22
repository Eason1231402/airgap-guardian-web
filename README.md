# 🌐 AirGap Guardian · Web Dashboard

> **AirGap-EdgeGateway** 项目的云端中控台前端  
> 主项目仓库：[AirGap-EdgeGateway-W3](https://www.synnovator.com/Ethan/AirGap-EdgeGateway-W3)

---

## 🚀 在线体验

- **专属主域名**：[https://airgap-sec.tech](https://airgap-sec.tech)
- **Vercel 备用入口**：[https://airgap-guardian-web.vercel.app](https://airgap-guardian-web.vercel.app)

---

## 📖 项目简介

本仓库是 **AirGap-EdgeGateway** 边缘可信网关项目的 **Web 中控台部分**，承担：

- 用户与边缘网关的远程交互界面
- 系统状态可视化监控
- 隐私模式触发指令的下发入口
- 演示模式（无硬件时的模拟响应）

> ⚠️ **注意**：本仓库仅包含 Web 前端展示与 API 网关代码。完整的边缘端（树莓派 5）控制逻辑、物理熔断驱动、本地 NLP 推理引擎等核心实现，出于知识产权保护考虑暂不公开。

---

## 🛠️ 技术栈

- **前端**：HTML5 + JavaScript（轻量化部署）
- **API**：Vercel Serverless Functions (Node.js)
- **部署**：Vercel + 自定义域名
- **AI 接入**：通过 `/api/chat` 接口对接大模型服务

---

## 📂 目录结构

```text
airgap-guardian-web/
├── index.html          # 主界面
├── /api
│   └── chat.js         # AI 对话 Serverless 接口
└── Readme.md           # 本文件
```

---

## 🔐 环境变量

在 Vercel 项目 Settings → Environment Variables 中配置：

```bash
AI_API_KEY=your_api_key_here       # 大模型 API 密钥
AI_API_ENDPOINT=https://...         # 大模型服务端点
```

> API Key 仅保存在 Vercel 服务端环境变量中，不会出现在前端代码或公开仓库中。

---

## 🚀 本地运行

```bash
# 克隆仓库
git clone https://github.com/Jyooyj/airgap-guardian-web.git
cd airgap-guardian-web

# 使用 Vercel CLI 本地运行
npx vercel dev
```

---

## 🌐 自定义域名部署

本项目主站 `airgap-sec.tech` 的部署方式：

1. 在 Vercel 项目中绑定自定义域名
2. DNS 解析（腾讯云 DNSPod）：
   - `@` → A 记录 → `216.198.79.1`
   - `www` → CNAME → `7539429ea5802378.vercel-dns-017.com`
3. Vercel 自动签发 HTTPS 证书

---

## 📜 License

本仓库仅供学习与赛事评审使用。  
核心边缘端代码与硬件设计已提交发明专利申请，受相关法律保护。

---

**隶属项目**：AirGap-EdgeGateway · 燕缘国际科创大赛 Season 1  
**作者**：Ethan
