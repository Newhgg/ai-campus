'use client'

import { useState } from 'react'
import feishu from '@/lib/data/feishu_data.json'
import {
  classifyNotice,
  templateRewrite,
  type ClassifiedNotice,
} from '@/lib/office/notice-engine'
import NoticeArchive from './NoticeArchive'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface WorkItem extends ClassifiedNotice {
  status: 'inbox' | 'archived'
  rewrite?: { engine: string; text: string }
}

// 种子数据：飞书同步的真实通知（update_time 为其真实日期）
function seedItems(): WorkItem[] {
  return (feishu.notices as Record<string, string>[])
    .map((n, i) =>
      classifyNotice(
        { id: `fs-${i}`, title: n['标题'], content: n['内容'], source: n['发布人'], date: '2026-08-29' },
        i + 1
      )
    )
    .map((c) => ({ ...c, status: 'inbox' as const }))
}

// 办公楼通知工作台：整理（自动分类/关键信息/归档号）→ 转群发（Ollama 27b，模板兜底）→ 归档
// 数据流：原始通知 → 转群发 → 复制到班级群 → 归档进分类柜
export default function NoticeWorkbench() {
  const [items, setItems] = useState<WorkItem[]>(seedItems)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const inbox = items.filter((x) => x.status === 'inbox')
  const archived = items.filter((x) => x.status === 'archived')

  // 转群发：走 API（Ollama），失败本地模板兜底（Pages 静态版无后端也能用）
  async function rewrite(id: string) {
    const it = items.find((x) => x.id === id)!
    setLoadingId(id)
    let next: WorkItem = it
    try {
      const r = await fetch('/api/office/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: it.title, content: it.content, source: it.source, ...it.keyInfo }),
      })
      if (!r.ok) throw new Error()
      const data = await r.json()
      next = { ...it, rewrite: { engine: data.engine, text: data.text } }
    } catch {
      next = { ...it, rewrite: { engine: 'template(本地兜底)', text: templateRewrite(it, it.keyInfo) } }
    }
    setItems((arr) => arr.map((x) => (x.id === id ? next : x)))
    setLoadingId(null)
  }

  function archive(id: string) {
    setItems((arr) => arr.map((x) => (x.id === id ? { ...x, status: 'archived' } : x)))
  }

  async function copy(id: string) {
    const it = items.find((x) => x.id === id)!
    await navigator.clipboard.writeText(it.rewrite?.text || '')
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  return (
    <div className="space-y-4">
      {/* 收件箱 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">🗂️ 通知工作台</CardTitle>
          <CardDescription>
            自动整理：分类 · 紧急度 · 关键信息抽取 · 归档编号 ｜ 转群发：本地 27b 改写，模板兜底（不编造）
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {inbox.map((it) => (
            <div key={it.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-700/60 px-2 py-0.5 text-[10px] text-slate-300">{it.category}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] ${
                    it.urgency === '紧急' ? 'bg-red-500/15 text-red-300' : it.urgency === '重要' ? 'bg-amber-500/15 text-amber-300' : 'bg-slate-700/60 text-slate-300'
                  }`}
                >
                  {it.urgency}
                </span>
                <h4 className="text-sm font-medium text-slate-100">{it.title}</h4>
                <span className="ml-auto text-[10px] text-slate-500">{it.archiveNo}</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                {it.source}：{it.content}
              </p>
              <p className="mt-1.5 text-[10px] text-slate-500">
                识别 → {[it.keyInfo.time, it.keyInfo.place, it.keyInfo.deadline].filter(Boolean).join(' · ') || '未识别到关键项'}
              </p>

              {!it.rewrite ? (
                <button
                  onClick={() => rewrite(it.id)}
                  disabled={loadingId === it.id}
                  className="mt-3 rounded-lg bg-cyan-500/90 px-3 py-1.5 text-xs font-medium text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
                >
                  {loadingId === it.id ? 'AI 转写中…（首次约 20s）' : '✍️ 转成群发通知'}
                </button>
              ) : (
                <div className="mt-3">
                  <p className="text-[10px] text-slate-500">引擎：{it.rewrite.engine}</p>
                  <pre className="mt-1.5 whitespace-pre-wrap rounded-lg border border-cyan-400/20 bg-cyan-500/5 p-3 text-xs leading-5 text-cyan-100">
                    {it.rewrite.text}
                  </pre>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => copy(it.id)}
                      className="rounded-lg bg-cyan-500/90 px-3 py-1.5 text-xs font-medium text-slate-950 hover:bg-cyan-400"
                    >
                      {copiedId === it.id ? '✓ 已复制' : '复制发群'}
                    </button>
                    <button
                      onClick={() => archive(it.id)}
                      className="rounded-lg border border-white/20 px-3 py-1.5 text-xs text-slate-100 hover:bg-white/10"
                    >
                      归档 →
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 归档柜 */}
      <NoticeArchive items={archived} />
    </div>
  )
}
