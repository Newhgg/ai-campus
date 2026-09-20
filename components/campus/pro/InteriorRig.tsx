'use client'

import { useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import * as THREE from 'three'
import { ROOM_STEP } from './InteriorRoom'

const EYE = new THREE.Vector3()
const LOOK = new THREE.Vector3()

// 室内镜头：固定机位（禁用轨道控制），切楼层时视线随楼层切片平滑升降
export default function InteriorRig({ floor }: { floor: number }) {
  const controls = useThree((s) => s.controls) as unknown as OrbitControlsImpl | null
  const camera = useThree((s) => s.camera)

  useEffect(() => {
    if (controls) controls.enabled = false
  }, [controls])

  useFrame((_, delta) => {
    const eyeY = 0.55 + (floor - 1) * ROOM_STEP
    const k = 1 - Math.exp(-delta * 4)
    camera.position.lerp(EYE.set(0, eyeY, 4.4), k)
    camera.lookAt(LOOK.set(0, eyeY - 0.08, -1.2))
  })

  return null
}
