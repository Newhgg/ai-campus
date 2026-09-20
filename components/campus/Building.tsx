'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { BuildingConfig } from '@/lib/campus-config'
import Windows from './Windows'
import { Books, Envelopes } from './decorations'
import { useAppStore } from '@/store/useAppStore'

const BODY_W = 3
const BODY_D = 3

// 单栋楼：低多边形楼体 + 四面窗户 + 3D 名牌 + 点击进楼
// 数据流：点击建筑 → markVisited 记录 → router.push 进入楼层页面
export default function Building({ config, flicker }: { config: BuildingConfig; flicker?: boolean }) {
  const router = useRouter()
  const markVisited = useAppStore((s) => s.markVisited)
  const [hovered, setHovered] = useState(false)
  const inner = useRef<THREE.Group>(null)
  const down = useRef<{ x: number; y: number } | null>(null)
  const height = config.floors * 0.85

  // 悬停时楼体平滑放大到 1.07 倍
  useFrame((_, delta) => {
    if (!inner.current) return
    const s = THREE.MathUtils.lerp(inner.current.scale.x, hovered ? 1.07 : 1, delta * 8)
    inner.current.scale.setScalar(s)
  })

  // 点击进楼：拖拽旋转视角（位移 > 6px）不触发，避免误点
  const handleClick = (x: number, y: number) => {
    const d = down.current
    down.current = null
    if (d && Math.hypot(x - d.x, y - d.y) > 6) return
    document.body.style.cursor = 'auto'
    markVisited(config.id)
    router.push(config.route)
  }

  return (
    <group
      position={config.position}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
      onPointerDown={(e) => {
        down.current = { x: e.clientX, y: e.clientY }
      }}
      onClick={(e) => handleClick(e.clientX, e.clientY)}
    >
      <group ref={inner}>
        {/* 楼体 + 屋顶 */}
        <mesh castShadow position={[0, height / 2, 0]}>
          <boxGeometry args={[BODY_W, height, BODY_D]} />
          <meshStandardMaterial color={config.color} />
        </mesh>
        <mesh castShadow position={[0, height + 0.1, 0]}>
          <boxGeometry args={[BODY_W + 0.35, 0.2, BODY_D + 0.35]} />
          <meshStandardMaterial color={config.roofColor} />
        </mesh>

        {/* 四面窗户 + 大门 */}
        <Windows width={BODY_W} height={height} depth={BODY_D} flicker={flicker} />
        <mesh position={[0, 0.38, BODY_D / 2 + 0.02]}>
          <boxGeometry args={[0.7, 0.76, 0.06]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      </group>

      {/* 楼顶名牌：用 HTML 覆盖层，中文无需加载 3D 字体 */}
      <Html
        position={[0, height + 1.15, 0]}
        center
        distanceFactor={12}
        zIndexRange={[20, 0]}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <div className="whitespace-nowrap rounded-xl border border-white/20 bg-slate-900/85 px-3.5 py-2 text-center shadow-xl backdrop-blur">
          <div className="text-sm font-bold text-white">
            {config.emoji} {config.name}
          </div>
          <div className="mt-0.5 text-[10px] text-slate-300">{config.tagline}</div>
        </div>
      </Html>

      {/* 楼旁装饰：学习楼书堆 / 办公楼信封 */}
      {config.id === 'learning' && <Books position={[2.6, 0, 1.4]} />}
      {config.id === 'office' && <Envelopes position={[2.5, 0, 1.5]} />}
    </group>
  )
}
