export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { message, attackContext, relayStatus } = req.body;

  const systemPrompt = `你是 J.A.R.V.I.S，由天才开发者 Ethan（陈昱全）研发的边缘可信中控系统智能体。
运行于 Raspberry Pi 5 + RTX 4060 边缘节点，采用双路径异构拓扑与硬件级物理气隙技术。
当前系统状态：${attackContext}，继电器状态：${relayStatus}。
回答要求：专业、冷静、简洁，结合第一性原理，给出具体可执行的安全建议。回复使用中文，不超过200字。`;

  // 如果用阿里云 Qwen，替换 fetch 部分即可：
const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json', 
    'Authorization': `Bearer ${process.env.LLM_API_KEY}` 
  },
  body: JSON.stringify({ 
    model: 'qwen-turbo', // 或者 qwen-plus
    messages: [
      { role: 'system', content: systemPrompt }, 
      { role: 'user', content: message }
    ], 
    temperature: 0.4 
  })
});
