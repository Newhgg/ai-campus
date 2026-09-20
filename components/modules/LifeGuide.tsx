import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// 新生生活指南（内容逐字来自三班平台「新生指南」，仅做可视化排版）
const STEPS = [
  { t: '到达学校', d: '按录取通知书指定日期到校，从正门进入' },
  { t: '找到院系报到处', d: '人工智能学院报到处，出示录取通知书' },
  { t: '领取材料', d: '校园卡、宿舍钥匙、军训服装、教材清单' },
  { t: '入住宿舍', d: '到指定宿舍楼办理入住，整理床铺' },
  { t: '班会集合', d: '按通知时间参加第一次班会，认识同学和辅导员' },
]

const LIFE = [
  { icon: '🍜', t: '食堂', d: '东区/西区食堂，支持校园卡和微信支付，人均10-15元' },
  { icon: '📚', t: '图书馆', d: '8:00-22:00 开放，凭校园卡进入，有自习室和电子阅览室' },
  { icon: '📅', t: '查课表', d: 'i.ygu.edu.cn，「i阳光」APP 扫码登录，搜「课表」' },
  { icon: '📦', t: '快递/邮寄', d: '滨海校区：福州长乐区古槐镇金滨路999号；男生 B 区快递站' },
  { icon: '🏥', t: '校医院', d: '在校内，小病可直接看，急诊打 120' },
  { icon: '🏃', t: '运动', d: '田径场、篮球场、体育馆、健身房（部分收费）' },
  { icon: '🚌', t: '交通', d: '校门口有公交站，到市区约 30 分钟，地铁需换乘' },
]

const ARMY = ['统一发放军训服，穿运动鞋，戴帽子', '防晒霜 SPF50+、大容量水杯', '藿香正气水、创可贴', '不适立即报告，多喝水防中暑']

// 宿舍楼生活模块：报到流程步骤条 + 生活卡片墙 + 军训清单
export default function LifeGuide() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">🎒 报到流程</CardTitle>
          <CardDescription>五步完成报到（导入自三班平台新生指南）</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {STEPS.map((s, i) => (
            <div key={s.t} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-300">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-slate-100">{s.t}</p>
                <p className="text-xs text-slate-400">{s.d}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">🏫 校园生活</CardTitle>
          <CardDescription>衣食住行速查卡</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2.5 sm:grid-cols-2">
          {LIFE.map((g) => (
            <div key={g.t} className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-sm font-medium text-slate-100">
                {g.icon} {g.t}
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-400">{g.d}</p>
            </div>
          ))}
          <div className="rounded-xl border border-amber-400/20 bg-amber-500/5 p-3 sm:col-span-2">
            <p className="text-sm font-medium text-amber-200">🎽 军训必备</p>
            <ul className="mt-1.5 space-y-1 text-xs text-slate-400">
              {ARMY.map((a) => (
                <li key={a}>· {a}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
