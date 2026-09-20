'use client'

import { useEffect, useState } from 'react'
import problems from '@/lib/data/daily-problems.json'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// 每日一题数据（与三班平台 dailyProblems 同构）
interface Problem {
  title: string
  diff: 'easy' | 'medium' | 'hard'
  tags: string[]
  desc: string
  hint: string
  link: string
}

const DIFF = {
  easy: { label: '简单', cls: 'bg-emerald-500/15 text-emerald-300' },
  medium: { label: '中等', cls: 'bg-amber-500/15 text-amber-300' },
  hard: { label: '困难', cls: 'bg-red-500/15 text-red-300' },
} as const

// 每日一题：按年积天轮换（与平台同一套题库，31 题）
export default function DailyProblem() {
  const [p, setP] = useState<Problem | null>(null)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    const now = new Date()
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000)
    setP((problems as Problem[])[dayOfYear % problems.length])
  }, [])

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">💡 每日一题</CardTitle>
        <CardDescription>来自三班平台题库 · 每天轮换一道 · 共 {problems.length} 题</CardDescription>
      </CardHeader>
      <CardContent>
        {!p ? (
          <div className="h-40 animate-pulse rounded-xl bg-slate-800/40" />
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-lg font-bold text-slate-100">{p.title}</h4>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${DIFF[p.diff].cls}`}>{DIFF[p.diff].label}</span>
              {p.tags.map((t) => (
                <span key={t} className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">{p.desc}</p>
            {showHint && (
              <p className="mt-3 rounded-lg border border-cyan-400/20 bg-cyan-500/5 px-3 py-2 text-xs leading-5 text-cyan-200">
                💬 提示：{p.hint}
              </p>
            )}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setShowHint((v) => !v)}
                className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10"
              >
                {showHint ? '收起提示' : '看提示'}
              </button>
              <a
                href={p.link}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-cyan-500/90 px-3 py-1.5 text-xs font-medium text-slate-950 hover:bg-cyan-400"
              >
                去力扣作答 →
              </a>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
