import notices from '@/lib/data/notices.json'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// 通知公告板（真实数据：三班平台 notices.json）
export default function NoticeBoard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">📢 宿舍公告板</CardTitle>
        <CardDescription>同步自三班平台 · 更新于 {notices.update_time}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {notices.notices.map((n) => (
          <div key={n.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex flex-wrap items-center gap-2">
              {n.cat === 'important' && (
                <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-medium text-red-300">重要</span>
              )}
              <h4 className="text-sm font-medium text-slate-100">{n.title}</h4>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-400">{n.content}</p>
            <p className="mt-2 text-[10px] text-slate-500">
              {n.author} · {n.date}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
