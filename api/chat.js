export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { message, attackContext } = req.body;

  const systemPrompt = `你是 J.A.R.V.I.S，由天才开发者 Ethan 研发的边缘安全智能体。
你目前正作为核心安全模型运行在本地边缘节点上。
当前系统状态：${attackContext}
请用客观、冷静、专业的语气回答，结合第一性原理给出安全排查建议。`;

  try {
     1. 替换为大赛官方的 Endpoint
    const response = await fetch('https://ai.synnovator.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        // 2. 替换为大赛指定的模型代号
        model: "glm-5.1", 
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.3,
        stream: false // 官方文档中特别写明了 stream: false
      })
    });
