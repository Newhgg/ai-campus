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
  inside: boolean
  onEnterInside: () => void
  onExitInside: () => void
  floor: number
  onFloorChange: (floor: number) => void
}

// 进阶版 DOM 覆盖层：开关 + 楼宇信息面板（含"走进大楼"）+ 室内楼层切换条
export default function ProOverlay({
  isNight,
  onToggleNight,
  autoRotate,
  onToggleRotate,
  selected,
  onClose,
  inside,
  onEnterInside,
  onExitInside,
  floor,
  onFloorChange,
}: ProOverlayProps) {
  const b = selected ? BUILDINGS.find((x) => x.id === selected) : null
  const pill =
    'pointer-events-auto rounded-full border border-white/15 bg-slate-900/70 px-3.5 py-1.5 text-xs text-slate-200 backdrop-blur hover:bg-slate-800/80'

  return (
    <div className="pointer-events-none absolute inset-0 select-none">
      {/* 左上：昼夜 / 旋转开关（室内外通用） */}
      <div className="absolute left-3 top-3 flex gap-2">
        <button onClick={onToggleNight} className={pill}>
          {isNight ? '🌙 夜景' : '☀️ 白天'}
        </button>
        {!inside && (
          <button onClick={onToggleRotate} className={pill}>
            {autoRotate ? '⏸ 停转' : '▶ 旋转'}
          </button>
        )}
      </div>

      {/* 右上：回经典版 */}
      <Link href="/" className={`${pill} absolute right-3 top-3`}>
        ← 经典版
      </Link>

      {/* 楼宇信息面板（仅室外且选中时） */}
      {b && !inside && (
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
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              onClick={onEnterInside}
              className="rounded-xl bg-cyan-500/90 px-3 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-400"
            >
              🚪 走进大楼
            </button>
            <Link
              href={b.route}
              className="flex items-center justify-center rounded-xl border border-white/20 px-3 py-2 text-sm text-slate-100 hover:bg-white/10"
            >
              功能页 →
            </Link>
          </div>
        </div>
      )}

      {/* 室内：楼层切换条 + 退出 */}
      {inside && b && (
        <div className="pointer-events-auto absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/15 bg-slate-900/80 px-3 py-1.5 backdrop-blur">
          {Array.from({ length: b.floors }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => onFloorChange(n)}
              className={`rounded-full px-3 py-1 text-xs ${
                n === floor ? 'bg-cyan-500/90 font-bold text-slate-950' : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              {n}F
            </button>
          ))}
          <button onClick={onExitInside} className="ml-1 px-2 py-1 text-xs text-slate-300 hover:text-white">
            ← 回到校园
          </button>
        </div>
      )}

      {/* 底部操作提示（仅室外） */}
      {!inside && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-900/70 px-4 py-1.5 text-xs text-slate-300 backdrop-blur">
          点击建筑查看详情 · 可走进大楼 · 拖拽旋转 · 滚轮缩放
        </div>
      )}
    </div>
  )
}
