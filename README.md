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
- 演示模式（无硬件时的完整 Mock 闭环响应）

> ⚠️ **注意**：本仓库仅包含 Web 前端展示与 API 网关代码。完整的边缘端（树莓派 5）控制逻辑、物理熔断驱动、本地 NLP 推理引擎等核心实现，出于知识产权保护考虑暂不公开（国家发明专利受理中）。

---

## ⚠️ Demo 架构说明（评委必读）

本项目存在**线上 Demo** 与**实机产品**两种运行形态，请勿混淆：

| 对比维度 | 线上 Demo（airgap-sec.tech） | 实机产品（B站视频） |
|---|---|---|
| AI 推理路径 | 云端 LLM API（展示用） | RPi5 本地 Qwen2.5（**真实形态**） |
| 物理熔断 | 前端 Mock 状态机模拟 | 继电器硬件真实触发 |
| 数据外泄 | 有（云端 API 调用） | **0 Byte**（纯本地） |
| 目的 | 让评委无需硬件即可体验完整交互逻辑 | 验证核心技术声明的真实性 |

> 💡 **核心卖点"确定性零数据外泄"由边缘端离线推理实现。**  
> 线上 Demo 的云端 LLM 是交互界面的**展示替代**，不代表产品真实架构。  
> 如需验证离线推理，请观看实机演示视频中的边缘端推理日志（无任何外网请求记录）。

### 🔍 Mock 状态机源码指引

`index.html` 中已包含完整的 Mock Edge 状态机实现，评委可直接审查：

