'use client'

import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

// 后期处理：Bloom 辉光（夜景窗户/路灯发光）+ 暗角
// 数据流：场景渲染 → Bloom 提亮高光 → Vignette 压暗四角 → 输出
export default function Effects({ isNight }: { isNight: boolean }) {
  return (
    <EffectComposer>
      <Bloom
        intensity={isNight ? 1.0 : 0.35}
        luminanceThreshold={isNight ? 0.32 : 0.72}
        luminanceSmoothing={0.2}
        mipmapBlur
      />
      <Vignette offset={0.25} darkness={isNight ? 0.7 : 0.5} />
    </EffectComposer>
  )
}
