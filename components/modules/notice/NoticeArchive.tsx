'use client'

import { Card, CardContent } from '@/components/ui/card'
import type { ClassifiedNotice } from '@/lib/office/notice-engine'

const URGENCY_CLS: Record<string, string> = {
  紧急: 'bg-red-500/15 text-red-300',
  重要: 'bg-amber-500/15 text-amber-300',
  普通: 'bg-slate-700/60 text-slate-300',
}

interface ArchiveItem extends ClassifiedNotice {
  rewrite?: { engine: string; text: string }
}

// 归档区：已处理的通知按类别分组展示，带归档编号（可视化归档柜）
export default function NoticeArchive({ items }: { items: ArchiveItem[] }) {
  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-slate-400">
          归档柜还空着 —— 转发完的通知点「归档」会自动按类别收进来
        </CardContent>
      </Card>
    )
  }
  const groups = items.reduce<Record<string, ArchiveItem[]>>((acc, it) => {
    ;(acc[it.category] = acc[it.category] || []).push(it)
    return acc
  }, {})

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Object.entries(groups).map(([cat, list]) => (
        <Card key={cat}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-100">{cat}</h4>
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-300">
                {list.length} 份
              </span>
            </div>
            <ul className="mt-3 space-y-2.5">
              {list.map((it) => (
                <li key={it.id} className="rounded-lg border border-white/10 bg-white/5 p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-xs font-medium text-slate-100">{it.title}</p>
                    <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] ${URGENCY_CLS[it.urgency]}`}>
                      {it.urgency}
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] text-slate-500">
                    {it.archiveNo} · {it.rewrite ? '已转群发' : '直接归档'}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
