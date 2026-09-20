'use client'

import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import * as THREE from 'three'

// 开场位置（远处高空）→ 全景机位
const INTRO_FROM = new THREE.Vector3(30, 17, 34)
const OVERVIEW = new THREE.Vector3(10, 6.8, 12)

// 相机导演（室外）：开场飞行 2.2s → 点击建筑推近 → 关闭面板回到全景
// active=false 时挂起（室内模式由 InteriorRig 接管相机）
export default function CameraRig({
  selectedPos,
  active = true,
}: {
  selectedPos: [number, number, number] | null
  active?: boolean
}) {
  const controls = useThree((s) => s.controls) as unknown as OrbitControlsImpl | null
  const camera = useThree((s) => s.camera)
  const intro = useRef(0)
  const camGoal = useRef(OVERVIEW.clone())
  const tgtGoal = useRef(new THREE.Vector3(0, 1.2, 0))

  // 室外模式恢复轨道控制；室内模式交出相机
  useEffect(() => {
    if (controls) controls.enabled = active
  }, [controls, active])

  useFrame((_, delta) => {
    if (!active || !controls) return
    // 阶段一：飞入
    if (intro.current < 1) {
      intro.current = Math.min(1, intro.current + delta / 2.2)
      const e = 1 - Math.pow(1 - intro.current, 3)
      camera.position.lerpVectors(INTRO_FROM, OVERVIEW, e)
      camera.lookAt(0, 1, 0)
      if (intro.current >= 1) controls.enabled = true
      return
    }
    // 阶段二：注视目标平滑切换
    if (selectedPos) {
      const dir = new THREE.Vector3(selectedPos[0], 0, selectedPos[2]).normalize()
      camGoal.current.set(selectedPos[0] + dir.x * 4.6, 3.4, selectedPos[2] + dir.z * 4.6)
      tgtGoal.current.set(selectedPos[0], 1.4, selectedPos[2])
    } else {
      camGoal.current.copy(OVERVIEW)
      tgtGoal.current.set(0, 1.2, 0)
    }
    const k = 1 - Math.exp(-delta * 3)
    camera.position.lerp(camGoal.current, k)
    controls.target.lerp(tgtGoal.current, k)
  })

  return null
}
