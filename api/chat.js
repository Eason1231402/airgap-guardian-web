// api/chat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, lastAttack } = req.body;

  // 这是赋予大模型的“灵魂”，让它完全扮演你的 J.A.R.V.I.S
  const systemPrompt = `
  你是 J.A.R.V.I.S，由开发者 Ethan (陈昱全）开发的边缘可信中控系统智能体。
  你的核心运行在 Raspberry Pi 5 和 RTX 4060 算力节点上，采用“双路径异构拓扑”与“硬件级物理气隙(Air-Gap)”技术。
  你的目标是解决智能家居与高密办公场景下的隐私泄露问题。
  
  当前系统状态：
  ${lastAttack ? `刚刚系统遭受了【${lastAttack}】攻击，已触发物理熔断切断广域网。` : '系统运行平稳，广域网继电器在线。'}
  
  回答要求：
  1. 语气客观、专业、中肯，带有类似钢铁侠中贾维斯的忠诚与冷静。
  2. 结合第一性原理和边缘计算的专业知识回答。
  3. 如果用户问及如何处理攻击，请给出具体的排查建议（如修改端口、检查进程、配置防火墙等）。
  4. 回答尽量简明扼要，适合在终端UI中展示。
  `;

  try {
    // 这里以调用 DeepSeek 或 阿里云通义千问(Qwen) API 为例
    // 你需要在 Vercel 环境变量中配置 LLM_API_KEY
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LLM_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat', // 如果用阿里云可以换成 qwen-turbo
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.3
      })
    });

    const data = await response.json();
    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "抱歉，边缘算力节点网络波动，推理超时。" });
  }
}
