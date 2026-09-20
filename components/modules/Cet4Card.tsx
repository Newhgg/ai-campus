'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// 与 public/cet4.html 共享的 localStorage 键（同源共享进度）
const PROG_KEY = 'cet4_progress_v1'
const STATS_KEY = 'cet4_stats_v1'
const TOTAL = 3320 // cet4.json 实际词数

// 四级词汇卡：SVG 进度环可视化（已学/已掌握），点击进入三班平台同款 3D 翻卡打卡页
export default function Cet4Card() {
  const [s, setS] = useState<{ learned: number; mastered: number } | null>(null)

  useEffect(() => {
    try {
      const prog = JSON.parse(localStorage.getItem(PROG_KEY) || '{}')
      const stats = JSON.parse(localStorage.getItem(STATS_KEY) || '{}')
      setS({ learned: Object.keys(prog).length, mastered: stats.mastered || 0 })
    } catch {
      setS({ learned: 0, mastered: 0 })
    }
  }, [])

  const learned = s?.learned ?? 0
  const mastered = s?.mastered ?? 0
  const pct = Math.min(100, (learned / TOTAL) * 100)
  const R = 52
  const C = 2 * Math.PI * R

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">📘 四级词汇打卡</CardTitle>
        <CardDescription>艾宾浩斯记忆 · 与三班平台进度同源共享</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-5">
        <svg viewBox="0 0 120 120" className="h-28 w-28 shrink-0 -rotate-90">
          <circle cx="60" cy="60" r={R} fill="none" stroke="#1e293b" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${(pct / 100) * C} ${C}`}
          />
        </svg>
        <div className="min-w-0 flex-1 space-y-1 text-sm">
          <p className="text-slate-300">
            已学 <b className="text-sky-300">{learned}</b> / {TOTAL} 词（{pct.toFixed(1)}%）
          </p>
          <p className="text-slate-300">
            已掌握 <b className="text-emerald-300">{mastered}</b> 词
          </p>
          <p className="text-slate-500">
            剩余 {Math.max(0, TOTAL - learned)} 词
          </p>
          <a
            href="/cet4.html"
            className="mt-2 inline-block rounded-lg bg-cyan-500/90 px-3 py-1.5 text-xs font-medium text-slate-950 hover:bg-cyan-400"
          >
            进入打卡 →
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
