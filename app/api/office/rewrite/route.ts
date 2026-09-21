// 通知转群发接口：本地 Ollama 27b 改写（保留全部关键信息，禁止编造）
// 数据流：POST 原始通知 → Ollama 生成 → 失败/超时自动降级 templateRewrite 模板兜底
import { NextResponse } from 'next/server'
import { templateRewrite } from '@/lib/office/notice-engine'

export const runtime = 'nodejs'

const MODEL = process.env.OLLAMA_CHAT_MODEL || 'qwen3.8:27b-q4_K_M'
const BASE = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434'

// 转写指令：只许改写不许编造，这条是答辩里「怎么保证不胡说」的答案
function buildPrompt(title: string, content: string, source: string) {
  return [
    '你是大学班级的班委。把下面的老师/领导通知改写成适合发到班级群的简洁通知。',
    '要求：1) 保留全部关键信息（时间/地点/要求/截止），绝不编造；2) 以「同学们」开头，语气友好；3) 150 字以内，用换行分要点；4) 直接输出通知正文，不要任何解释。',
    `原始通知（来自${source}）：`,
    `标题：${title}`,
    `内容：${content}`,
  ].join('\n')
}

export async function POST(req: Request) {
  const { title, content, source, time, place, deadline } = await req.json()
  try {
    const r = await fetch(`${BASE}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(60000),
      body: JSON.stringify({
        model: MODEL,
        prompt: buildPrompt(title, content, source),
        stream: false,
        think: false,
        options: { num_predict: 400, temperature: 0.4 },
      }),
    })
    if (!r.ok) throw new Error(`ollama ${r.status}`)
    const data = await r.json()
    const text = String(data.response || '').trim()
    if (!text) throw new Error('empty response')
    return NextResponse.json({ engine: `ollama:${MODEL}`, text })
  } catch {
    // 兜底：规则模板（离线/静态部署也能用，零幻觉）
    const text = templateRewrite({ id: '', title, content, source }, { time, place, deadline })
    return NextResponse.json({ engine: 'template', text })
  }
}
