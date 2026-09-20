'use client'

import { useEffect, useState } from 'react'
import schedule from '@/lib/data/wakeup-schedule.json'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// 课表数据类型（与三班平台 window.WAKEUP_SCHEDULE 同构）
interface Course {
  name: string
  teacher: string
  room: string
  day: number
  startTime: string
  endTime: string
  weeks: number[]
  weeksStr: string
}

const PALETTE = ['#38bdf8', '#f472b6', '#34d399', '#fbbf24', '#a78bfa', '#fb923c', '#22d3ee', '#f87171', '#4ade80', '#e879f9']
const WEEK_CN = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日']

function courseColor(name: string) {
  let h = 0
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 997
  return PALETTE[h % PALETTE.length]
}

// 计算今天 + 当前教学周的课程（真实数据源：三班平台 WakeUp 课表）
function calc() {
  const now = new Date()
  const start = new Date(schedule.startDate + 'T00:00:00')
  const week = Math.min(schedule.maxWeek, Math.max(1, Math.floor((now.getTime() - start.getTime()) / 604800000) + 1))
  const weekday = ((now.getDay() + 6) % 7) + 1 // 周一=1 … 周日=7
  const today = (schedule.courses as Course[]).filter((c) => c.day === weekday && c.weeks.includes(week))
  return { week, weekday, today, date: `${now.getMonth() + 1}/${now.getDate()}` }
}

// 今日课表时间轴：左侧时间、色条区分课程
export default function TodaySchedule() {
  const [d, setD] = useState<ReturnType<typeof calc> | null>(null)
  useEffect(() => setD(calc()), [])

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">⏰ 今日课表</CardTitle>
        <CardDescription>
          {d ? `第 ${d.week} 教学周 · ${WEEK_CN[d.weekday]}（${d.date}） · 数据来自三班平台真实课表` : '计算中…'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!d ? (
          <div className="h-32 animate-pulse rounded-xl bg-slate-800/40" />
        ) : d.today.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">今天没有课，去图书馆自习吧 📖</p>
        ) : (
          <ul className="space-y-2.5">
            {d.today.map((c, i) => (
              <li key={i} className="flex gap-3">
                <div className="w-24 shrink-0 pt-0.5 text-right text-xs text-slate-400">
                  {c.startTime}
                  <br />
                  {c.endTime}
                </div>
                <div className="w-1 shrink-0 rounded" style={{ background: courseColor(c.name) }} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-100">{c.name}</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {c.teacher} · {c.room}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
