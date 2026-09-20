import BuildingPage from '@/components/BuildingPage'
import OfficeModules from '@/components/modules/OfficeModules'

// 🏢 办公楼：通知流 + 数据资产统计 + 班会记录（数据来自三班平台/飞书）
export default function OfficePage() {
  return (
    <BuildingPage id="office">
      <OfficeModules />
    </BuildingPage>
  )
}
