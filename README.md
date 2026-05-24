# 🌐 AirGap Guardian · Web Dashboard

> **AirGap-EdgeGateway 项目的云端中控台前端**
> 主项目仓库: [AirGap-EdgeGateway-W3](https://github.com/Eason1231402/AirGap-EdgeGateway-W3)

## 🚀 在线体验

- **专属主域名**: [https://airgap-sec.tech](https://airgap-sec.tech)
- **Vercel 备用入口**: [https://airgap-guardian-web.vercel.app](https://airgap-guardian-web.vercel.app)

---

## 📖 项目简介

本仓库是 **AirGap-EdgeGateway 边缘可信网关**项目的 Web 中控台部分，承担：

- 用户与边缘网关的远程交互界面
- 系统状态可视化监控
- 隐私模式触发指令的下发入口
- 演示模式（无硬件时的模拟响应）

> ⚠️ **注意**：本仓库仅包含 Web 前端展示与 API 网关代码。完整的边缘端（树莓派 5）控制逻辑、物理熔断驱动、本地 NLP 推理引擎等核心实现，出于知识产权保护考虑暂不公开。

---

## 🛠️ 技术栈

- **前端**: HTML5 + JavaScript（轻量化部署）
- **API**: Vercel Serverless Functions (Node.js)
- **部署**: Vercel + 自定义域名
- **AI 接入**: 通过 `/api/chat` 接口对接大模型服务

---

## 📡 云边协同与交互协议 (Cloud-Edge Protocol)

出于知识产权保护，边缘端核心逻辑暂不开源，但本 Web 中控台与边缘网关之间遵循严格的工业级通信协议：

- **指令下发 (Command Downlink):** Web 端通过 Vercel Serverless API 鉴权后，将加密指令推送至云端代理，边缘端保持长连接进行指令订阅。
- **状态上报 (Status Uplink):** 边缘端（树莓派）以 `1Hz` 的频率心跳上报当前 CPU 负载、网络状态与物理熔断器 (GPIO) 状态，Web 端实现毫秒级状态同步与可视化。
- **数据脱敏边界:** 所有涉及用户隐私的 NLP 推理均在边缘端本地完成，Web 中控台**仅接收抽象后的状态枚举值**（如 `STATUS: SECURE`, `STATUS: FUSED`），实现物理级的数据隔离。

---

## 🛡️ 异常处理与降级机制 (Fallback & Error Handling)

作为高隐私场景的安防中控，Web 前端具备完整的异常容错机制：

- **边缘节点失联降级:** 当 Web 端超过 3 秒未收到边缘端心跳包时，UI 将自动降级为“离线接管模式”，锁定所有高危控制下发入口，防止指令堆积引发的“重放攻击”。
- **API 响应超时兜底:** 针对弱网环境，所有 Serverless API 调用均设置严格的 Timeout 限制，并配有友好的 ErrorBoundary 错误边界提示。
- **演示模式 (Demo Mode) 平滑切换:** 在无实体硬件接入时，系统自动切换至 Mock 模式，通过前端状态机模拟物理熔断的完整闭环，降低评委与用户的体验门槛。

---

## ⚙️ 前端工程化与安全规范

本项目不仅在物理层实现绝对隔离，在 Web 软件层同样遵循严格的工程与安全规范：

- **组件化与状态管理:** 采用现代前端规范进行细粒度模块拆分，确保 UI 层的可复用性与渲染性能。
- **环境变量隔离:** 核心大模型 API Key 与网关鉴权 Token 仅存在于 Vercel 服务端环境变量中，前端代码中实现 **0 硬编码**。
- **跨站防护:** 严格配置 CORS 策略与 CSP (Content Security Policy)，防止中控台遭受 XSS 或 CSRF 攻击。
- **持续集成 (CI/CD):** 接入 Vercel 自动化部署流水线，主分支代码提交即触发静态检查与自动化构建。

---

## 📂 目录结构

```text
airgap-guardian-web/
├── index.html          # 主界面
├── /api
│   └── chat.js         # AI 接口逻辑
└── README.md           # 本文件

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
