import feishu from '@/lib/data/feishu_data.json'
import stats from '@/lib/data/kb-stats.json'
import EChart from './EChart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// GitHub Pages 导出时的子路径前缀（本地/Vercel 为空串）
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || ''

// 平台数据资产统计（真实计数：提取自三班平台 index.html 各数据数组 + cet4.json）
const ASSETS = [
  { name: '四级词库', value: stats.cet4Words as number },
  { name: '每日一题', value: stats.dailyProblems as number },
  { name: '政策数据', value: stats.policyData as number },
  { name: '编程数据', value: stats.csData as number },
  { name: '媒体数据', value: stats.mediaData as number },
  { name: '时间线', value: stats.timelineData as number },
]

const CHART = {
  grid: { left: 90, right: 30, top: 12, bottom: 24 },
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'value', minInterval: 1, splitLine: { lineStyle: { color: '#1e293b' } }, axisLabel: { color: '#94a3b8' } },
  yAxis: {
    type: 'category',
    data: ASSETS.map((a) => a.name).reverse(),
    axisLine: { lineStyle: { color: '#334155' } },
    axisLabel: { color: '#94a3b8' },
  },
  series: [
    {
      type: 'bar',
      data: ASSETS.map((a) => a.value).reverse(),
      barWidth: 14,
      itemStyle: { borderRadius: [0, 6, 6, 0], color: '#34d399' },
      label: { show: true, position: 'right', color: '#cbd5e1' },
    },
  ],
}

// 办公楼模块：通知流（飞书同步）+ 平台数据资产图 + 班会记录入口
export default function OfficeModules() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">📥 通知流</CardTitle>
          <CardDescription>飞书同步的真实通知（feishu_data.json）</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {feishu.notices.map((n, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-3.5">
              <div className="flex flex-wrap items-center gap-2">
                {n['是否重要'] === '是' && (
                  <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] text-red-300">重要</span>
                )}
                <h4 className="text-sm font-medium text-slate-100">{n['标题']}</h4>
              </div>
              <p className="mt-1.5 text-xs leading-5 text-slate-400">{n['内容']}</p>
              <p className="mt-1.5 text-[10px] text-slate-500">发布人：{n['发布人']}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">📊 平台数据资产</CardTitle>
            <CardDescription>三班平台可复用数据体量（真实计数）</CardDescription>
          </CardHeader>
          <CardContent>
            <EChart option={CHART} height={210} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm font-medium text-slate-100">📋 第一次班会记录</p>
              <p className="mt-1 text-xs text-slate-400">9/13 笃行楼501 · 实到 30 人 · 请假/安全/考勤/学风</p>
            </div>
            <a
              href={`${BASE}/meeting1.html`}
              className="shrink-0 rounded-lg border border-white/20 px-3 py-1.5 text-xs text-slate-100 hover:bg-white/10"
            >
              查看 →
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