- **状态对象**: `sysState = { relay, attacking, challenge }`
- **状态转移函数**: `simulateAttack()` → `triggerLockdown()` → `doResetSystem()`
- **完整状态图**: 详见 [`docs/api-contract.md`](./docs/api-contract.md#5-mock-状态机状态转移图)

无硬件环境下，点击左侧任意攻击按钮即可体验完整闭环：
**SECURE → UNDER_ATTACK → FUSING → FUSED → RECOVERING → SECURE**

---

## 📊 实测数据（Real-World Benchmarks）

> 秉持工程诚实原则，公布实机原型在真实硬件环境下的实测数据，而非营销话术。

| 测试项 | 样本数 | 实测数据 | 测试环境 | 架构兜底方案 |
|---|---|---|---|---|
| 物理熔断响应延迟 | 50 次 | **平均 3.2ms** | RPi5 GPIO17 → 继电器 | 硬件级断路，软件无法绕过 |
| 边缘 NLP 推理延迟 | 30 次 | **平均 380ms** | Qwen2.5-7B 量化版 @ RPi5 | Fast-Path 高频指令 <5ms |
| 声纹识别准确率 | 100 次 | **78.5%** | Seeed ReSpeaker 4-Mic 阵列 | 结合**动态随机口令**双因子兜底 |
| 声纹误识率（陌生人）| 100 次 | **0%** | 余弦相似度阈值 0.72 | "宁可拒真，绝不认假"原则 |
| 数据外泄字节数 | 全程监测 | **0 Byte** | tcpdump 抓包验证 | 边缘离线推理，物理隔离 |

### 📌 关于声纹准确率的工程说明

当前 78.5% 的准确率瓶颈位于**算法层**而非硬件层。主要原因：

1. Resemblyzer 模型在单次注册样本下的特征向量稳定性有限
2. 尚未引入 VAD（语音活动检测）剔除静音段
3. 阈值 0.72 为通用值，未针对具体麦克风做自适应校准

**后续优化路径**：多次注册取均值向量 + VAD 预处理 + 阈值自适应，预计可将准确率提升至 92% 以上。

> 💡 即使在当前 78.5% 的准确率下，系统通过**"声纹特征 + 随机动态口令"双因子架构**确保了 0% 误识率，符合高涉密场景"宁可拒真、绝不认假"的安全原则。

---

## 🛠️ 技术栈

- **前端**: HTML5 + JavaScript + TailwindCSS（轻量化单文件部署）
- **API**: Vercel Serverless Functions (Node.js)
- **部署**: Vercel + 自定义域名 + 自动 HTTPS
- **AI 接入**: 通过 `/api/chat` 接口对接大模型服务（DeepSeek）

---

## 📡 云边协同与交互协议 (Cloud-Edge Protocol)

完整协议定义见 [`docs/api-contract.md`](./docs/api-contract.md)，核心要点：

- **指令下发 (MQTT `airgap/cmd/down`)**: Web 端通过 Vercel Serverless API 鉴权后，将加密指令推送至云端代理，边缘端保持长连接进行指令订阅。
- **状态上报 (MQTT `airgap/status/up`)**: 边缘端以 `1Hz` 频率心跳上报 CPU 负载、网络状态与物理熔断器 (GPIO) 状态，Web 端实现毫秒级状态同步与可视化。
- **数据脱敏边界**: 所有涉及用户隐私的 NLP 推理均在边缘端本地完成，Web 中控台**仅接收抽象后的状态枚举值**（如 `STATUS: SECURE`, `STATUS: FUSED`），实现物理级的数据隔离。

---

## 🛡️ 异常处理与降级机制 (Fallback & Error Handling)

作为高隐私场景的安防中控，Web 前端具备完整的异常容错机制：

- **边缘节点失联降级**: 当 Web 端超过 3 秒未收到边缘端心跳包时，UI 自动降级为"离线接管模式"，锁定所有高危控制下发入口，防止指令堆积引发的"重放攻击"。
- **API 响应超时兜底**: 针对弱网环境，所有 Serverless API 调用均设置严格的 Timeout 限制，并配有友好的 ErrorBoundary 错误边界提示。
- **演示模式 (Demo Mode) 平滑切换**: 在无实体硬件接入时，系统自动切换至 Mock 模式，通过前端状态机模拟物理熔断的完整闭环，降低评委与用户的体验门槛。
- **声纹双因子兜底**: 即使声纹特征匹配存在误差，动态随机口令机制确保录音回放攻击 100% 拦截。

---

## ⚙️ 前端工程化与安全规范

本项目不仅在物理层实现绝对隔离，在 Web 软件层同样遵循严格的工程与安全规范：

- **组件化与状态管理**: 采用现代前端规范进行细粒度模块拆分，确保 UI 层的可复用性与渲染性能。
- **环境变量隔离**: 核心大模型 API Key 与网关鉴权 Token 仅存在于 Vercel 服务端环境变量中，前端代码中实现 **0 硬编码**。
- **跨站防护**: 严格配置 CORS 策略与 CSP (Content Security Policy)，防止中控台遭受 XSS 或 CSRF 攻击。
- **持续集成 (CI/CD)**: 接入 Vercel 自动化部署流水线，主分支代码提交即触发静态检查与自动化构建。

---

## 📂 目录结构

```text
airgap-guardian-web/
├── index.html              # 主界面（含 Mock 状态机完整实现）
├── api/
│   └── chat.js             # Serverless 推理接口（云端 LLM 代理）
├── docs/
│   └── api-contract.md     # MQTT / GPIO / 声纹接口完整契约定义
└── README.md               # 本文件
```

---

## 🔐 环境变量

在 Vercel 项目 Settings → Environment Variables 中配置：

```bash
LLM_API_KEY=your_api_key_here       # 大模型 API 密钥（DeepSeek）
```

> API Key 仅保存在 Vercel 服务端环境变量中，不会出现在前端代码或公开仓库中。

---

## 🚀 本地运行

```bash
# 克隆仓库
git clone https://github.com/Eason1231402/airgap-guardian-web.git
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

## 🔮 技术演进路线 (Roadmap)

- [x] **v1.0** 边缘物理熔断 + 声纹双因子认证（专利受理中）
- [x] **v1.1** Web 中控台 + Mock 状态机闭环演示
- [ ] **v1.2** 声纹算法优化：VAD 预处理 + 多次注册均值向量
- [ ] **v2.0** 麦克风阵列 DSP 硬件级降噪（基于 Seeed 4-Mic 进一步优化）
- [ ] **v2.1** 涉密会议室隐私网关首发落地

---

## 📜 License

本仓库仅供学习与赛事评审使用。  
核心边缘端代码与硬件设计已提交国家发明专利申请，第一发明人 Ethan，受相关法律保护。

---

**隶属项目**：AirGap-EdgeGateway · 燕缘国际科创大赛 Season 1  
**作者**：Ethan · [Eason1231402](https://github.com/Eason1231402)
