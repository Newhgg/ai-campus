import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import CampusMap from '@/components/campus/CampusMap'
import { BUILDINGS } from '@/lib/campus-config'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const TECH_STACK = ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'Three.js + R3F', 'Vercel AI SDK', 'Zustand']

// 首页 = 3D 校园地图 + 三栋楼入口卡片
export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6 text-center">
        <Badge variant="outline" className="mb-3 border-cyan-400/40 text-cyan-300">
          2026 第九届传智杯 · AI Web 开发挑战赛 · B 组
        </Badge>
        <h1 className="text-3xl font-bold sm:text-4xl">AI 校园·三栋楼智能平台</h1>
        <p className="mt-2 text-sm text-slate-400">拖拽旋转 3D 校园，点击建筑进入对应楼层 —— 学习楼 / 宿舍楼 / 办公楼</p>
        <div className="mt-4">
          <Link
            href="/pro"
            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-1.5 text-sm text-cyan-300 hover:bg-cyan-500/20"
          >
            🚀 进阶版 3D 校园（Bloom 辉光 / 昼夜切换 / 行人）
          </Link>
        </div>
      </header>

      {/* 3D 校园 */}
      <section className="relative h-[62vh] min-h-[420px] overflow-hidden rounded-2xl border border-white/10 bg-[#0b1026] shadow-2xl">
        <CampusMap />
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-900/70 px-4 py-1.5 text-xs text-slate-300 backdrop-blur">
          拖拽旋转 · 滚轮缩放 · 点击建筑进楼
        </div>
      </section>

      {/* 三栋楼入口卡片 */}
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {BUILDINGS.map((b) => (
          <Link key={b.id} href={b.route} className="group">
            <Card className="h-full transition group-hover:border-white/30 group-hover:bg-slate-900">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {b.emoji} {b.name}
                  </CardTitle>
                  <span className="h-3 w-3 rounded-full" style={{ background: b.color }} />
                </div>
                <CardDescription>{b.tagline}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5 text-sm text-slate-300">
                  {b.features.slice(0, 3).map((f) => (
                    <li key={f.title} className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-slate-500" />
                      {f.title}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 flex items-center gap-1 text-xs text-slate-500">
                  共 {b.features.length} 项功能
                  <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      <footer className="mt-10 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
        {TECH_STACK.map((t) => (
          <Badge key={t} variant="secondary">
            {t}
          </Badge>
        ))}
      </footer>
    </main>
  )
}
