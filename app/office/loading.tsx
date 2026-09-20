// 楼层页加载骨架（Next.js App Router 约定文件）
export default function Loading() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="h-40 animate-pulse rounded-2xl bg-slate-800/60" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-36 animate-pulse rounded-2xl bg-slate-800/40" />
        ))}
      </div>
    </main>
  )
}
