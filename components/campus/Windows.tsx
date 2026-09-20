'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const ROWS = 3
const COLS = 3

interface WindowsProps {
  width: number
  height: number
  depth: number
  flicker?: boolean
}

// 窗户网格：贴在楼体四个侧面；(r+c+面序号)%3 决定亮灭，宿舍楼 flicker=true 时按正弦随机闪烁
export default function Windows({ width, height, depth, flicker }: WindowsProps) {
  const group = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!flicker || !group.current) return
    group.current.children.forEach((child, i) => {
      const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = Math.sin(clock.elapsedTime * 1.5 + i * 2.7) > 0 ? 1 : 0.1
    })
  })

  // 四个朝向的面：法线 n = (sin f, 0, cos f)，切线 t = (cos f, 0, -sin f)
  const faces = [0, Math.PI / 2, Math.PI, -Math.PI / 2]
  const items: { key: string; pos: [number, number, number]; rotY: number; lit: boolean }[] = []
  faces.forEach((f, fi) => {
    const nx = Math.round(Math.sin(f))
    const nz = Math.round(Math.cos(f))
    const half = (nx !== 0 ? width : depth) / 2 + 0.02
    const spread = Math.max(width, depth) / (COLS + 0.4)
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const off = (c - (COLS - 1) / 2) * spread
        const y = ((r + 1) / (ROWS + 1)) * height - height / 2 + 0.12
        items.push({
          key: `${fi}-${r}-${c}`,
          pos: [nx * half + Math.cos(f) * off, y, nz * half - Math.sin(f) * off],
          rotY: f,
          lit: (r + c + fi) % 3 !== 0,
        })
      }
    }
  })

  return (
    <group ref={group}>
      {items.map((w) => (
        <mesh key={w.key} position={w.pos} rotation={[0, w.rotY, 0]}>
          <planeGeometry args={[0.22, 0.3]} />
          <meshStandardMaterial
            color={w.lit ? '#fde68a' : '#1e293b'}
            emissive={w.lit ? '#fbbf24' : '#000000'}
            emissiveIntensity={w.lit ? 1 : 0}
          />
        </mesh>
      ))}
    </group>
  )
}
