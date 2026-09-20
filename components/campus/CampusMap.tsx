'use client'

import dynamic from 'next/dynamic'

// 关闭 SSR：Three.js 依赖浏览器 WebGL，服务端不渲染
const CampusScene = dynamic(() => import('./CampusScene'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
      正在搭建 3D 校园……
    </div>
  ),
})

// 3D 校园地图入口（客户端组件包装，供服务端页面安全引用）
export default function CampusMap() {
  return <CampusScene />
}
