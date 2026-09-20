import Link from 'next/link'
import { ArrowLeft, User } from 'lucide-react'
import { BUILDINGS, type BuildingId } from '@/lib/campus-config'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// 三栋楼页面共用主题色
const THEMES: Record<BuildingId, { bg: string; text: string }> = {
  learning: { bg: 'from-blue-500/20', text: 'text-blue-300' },
  dorm: { bg: 'from-amber-500/20', text: 'text-amber-300' },
  office: { bg: 'from-emerald-500/20', text: 'text-emerald-300' },
}

// 楼层页通用骨架：头部横幅 + 功能卡片网格 + 模块区（children，导入自三班平台的可视化模块）
export default function BuildingPage({ id, children }: { id: BuildingId; children?: React.ReactNode }) {
  const b = BUILDINGS.find((x) => x.id === id)
  if (!b) return null
  const theme = THEMES[id]

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200"
      >
        <ArrowLeft className="h-4 w-4" /> 返回 3D 校园
      </Link>

      <header
        className={`rounded-2xl border border-white/10 bg-gradient-to-r ${theme.bg} to-transparent p-8`}
      >
        <h1 className={`text-3xl font-bold ${theme.text}`}>
          {b.emoji} {b.name}
        </h1>
        <p className="mt-2 text-slate-300">{b.tagline}</p>
      </header>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        {b.features.map((f) => (
          <Card key={f.title}>
            <CardHeader>
              <CardTitle className="text-base">{f.title}</CardTitle>
              <CardDescription>{f.desc}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-2 text-xs text-slate-400">
              <Badge variant="outline">{f.tech}</Badge>
              <span className="inline-flex items-center gap-1">
                <User className="h-3 w-3" />
                {f.owner}
              </span>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* 模块区：从三班平台导入的可视化模块 */}
      {children && (
        <section className="mt-8">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">已导入模块 · 来自三班平台</h2>
          {children}
        </section>
      )}

      <p className="mt-6 text-center text-xs text-slate-500">
        功能页为 W1 骨架占位，按 8 周任务卡逐步实装
      </p>
    </main>
  )
}
