'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

// 学习楼旁的书堆：三本彩书叠起缓慢旋转
export function Books({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.6
  })
  return (
    <group position={position}>
      <Float speed={2} floatIntensity={0.6}>
        <group ref={ref}>
          <mesh castShadow position={[0, 0.12, 0]}>
            <boxGeometry args={[0.8, 0.16, 0.55]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
          <mesh castShadow position={[0.05, 0.3, 0.04]}>
            <boxGeometry args={[0.7, 0.16, 0.5]} />
            <meshStandardMaterial color="#3b82f6" />
          </mesh>
          <mesh castShadow position={[-0.04, 0.48, -0.03]}>
            <boxGeometry args={[0.6, 0.16, 0.45]} />
            <meshStandardMaterial color="#22c55e" />
          </mesh>
        </group>
      </Float>
    </group>
  )
}

// 办公楼旁漂浮的信封 ×2
export function Envelopes({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[0, 1].map((i) => (
        <Float key={i} speed={2.2} floatIntensity={1.2} rotationIntensity={1.2}>
          <mesh castShadow position={[i * 0.7 - 0.3, 0.6 + i * 0.5, i * 0.4]}>
            <boxGeometry args={[0.5, 0.32, 0.04]} />
            <meshStandardMaterial color="#f8fafc" emissive="#64748b" emissiveIntensity={0.15} />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

// 路灯：灯杆 + 发光灯球 + 暖色点光源
export function LampPost({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.05, 0.07, 1.4, 8]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.14, 12, 12]} />
        <meshStandardMaterial color="#fde68a" emissive="#fbbf24" emissiveIntensity={1.6} />
      </mesh>
      <pointLight position={[0, 1.6, 0]} intensity={3} distance={6} color="#fcd34d" />
    </group>
  )
}

// 中央广场的 AI 八面体：悬浮旋转，代表平台核心
export function CenterPiece() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.8
    ref.current.position.y = 1.6 + Math.sin(clock.elapsedTime * 1.4) * 0.15
  })
  return (
    <mesh ref={ref} position={[0, 1.6, 0]}>
      <octahedronGeometry args={[0.55, 0]} />
      <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.8} wireframe />
    </mesh>
  )
}
