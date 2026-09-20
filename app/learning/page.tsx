import BuildingPage from '@/components/BuildingPage'
import TodaySchedule from '@/components/modules/TodaySchedule'
import WeekChart from '@/components/modules/WeekChart'
import DailyProblem from '@/components/modules/DailyProblem'
import Cet4Card from '@/components/modules/Cet4Card'

// 📚 学习楼：真实课表 + 每日一题 + 四级打卡（数据来自三班平台）
export default function LearningPage() {
  return (
    <BuildingPage id="learning">
      <section className="grid gap-4 lg:grid-cols-2">
        <TodaySchedule />
        <DailyProblem />
      </section>
      <section className="mt-4 grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <WeekChart />
        </div>
        <div className="lg:col-span-2">
          <Cet4Card />
        </div>
      </section>
    </BuildingPage>
  )
}
