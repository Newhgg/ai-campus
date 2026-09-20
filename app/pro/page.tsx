import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ProCampusMap from '@/components/campus/pro/ProCampusMap'
import { Badge } from '@/components/ui/badge'

// 进阶版 3D 校园：Bloom 辉光 / 昼夜切换 / 镜头导演 / 行人 / 湖面倒影
export default function ProPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" /> 返回首页
        </Link>
        <Badge variant="outline" className="border-cyan-400/40 text-cyan-300">
          进阶版 · Bloom 辉光 / 昼夜切换 / 行人 / 湖面倒影
        </Badge>
      </div>

      <section className="relative h-[80vh] min-h-[520px] overflow-hidden rounded-2xl border border-white/10 bg-[#070b1c] shadow-2xl">
        <ProCampusMap />
      </section>

      <p className="mt-4 text-center text-xs text-slate-500">
        进阶版为 3D 交互预研（对应 W5 打磨方向），W1 交付以经典版为准
      </p>
    </main>
  )
}
