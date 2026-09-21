import BuildingPage from '@/components/BuildingPage'
import NoticeWorkbench from '@/components/modules/notice/NoticeWorkbench'
import OfficeModules from '@/components/modules/OfficeModules'

// 🏢 办公楼：通知工作台（整理/转群发/归档）+ 通知流 + 数据资产统计
export default function OfficePage() {
  return (
    <BuildingPage id="office">
      <NoticeWorkbench />
      <section className="mt-4">
        <OfficeModules />
      </section>
    </BuildingPage>
  )
}
