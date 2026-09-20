'use client'

import Link from 'next/link'
import { BUILDINGS, type BuildingId } from '@/lib/campus-config'

interface ProOverlayProps {
  isNight: boolean
  onToggleNight: () => void
  autoRotate: boolean
  onToggleRotate: () => void
  selected: BuildingId | null
  onClose: () => void
}

// 进阶版 DOM 覆盖层：昼夜/旋转开关 + 楼宇信息面板（3D 内点击触发）
export default function ProOverlay({
  isNight,
  onToggleNight,
  autoRotate,
  onToggleRotate,
  selected,
  onClose,
}: ProOverlayProps) {
  const b = selected ? BUILDINGS.find((x) => x.id === selected) : null
  const pill =
    'pointer-events-auto rounded-full border border-white/15 bg-slate-900/70 px-3.5 py-1.5 text-xs text-slate-200 backdrop-blur hover:bg-slate-800/80'

  return (
    <div className="pointer-events-none absolute inset-0 select-none">
      {/* 左上：昼夜 / 旋转开关 */}
      <div className="absolute left-3 top-3 flex gap-2">
        <button onClick={onToggleNight} className={pill}>
          {isNight ? '🌙 夜景' : '☀️ 白天'}
        </button>
        <button onClick={onToggleRotate} className={pill}>
          {autoRotate ? '⏸ 停转' : '▶ 旋转'}
        </button>
      </div>

      {/* 右上：回经典版 */}
      <Link href="/" className={`${pill} absolute right-3 top-3`}>
        ← 经典版
      </Link>

      {/* 楼宇信息面板 */}
      {b && (
        <div className="pointer-events-auto absolute right-3 top-14 w-72 rounded-2xl border border-white/15 bg-slate-900/85 p-5 shadow-2xl backdrop-blur">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">
              {b.emoji} {b.name}
            </h3>
            <button onClick={onClose} className="text-slate-400 hover:text-white" aria-label="关闭">
              ✕
            </button>
          </div>
          <p className="mt-1 text-xs text-slate-400">{b.tagline}</p>
          <ul className="mt-3 space-y-2">
            {b.features.map((f) => (
              <li key={f.title} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                <div className="flex items-center justify-between text-sm text-slate-100">
                  <span>{f.title}</span>
                  <span className="text-[10px] text-slate-400">{f.owner}</span>
                </div>
                <div className="mt-0.5 text-[10px] text-slate-500">{f.tech}</div>
              </li>
            ))}
          </ul>
          <Link
            href={b.route}
            className="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-cyan-500/90 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-400"
          >
            进入 {b.name} →
          </Link>
        </div>
      )}

      {/* 底部操作提示 */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-900/70 px-4 py-1.5 text-xs text-slate-300 backdrop-blur">
        点击建筑查看详情 · 拖拽旋转 · 滚轮缩放
      </div>
    </div>
  )
}
