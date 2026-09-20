'use client'

// 路由级错误边界：单个楼层页报错不影响整站（作战手册 §8.3）
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <p className="text-lg">这层楼暂时进不去（页面出错了）</p>
      <button
        onClick={reset}
        className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
      >
        重试
      </button>
    </main>
  )
}
