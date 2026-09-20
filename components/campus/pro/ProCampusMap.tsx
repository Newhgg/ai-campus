'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import type { BuildingId } from '@/lib/campus-config'
import ProOverlay from './ProOverlay'

// 关闭 SSR：Three.js 依赖浏览器 WebGL
const ProScene = dynamic(() => import('./ProScene'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
      正在生成进阶 3D 校园……
    </div>
  ),
})

// 进阶版容器：持有昼/夜、旋转、选中三份状态，分发给 3D 场景与 DOM 覆盖层
// 数据流：点击建筑 → ProScene onSelect → selected → 相机推近 + ProOverlay 面板
export default function ProCampusMap() {
  const [isNight, setIsNight] = useState(true)
  const [autoRotate, setAutoRotate] = useState(true)
  const [selected, setSelected] = useState<BuildingId | null>(null)

  return (
    <div className="relative h-full w-full">
      <ProScene
        isNight={isNight}
        autoRotate={autoRotate}
        selected={selected}
        onSelect={(id) => setSelected((s) => (s === id ? null : id))}
      />
      <ProOverlay
        isNight={isNight}
        onToggleNight={() => setIsNight((v) => !v)}
        autoRotate={autoRotate}
        onToggleRotate={() => setAutoRotate((v) => !v)}
        selected={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  )
}
