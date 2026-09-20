'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sky, Stars } from '@react-three/drei'
import type { BuildingId } from '@/lib/campus-config'
import { BUILDINGS } from '@/lib/campus-config'
import CameraRig from './CameraRig'
import Effects from './Effects'
import ProBuilding from './ProBuilding'
import { Pond, Students, Tree } from './Extras'
import { CenterPiece, LampPost } from '../decorations'

const LAMPS: [number, number, number][] = [
  [-2.1, 0, -0.2],
  [2.1, 0, -0.2],
  [0.9, 0, 2.4],
]
const TREES: [number, number, number][] = [
  [-9, 0, 2],
  [9, 0, 2],
  [2.8, 0, -7],
  [-2.8, 0, -7],
  [-10, 0, -4],
  [10, 0, -4],
  [-4.5, 0, 6.8],
  [6.8, 0, 4.5],
]

interface ProSceneProps {
  isNight: boolean
  autoRotate: boolean
  selected: BuildingId | null
  onSelect: (id: BuildingId) => void
}

// 进阶版 3D 校园：昼夜切换 + Bloom 辉光 + 镜头导演 + 行人/湖面/树
// 数据流：ProCampusMap 状态 → ProScene 分发 → 建筑 onSelect 回传选中态
export default function ProScene({ isNight, autoRotate, selected, onSelect }: ProSceneProps) {
  const sel = BUILDINGS.find((b) => b.id === selected) ?? null
  const bg = isNight ? '#070b1c' : '#a8d8f0'

  return (
    <Canvas shadows camera={{ position: [30, 17, 34], fov: 45 }} dpr={[1, 1.75]}>
      <color attach="background" args={[bg]} />
      <fog attach="fog" args={[bg, 30, 90]} />

      {/* 灯光：夜晚月光+星空，白天太阳+天空 */}
      {isNight ? (
        <>
          <Stars radius={70} depth={30} count={3000} factor={3} fade speed={1} />
          <hemisphereLight intensity={0.35} color="#94a3b8" groundColor="#0f172a" />
          <directionalLight position={[8, 12, 6]} intensity={0.55} color="#c7d2fe" castShadow shadow-mapSize={[1024, 1024]}>
            <orthographicCamera attach="shadow-camera" args={[-15, 15, 15, -15]} />
          </directionalLight>
        </>
      ) : (
        <>
          <Sky sunPosition={[12, 16, 8]} turbidity={7} rayleigh={1.5} />
          <hemisphereLight intensity={0.6} color="#e0f2fe" groundColor="#3f6212" />
          <directionalLight position={[12, 16, 8]} intensity={1.6} color="#fff7e6" castShadow shadow-mapSize={[1024, 1024]}>
            <orthographicCamera attach="shadow-camera" args={[-15, 15, 15, -15]} />
          </directionalLight>
        </>
      )}

      {/* 草地 + 广场 + 步道 */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <circleGeometry args={[17, 48]} />
        <meshStandardMaterial color={isNight ? '#16321f' : '#2f7a3c'} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <circleGeometry args={[2.3, 32]} />
        <meshStandardMaterial color={isNight ? '#223047' : '#9aa7b8'} />
      </mesh>
      {BUILDINGS.map((b) => {
        const [x, , z] = b.position
        return (
          <mesh
            key={b.id}
            receiveShadow
            position={[x * 0.5, 0.02, z * 0.5]}
            rotation={[0, Math.atan2(x, z), 0]}
          >
            <boxGeometry args={[1.2, 0.04, Math.hypot(x, z) - 2.8]} />
            <meshStandardMaterial color={isNight ? '#334155' : '#8b96a5'} />
          </mesh>
        )
      })}

      {/* 环境：湖 / 树 / 路灯 / 中央 AI 八面体 / 行人 */}
      <Pond isNight={isNight} />
      {TREES.map((p, i) => (
        <Tree key={i} position={p} variant={i} />
      ))}
      {LAMPS.map((p, i) => (
        <LampPost key={i} position={p} />
      ))}
      <CenterPiece />
      <Students />

      {/* 三栋进阶版建筑 */}
      {BUILDINGS.map((b) => (
        <ProBuilding key={b.id} config={b} isNight={isNight} selected={selected === b.id} onSelect={onSelect} />
      ))}

      {/* 镜头导演 + 相机控制 + 后期辉光 */}
      <CameraRig selectedPos={sel ? sel.position : null} />
      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={5}
        maxDistance={42}
        maxPolarAngle={1.35}
        autoRotate={autoRotate && !selected}
        autoRotateSpeed={0.5}
        target={[0, 1.2, 0]}
      />
      <Effects isNight={isNight} />
    </Canvas>
  )
}
