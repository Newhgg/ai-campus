'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Edges, Html } from '@react-three/drei'
import * as THREE from 'three'
import type { BuildingConfig, BuildingId } from '@/lib/campus-config'
import Windows from '../Windows'
import { Books, Envelopes } from '../decorations'

interface ProBuildingProps {
  config: BuildingConfig
  isNight: boolean
  selected: boolean
  onSelect: (id: BuildingId) => void
}

// 进阶版建筑：双层退台楼体 + 屋顶天线（航空灯闪烁）+ 悬停描边 + 选中光圈
// 数据流：点击建筑 → onSelect 通知场景 → 相机推近 + 信息面板弹出
export default function ProBuilding({ config, isNight, selected, onSelect }: ProBuildingProps) {
  const [hovered, setHovered] = useState(false)
  const inner = useRef<THREE.Group>(null)
  const down = useRef<{ x: number; y: number } | null>(null)
  const beacon = useRef<THREE.MeshStandardMaterial>(null)
  const h1 = config.floors * 0.5
  const h2 = config.floors * 0.36

  useFrame((_, delta) => {
    if (inner.current) {
      const s = THREE.MathUtils.lerp(inner.current.scale.x, hovered ? 1.06 : 1, delta * 8)
      inner.current.scale.setScalar(s)
    }
    // 屋顶航空警示灯呼吸闪烁
    if (beacon.current) {
      beacon.current.emissiveIntensity = 1.6 + Math.sin(Date.now() * 0.004) * 1.3
    }
  })

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
      onClick={(e) => {
        const d = down.current
        down.current = null
        if (d && Math.hypot(e.clientX - d.x, e.clientY - d.y) > 6) return
        document.body.style.cursor = 'auto'
        onSelect(config.id)
      }}
    >
      {/* 选中光圈 */}
      {selected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
          <ringGeometry args={[2.1, 2.35, 40]} />
          <meshBasicMaterial color="#67e8f9" transparent opacity={0.85} />
        </mesh>
      )}

      <group ref={inner}>
        {/* 下层楼体 + 上层退台 */}
        <mesh castShadow position={[0, h1 / 2, 0]}>
          <boxGeometry args={[3, h1, 3]} />
          <meshStandardMaterial color={config.color} />
          {hovered && <Edges color="#67e8f9" />}
        </mesh>
        <mesh castShadow position={[0, h1 + h2 / 2, 0]}>
          <boxGeometry args={[2.2, h2, 2.2]} />
          <meshStandardMaterial color={config.color} />
          {hovered && <Edges color="#67e8f9" />}
        </mesh>
        {/* 两层屋顶檐口 */}
        <mesh castShadow position={[0, h1 + 0.07, 0]}>
          <boxGeometry args={[3.3, 0.14, 3.3]} />
          <meshStandardMaterial color={config.roofColor} />
        </mesh>
        <mesh castShadow position={[0, h1 + h2 + 0.07, 0]}>
          <boxGeometry args={[2.5, 0.14, 2.5]} />
          <meshStandardMaterial color={config.roofColor} />
        </mesh>

        {/* 两层窗户（白天玻璃 / 夜晚亮灯） */}
        <Windows width={3} height={h1} depth={3} night={isNight} flicker={config.id === 'dorm'} />
        <Windows width={2.2} height={h2} depth={2.2} night={isNight} />

        {/* 天线 + 航空警示灯 */}
        <mesh position={[0, h1 + h2 + 0.45, 0]}>
          <cylinderGeometry args={[0.02, 0.035, 0.7, 6]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
        <mesh position={[0, h1 + h2 + 0.85, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial ref={beacon} color="#ef4444" emissive="#ef4444" emissiveIntensity={2} />
        </mesh>

        {/* 大门 + 台阶 */}
        <mesh position={[0, 0.4, 1.52]}>
          <boxGeometry args={[0.75, 0.8, 0.05]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh receiveShadow position={[0, 0.04, 1.85]}>
          <boxGeometry args={[1.1, 0.08, 0.6]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
      </group>

      {/* 楼顶名牌（HTML 覆盖层，中文无字体问题） */}
      <Html
        position={[0, h1 + h2 + 1.35, 0]}
        center
        distanceFactor={12}
        zIndexRange={[20, 0]}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <div className="whitespace-nowrap rounded-xl border border-white/20 bg-slate-900/85 px-3.5 py-2 text-center shadow-xl backdrop-blur">
          <div className="text-sm font-bold text-white">
            {config.emoji} {config.name}
          </div>
          <div className="mt-0.5 text-[10px] text-slate-300">{hovered ? '点击查看详情' : config.tagline}</div>
        </div>
      </Html>

      {/* 楼旁装饰 */}
      {config.id === 'learning' && <Books position={[2.6, 0, 1.4]} />}
      {config.id === 'office' && <Envelopes position={[2.5, 0, 1.5]} />}
    </group>
  )
}
