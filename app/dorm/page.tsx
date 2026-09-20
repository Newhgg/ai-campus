import BuildingPage from '@/components/BuildingPage'
import LifeGuide from '@/components/modules/LifeGuide'
import NoticeBoard from '@/components/modules/NoticeBoard'

// 🏠 宿舍楼：生活指南 + 公告板（内容来自三班平台新生指南/通知）
export default function DormPage() {
  return (
    <BuildingPage id="dorm">
      <LifeGuide />
      <section className="mt-4">
        <NoticeBoard />
      </section>
    </BuildingPage>
  )
}
