'use client'

// 室内家具小件：全部用简单几何体拼装，方便队友理解和替换

// 书架：木框 + 两排彩书
export function Bookshelf({ position }: { position: [number, number, number] }) {
  const books = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a78bfa', '#f472b6']
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.28, 0]}>
        <boxGeometry args={[0.9, 0.56, 0.24]} />
        <meshStandardMaterial color="#6b4a2f" />
      </mesh>
      {[0.18, 0.38].map((y, r) =>
        books.slice(r * 3, r * 3 + 3).map((c, i) => (
          <mesh key={`${r}-${i}`} position={[-0.28 + i * 0.28, y, 0.13]}>
            <boxGeometry args={[0.16, 0.14, 0.05]} />
            <meshStandardMaterial color={c} />
          </mesh>
        ))
      )}
    </group>
  )
}

// 书桌 + 发光显示器
export function Desk({ position, rotY = 0 }: { position: [number, number, number]; rotY?: number }) {
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      <mesh castShadow position={[0, 0.22, 0]}>
        <boxGeometry args={[0.8, 0.06, 0.45]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.1, 0.2, 0.4]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
      <mesh position={[0, 0.38, -0.05]}>
        <boxGeometry args={[0.42, 0.26, 0.03]} />
        <meshStandardMaterial color="#0f172a" emissive="#38bdf8" emissiveIntensity={0.9} />
      </mesh>
    </group>
  )
}

// 双层床（宿舍楼）
export function BunkBed({ position, rotY = 0 }: { position: [number, number, number]; rotY?: number }) {
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      {[0.12, 0.5].map((y) => (
        <group key={y}>
          <mesh castShadow position={[0, y, 0]}>
            <boxGeometry args={[0.55, 0.07, 1.1]} />
            <meshStandardMaterial color="#e2e8f0" />
          </mesh>
          <mesh position={[-0.18, y + 0.08, -0.35]}>
            <boxGeometry args={[0.3, 0.08, 0.25]} />
            <meshStandardMaterial color="#38bdf8" />
          </mesh>
        </group>
      ))}
      {[-0.24, 0.24].map((x) => (
        <mesh key={x} position={[x, 0.3, 0]}>
          <boxGeometry args={[0.06, 0.6, 0.06]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
      ))}
    </group>
  )
}

// 衣柜（宿舍楼）
export function Wardrobe({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.3, 0]}>
        <boxGeometry args={[0.8, 0.6, 0.3]} />
        <meshStandardMaterial color="#7c6a55" />
      </mesh>
      <mesh position={[0, 0.3, 0.16]}>
        <boxGeometry args={[0.02, 0.5, 0.02]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
    </group>
  )
}

// 坐着的小人（胶囊身体 + 球头）
export function Figure({ position, color = '#f472b6' }: { position: [number, number, number]; color?: string }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.16, 0]}>
        <capsuleGeometry args={[0.09, 0.2, 4, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh castShadow position={[0, 0.36, 0]}>
        <sphereGeometry args={[0.08, 10, 10]} />
        <meshStandardMaterial color="#fcd9b8" />
      </mesh>
    </group>
  )
}
