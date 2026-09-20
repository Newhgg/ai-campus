'use client'

// 进阶版页错误边界
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <p className="text-lg">进阶版加载失败（可能是显卡不支持 WebGL）</p>
      <button
        onClick={reset}
        className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
      >
        重试
      </button>
    </main>
  )
}
