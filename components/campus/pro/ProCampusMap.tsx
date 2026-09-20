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

// 进阶版容器：昼夜/旋转/选中/内外模式/楼层 五份状态，分发给 3D 场景与 DOM 覆盖层
// 数据流：点楼 → selected → 推近+面板；走进大楼 → mode=inside → 室内切片；floor → 楼层升降
export default function ProCampusMap() {
  const [isNight, setIsNight] = useState(true)
  const [autoRotate, setAutoRotate] = useState(true)
  const [selected, setSelected] = useState<BuildingId | null>(null)
  const [mode, setMode] = useState<'outside' | 'inside'>('outside')
  const [floor, setFloor] = useState(1)

  return (
    <div className="relative h-full w-full">
      <ProScene
        isNight={isNight}
        autoRotate={autoRotate}
        selected={selected}
        onSelect={(id) => setSelected((s) => (s === id ? null : id))}
        mode={mode}
        floor={floor}
      />
      <ProOverlay
        isNight={isNight}
        onToggleNight={() => setIsNight((v) => !v)}
        autoRotate={autoRotate}
        onToggleRotate={() => setAutoRotate((v) => !v)}
        selected={selected}
        onClose={() => setSelected(null)}
        inside={mode === 'inside'}
        onEnterInside={() => {
          setFloor(1)
          setMode('inside')
        }}
        onExitInside={() => setMode('outside')}
        floor={floor}
        onFloorChange={setFloor}
      />
    </div>
  )
}
