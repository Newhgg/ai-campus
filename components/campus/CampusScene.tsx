'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import Building from './Building'
import { CenterPiece, LampPost } from './decorations'
import { BUILDINGS } from '@/lib/campus-config'

// 三盏路灯位置（沿步道）
const LAMPS: [number, number, number][] = [
  [-2.1, 0, -0.2],
  [2.1, 0, -0.2],
  [0.9, 0, 2.4],
]

// 3D 校园主场景：夜景低多边形风格
// 交互：拖拽旋转 / 滚轮缩放 / 点击建筑进入对应楼层页面
export default function CampusScene() {
  return (
    <Canvas shadows camera={{ position: [9.5, 6.5, 11.5], fov: 45 }}>
      {/* 夜空背景 + 雾 */}
      <color attach="background" args={['#0b1026']} />
      <fog attach="fog" args={['#0b1026', 26, 60]} />

      {/* 灯光：半球环境光 + 月光方向光（带阴影） */}
      <hemisphereLight intensity={0.4} color="#94a3b8" groundColor="#0f172a" />
      <directionalLight position={[8, 12, 6]} intensity={1.1} color="#c7d2fe" castShadow shadow-mapSize={[1024, 1024]}>
        <orthographicCamera attach="shadow-camera" args={[-15, 15, 15, -15]} />
      </directionalLight>

      {/* 星空 */}
      <Stars radius={60} depth={30} count={2500} factor={3} fade speed={1} />

      {/* 草地 + 中央广场 */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <circleGeometry args={[17, 48]} />
        <meshStandardMaterial color="#16321f" />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <circleGeometry args={[2.3, 32]} />
        <meshStandardMaterial color="#223047" />
      </mesh>

      {/* 三条步道：广场 → 各楼 */}
      {BUILDINGS.map((b) => {
        const [x, , z] = b.position
        const len = Math.hypot(x, z) - 2.8
        return (
          <mesh key={b.id} receiveShadow position={[x * 0.5, 0.02, z * 0.5]} rotation={[0, Math.atan2(x, z), 0]}>
            <boxGeometry args={[1.2, 0.04, len]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        )
      })}

      {/* 路灯 / 中央 AI 八面体 / 三栋楼（宿舍楼窗户闪烁） */}
      {LAMPS.map((p, i) => (
        <LampPost key={i} position={p} />
      ))}
      <CenterPiece />
      {BUILDINGS.map((b) => (
        <Building key={b.id} config={b} flicker={b.id === 'dorm'} />
      ))}

      {/* 相机控制：自动缓慢旋转，禁止平移，不能钻到地下 */}
      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={7}
        maxDistance={30}
        maxPolarAngle={1.32}
        autoRotate
        autoRotateSpeed={0.5}
        target={[0, 1, 0]}
      />
    </Canvas>
  )
}
