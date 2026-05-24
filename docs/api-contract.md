# AirGap-EdgeGateway API 契约定义

> 本文档定义云端中控台与边缘网关之间的完整通信协议。  
> 核心实现代码因专利保护暂不开源，但协议定义完整公开以供验证。

---

## 1. MQTT 通信协议

### 指令下发 Topic: `airgap/cmd/down`

```json
{
  "action": "FUSE_WAN | RESTORE_WAN | QUERY_STATUS | TRIGGER_DEMO",
  "auth_token": "<声纹验证通过后颁发的15秒临时Token>",
  "timestamp": 1716550000,
  "requester": "WEB_DASHBOARD | VOICE_AGENT"
}
```

### 状态上报 Topic: `airgap/status/up`（1Hz心跳）

```json
{
  "cpu_load": 12.4,
  "core_temp": 42.2,
  "wan_status": "CONNECTED | FUSED | RECONNECTING",
  "relay_state": "CLOSED | OPEN | TRANSITIONING",
  "last_event": "SSH_BRUTE_FORCE | CPU_OVERLOAD | DDOS_FLOOD | MANUAL_FUSE",
  "uptime_sec": 3600,
  "timestamp": 1716550001
}
```

---

## 2. GPIO 控制协议

| 引脚 | 功能 | 触发条件 | 响应延迟 |
|---|---|---|---|
| GPIO 17 | 继电器控制（WAN断路） | CPU>90% 持续5s / 流量>阈值 / 手动指令 | <5ms |
| GPIO 27 | 状态指示灯（红色） | WAN处于FUSED状态时常亮 | <1ms |
| GPIO 22 | 状态指示灯（绿色） | 系统SECURE状态时常亮 | <1ms |

---

## 3. 声纹验证接口（本地离线）

```
输入：麦克风音频流（16kHz, 单声道）
处理：Resemblyzer → 256维特征向量 → 余弦相似度计算
阈值：≥ 0.72 → 通过，颁发临时Token（TTL: 15秒）
防回放：同步下发6位随机动态口令，要求15秒内声纹朗读
输出：{ "verified": true/false, "similarity": 0.987, "token": "xxxxx" }
```

---

## 4. 双路径指令路由逻辑

```
用户指令
    ├── 高频明确指令（开灯/关灯/断网）
    │       └── Fast-Path → 直接触发GPIO → 响应 <5ms
    │
    └── 复杂意图（如何处理攻击？/系统自检）
            └── AI-Path → Qwen2.5本地推理 → 响应 ~380ms
```

---

## 5. Mock 状态机状态转移图

```
SECURE → [攻击触发] → UNDER_ATTACK → [阈值超限] → FUSING → FUSED
  ↑                                                              |
  └──────────────── [声纹验证通过] ← RECOVERING ←───────────────┘
```
