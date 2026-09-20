'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshReflectorMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { BUILDINGS } from '@/lib/campus-config'

// 行人配置：绑定楼栋 + 相位 + 速度 + 衣服颜色（固定值，客户端渲染无 hydration 问题）
const STUDENTS = [
  { b: 0, t0: 0.05, speed: 0.1, color: '#f472b6' },
  { b: 0, t0: 0.45, speed: 0.13, color: '#38bdf8' },
  { b: 1, t0: 0.25, speed: 0.09, color: '#facc15' },
  { b: 1, t0: 0.65, speed: 0.12, color: '#a78bfa' },
  { b: 2, t0: 0.35, speed: 0.11, color: '#34d399' },
  { b: 2, t0: 0.8, speed: 0.14, color: '#fb923c' },
]

// 六个学生在步道上往返行走
export function Students() {
  const refs = useRef<(THREE.Group | null)[]>([])
  useFrame(({ clock }) => {
    STUDENTS.forEach((s, i) => {
      const g = refs.current[i]
      if (!g) return
      const pos = BUILDINGS[s.b].position
      const a = new THREE.Vector3(pos[0] * 0.35, 0, pos[2] * 0.35)
      const c = new THREE.Vector3(pos[0] * 0.82, 0, pos[2] * 0.82)
      const t = (Math.sin(clock.elapsedTime * s.speed + s.t0 * Math.PI * 2) + 1) / 2
      g.position.lerpVectors(a, c, t)
      g.position.y = 0.34 + Math.abs(Math.sin(clock.elapsedTime * 6 + i)) * 0.03
      const back = t > 0.5 ? 0 : Math.PI
      g.rotation.y = Math.atan2(c.x - a.x, c.z - a.z) + back
    })
  })
  return (
    <>
      {STUDENTS.map((s, i) => (
        <group
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
        >
          <mesh castShadow position={[0, 0.18, 0]}>
            <capsuleGeometry args={[0.11, 0.26, 4, 8]} />
            <meshStandardMaterial color={s.color} />
          </mesh>
          <mesh castShadow position={[0, 0.46, 0]}>
            <sphereGeometry args={[0.1, 10, 10]} />
            <meshStandardMaterial color="#fcd9b8" />
          </mesh>
        </group>
      ))}
    </>
  )
}

// 低多边形树：树干 + 双层树冠
export function Tree({ position, variant = 0 }: { position: [number, number, number]; variant?: number }) {
  const leaf = variant % 2 ? '#1f7a3d' : '#248a46'
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.07, 0.1, 0.6, 6]} />
        <meshStandardMaterial color="#7c4a21" />
      </mesh>
      <mesh castShadow position={[0, 0.85, 0]}>
        <sphereGeometry args={[0.42, 10, 10]} />
        <meshStandardMaterial color={leaf} />
      </mesh>
      <mesh castShadow position={[0.08, 1.18, 0.05]}>
        <sphereGeometry args={[0.26, 10, 10]} />
        <meshStandardMaterial color={leaf} />
      </mesh>
    </group>
  )
}

// 湖面：实时反射倒影（夜景尤其出彩）
export function Pond({ isNight }: { isNight: boolean }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-4.8, 0.01, 3.6]}>
      <circleGeometry args={[1.5, 40]} />
      <MeshReflectorMaterial
        blur={[280, 60]}
        resolution={1024}
        mixBlur={1}
        mixStrength={isNight ? 12 : 6}
        roughness={0.9}
        depthScale={1.1}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color={isNight ? '#0c1626' : '#2a5f8a'}
        metalness={0.55}
        mirror={0.5}
      />
    </mesh>
  )
}
