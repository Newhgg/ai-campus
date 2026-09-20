'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { BuildingConfig } from '@/lib/campus-config'
import { Bookshelf, Desk, BunkBed, Wardrobe, Figure } from './InteriorFurniture'

// 楼层切片层高（室内每层抬升量，InteriorRig 同步用）
export const ROOM_STEP = 1.3

// 单层室内场景：开放前墙 + 天花板灯 + 按楼型布置家具；切楼层时整层平滑升降
// 数据流：floor 变化 → 楼层切片 y 抬升（电梯感）→ InteriorRig 视线跟随
export default function InteriorRoom({
  building,
  floor,
  isNight,
}: {
  building: BuildingConfig
  floor: number
  isNight: boolean
}) {
  const group = useRef<THREE.Group>(null)
  const wall = '#243244'
  const floorColor = isNight ? '#1a2536' : '#b8c4d4'

  useFrame((_, delta) => {
    if (!group.current) return
    const targetY = (floor - 1) * ROOM_STEP
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY, 1 - Math.exp(-delta * 4))
  })

  return (
    <group ref={group}>
      {/* 地板 + 地毯 */}
      <mesh receiveShadow position={[0, 0, -1.4]}>
        <boxGeometry args={[6, 0.08, 6.2]} />
        <meshStandardMaterial color={floorColor} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, -1.6]}>
        <circleGeometry args={[1.1, 32]} />
        <meshStandardMaterial color={building.color} transparent opacity={0.35} />
      </mesh>

      {/* 背墙 + 楼型主屏 */}
      <mesh receiveShadow position={[0, 0.6, -4.5]}>
        <boxGeometry args={[6, 1.2, 0.12]} />
        <meshStandardMaterial color={wall} />
      </mesh>
      <mesh position={[0, 0.72, -4.42]}>
        <boxGeometry args={[3.4, 0.55, 0.04]} />
        <meshStandardMaterial color="#0f172a" emissive={building.color} emissiveIntensity={0.5} />
      </mesh>

      {/* 侧墙 + 窗光 */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh receiveShadow position={[s * 3, 0.6, -1.4]}>
            <boxGeometry args={[0.12, 1.2, 6.2]} />
            <meshStandardMaterial color={wall} />
          </mesh>
          {[-3.4, -2.2].map((z) => (
            <mesh key={z} position={[s * 2.94, 0.72, z]} rotation={[0, (-s * Math.PI) / 2, 0]}>
              <planeGeometry args={[0.8, 0.5]} />
              <meshStandardMaterial
                color={isNight ? '#1e3a5f' : '#bfe3ff'}
                emissive={isNight ? '#123252' : '#bfe3ff'}
                emissiveIntensity={isNight ? 0.4 : 0.7}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* 天花板 + 三排顶灯 */}
      <mesh position={[0, 1.22, -1.4]}>
        <boxGeometry args={[6, 0.08, 6.2]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      {[-3, -1.5, 0.5].map((z) => (
        <group key={z}>
          <mesh position={[0, 1.17, z]}>
            <boxGeometry args={[1.4, 0.04, 0.3]} />
            <meshStandardMaterial color="#fff7e0" emissive="#ffe9b0" emissiveIntensity={1.6} />
          </mesh>
          <pointLight position={[0, 1.05, z]} intensity={2.2} distance={4.5} color="#ffe9c0" />
        </group>
      ))}

      {/* 立柱 */}
      {[-2.2, 2.2].map((x) => (
        <mesh key={x} castShadow position={[x, 0.6, 0.9]}>
          <cylinderGeometry args={[0.1, 0.1, 1.2, 8]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
      ))}

      {/* 按楼型布置家具 */}
      {building.id === 'learning' && (
        <>
          <Bookshelf position={[-2.2, 0.04, -4]} />
          <Bookshelf position={[2.2, 0.04, -4]} />
          <Bookshelf position={[-2.2, 0.04, -2.6]} />
          <Desk position={[0, 0.04, -3.2]} />
          <Desk position={[-1.1, 0.04, -1.2]} rotY={0.4} />
          <Desk position={[1.1, 0.04, -1.2]} rotY={-0.4} />
          <Figure position={[0.35, 0.04, -2.9]} color="#38bdf8" />
        </>
      )}
      {building.id === 'dorm' && (
        <>
          <BunkBed position={[-1.8, 0.04, -3.6]} />
          <BunkBed position={[1.8, 0.04, -3.6]} />
          <Wardrobe position={[0, 0.04, -4.2]} />
          <Desk position={[-2.2, 0.04, -1.4]} rotY={1.1} />
          <Figure position={[-1.75, 0.04, -1.4]} color="#facc15" />
        </>
      )}
      {building.id === 'office' && (
        <>
          <Desk position={[-1.2, 0.04, -3.4]} />
          <Desk position={[1.2, 0.04, -3.4]} />
          <Desk position={[0, 0.04, -1.6]} />
          <Figure position={[1.55, 0.04, -3.4]} color="#34d399" />
          <Figure position={[-0.35, 0.04, -1.6]} color="#fb923c" />
        </>
      )}

      {/* 楼层号屏（HTML 覆盖层） */}
      <Html position={[0, 1.02, -4.4]} center distanceFactor={7} style={{ pointerEvents: 'none' }}>
        <div className="whitespace-nowrap rounded-lg bg-slate-950/90 px-3 py-1 text-xs font-bold text-cyan-300">
          {building.emoji} {building.name} · {floor}F
        </div>
      </Html>
    </group>
  )
}
