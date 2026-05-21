export default async function handler(req, res) {
  // 1. 限制请求方法
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. 解析前端传来的数据
  const { message, attackContext } = req.body;

  // 3. 获取环境变量中的 API Key
  // 注意：你在 Vercel 的 Environment Variables 里，名字必须叫 ZHIPU_API_KEY
  const apiKey = process.env.ZHIPU_API_KEY; 

  if (!apiKey) {
    return res.status(500).json({ reply: "系统错误：未在 Vercel 配置 ZHIPU_API_KEY 环境变量。" });
  }

  // 4. 构建系统提示词
  const systemPrompt = `你是 J.A.R.V.I.S，由天才开发者 Ethan 研发的边缘安全智能体。
你目前正作为核心安全模型运行在本地边缘节点上。
当前系统状态: ${attackContext}
请用客观、冷静、专业的极客语气回答，结合第一性原理给出安全排查建议。不要说废话。`;

  try {
    // 5. 调用大赛官方 Endpoint
    const response = await fetch('https://ai.synnovator.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 【关键修复】：这里必须用反引号 ` ，不能用单引号 ' 
        'Authorization': `Bearer ${apiKey}` 
      },
      body: JSON.stringify({
        model: "glm-5.1", // 大赛指定的模型代号
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.3,
        stream: false
      })
    });

    const data = await response.json();
    
    // 6. 正常返回大模型结果
    if (data.choices && data.choices.length > 0) {
      res.status(200).json({ reply: data.choices[0].message.content });
    } else {
      // 如果官方接口报错（比如额度用完、模型名不对），把错误信息抛给前端方便排查
      res.status(500).json({ reply: `云端API调用失败，官方返回信息: ${JSON.stringify(data)}` });
    }

  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ reply: "云端推理通道阻塞，请检查网络或 API 状态。" });
  }
}
