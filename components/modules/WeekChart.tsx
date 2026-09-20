'use client'

import { useEffect, useState } from 'react'
import schedule from '@/lib/data/wakeup-schedule.json'
import EChart from './EChart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const WEEK_CN = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

// 本周每日报课节数柱状图（真实课表按当前教学周过滤）
export default function WeekChart() {
  const [option, setOption] = useState<Record<string, unknown> | null>(null)

  useEffect(() => {
    const now = new Date()
    const start = new Date(schedule.startDate + 'T00:00:00')
    const week = Math.min(schedule.maxWeek, Math.max(1, Math.floor((now.getTime() - start.getTime()) / 604800000) + 1))
    const counts = WEEK_CN.map((_, i) =>
      (schedule.courses as { day: number; weeks: number[] }[]).filter((c) => c.day === i + 1 && c.weeks.includes(week)).length
    )
    setOption({
      grid: { left: 40, right: 16, top: 30, bottom: 28 },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: WEEK_CN, axisLine: { lineStyle: { color: '#334155' } }, axisLabel: { color: '#94a3b8' } },
      yAxis: { type: 'value', minInterval: 1, splitLine: { lineStyle: { color: '#1e293b' } }, axisLabel: { color: '#94a3b8' } },
      series: [
        {
          type: 'bar',
          data: counts,
          barWidth: 22,
          itemStyle: { borderRadius: [6, 6, 0, 0], color: '#38bdf8' },
          label: { show: true, position: 'top', color: '#cbd5e1' },
        },
      ],
    })
  }, [])

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">📊 本周课程密度</CardTitle>
        <CardDescription>当前教学周每日报课节数（节）</CardDescription>
      </CardHeader>
      <CardContent>
        {option ? <EChart option={option} height={230} /> : <div className="h-[230px] animate-pulse rounded-xl bg-slate-800/40" />}
      </CardContent>
    </Card>
  )
}
