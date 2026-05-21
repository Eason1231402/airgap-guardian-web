export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ reply: "请求方法错误，请使用 POST" });
  }

  const { message, attackContext } = req.body;
  
  // 获取环境变量
  const apikey = process.env.ZHIPU_API_KEY; 

  if (!apikey) {
    return res.status(200).json({ reply: "系统错误：未在 Vercel 配置 ZHIPU_API_KEY 环境变量。" });
  }

  // 使用最稳妥的字符串拼接，避开符号坑
  const systemPrompt = "你是 J.A.R.V.I.S，由天才开发者 Ethan 研发的边缘安全智能体。\n当前系统状态: " + attackContext + "\n请用客观、冷静、专业的极客语气回答，结合第一性原理给出安全排查建议。不要说废话。";

  try {
    const response = await fetch('https://ai.synnovator.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 【终极修复】：直接用加号拼接，绝对不会出错
        'Authorization': 'Bearer ' + apikey 
      },
      body: JSON.stringify({
        model: "glm-5.1",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.3,
        stream: false
      })
    });

    const data = await response.json();
    
    if (data.choices && data.choices.length > 0) {
      // 成功获取大模型回答
      res.status(200).json({ reply: data.choices[0].message.content });
    } else {
      // 官方接口报错，直接把错误信息显示在聊天框里
      res.status(200).json({ reply: "云端API调用失败，官方返回信息: " + JSON.stringify(data) });
    }

  } catch (error) {
    res.status(200).json({ reply: "云端推理通道阻塞，错误信息: " + error.message });
  }
}
