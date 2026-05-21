// api/chat.js 极简部署代码
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { message, attackContext } = req.body;

  const systemPrompt = `你是 J.A.R.V.I.S，由天才开发者 Ethan 研发的边缘安全智能体。
你目前正作为 Qwen2.5 7B 模型运行在本地边缘节点上。
当前系统状态：${attackContext}
请用客观、冷静、专业的语气回答，结合第一性原理给出安全排查建议。`;

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${process.env.LLM_API_KEY}` // Vercel 环境变量
      },
      body: JSON.stringify({ 
        model: 'deepseek-chat', 
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
    res.status(500).json({ reply: "边缘算力节点响应超时，请检查网络。" });
  }
}
