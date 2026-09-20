// ⚠️ 占位实现（仅用于前端联调流式管线）
// 核心 AI 逻辑由黄锦浩按作战手册 §8.2 自行实装，替换点已标注：
//   1. 用 bge-m3 把 question 向量化，余弦召回知识库 Top-3（lib 里新建 rag/ 模块）
//   2. 拼 Prompt（含引用来源 + "只准基于资料回答"约束）
//   3. 用 Vercel AI SDK 的 streamText({ model, messages }) 替换下方手动流
// 数据流：前端 POST → 召回 Top-3 → 拼 Prompt → streamText 逐字流回
export const runtime = 'nodejs'

const DEMO_ANSWER =
  '这是占位流式回复：RAG 检索与 LLM 流式输出将由团队自行实装（bge-m3 余弦召回 Top-3 → 拼 Prompt → streamText）。'

export async function POST(req: Request) {
  const { question } = (await req.json()) as { question?: string }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      const text = question ? `${DEMO_ANSWER}（收到问题：${question}）` : DEMO_ANSWER
      for (const ch of text) {
        controller.enqueue(encoder.encode(ch))
        await new Promise((r) => setTimeout(r, 25))
      }
      controller.close()
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
