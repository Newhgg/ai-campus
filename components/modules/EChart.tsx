'use client'

import { useEffect, useRef } from 'react'
import * as echarts from 'echarts/core'
import { BarChart, PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([BarChart, PieChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer])

// ECharts 暗色主题封装：init + setOption + 自适应 + 卸载时 dispose
// 数据流：option 变化 → setOption 全量更新 → 渲染到 Canvas
export default function EChart({ option, height = 260 }: { option: echarts.EChartsCoreOption; height?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const chart = echarts.init(ref.current)
    chart.setOption(option)
    const onResize = () => chart.resize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      chart.dispose()
    }
  }, [option])

  return <div ref={ref} style={{ height, width: '100%' }} />
}
