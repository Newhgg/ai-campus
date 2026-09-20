import { NextResponse } from 'next/server'

// 健康检查：部署监控用（上线运营维度）
export async function GET() {
  return NextResponse.json({ status: 'ok', time: new Date().toISOString() })
}
