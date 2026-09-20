// 三栋楼统一配置：3D 场景、首页卡片、楼层页面共用这一份数据（单一数据源）
export type BuildingId = 'learning' | 'dorm' | 'office'

export interface BuildingFeature {
  title: string
  desc: string
  tech: string
  owner: string
}

export interface BuildingConfig {
  id: BuildingId
  name: string
  emoji: string
  color: string
  roofColor: string
  route: string
  position: [number, number, number]
  floors: number
  tagline: string
  features: BuildingFeature[]
}

export const BUILDINGS: BuildingConfig[] = [
  {
    id: 'learning',
    name: '学习楼',
    emoji: '📚',
    color: '#3b82f6',
    roofColor: '#1e40af',
    route: '/learning',
    position: [-6, 0, -2.5],
    floors: 4,
    tagline: '课程知识库 · AI 问答 · 学习规划',
    features: [
      { title: '课程知识库', desc: '课程资料分块入库，语义检索即问即答', tech: 'RAG · bge-m3 余弦召回', owner: '黄锦浩' },
      { title: 'AI 智能问答', desc: '基于知识库流式回答，答案标注引用来源', tech: 'LLM 流式输出', owner: '黄锦浩' },
      { title: '学习规划 Agent', desc: '查课表→生成计划→设提醒，三步自动编排', tech: 'Function Calling', owner: '黄锦浩' },
      { title: '课程工具集合', desc: '四级词库、公式、计算器等实用工具', tech: '前端集成', owner: '叶奕辉' },
      { title: '学习统计可视化', desc: '学习时长与打卡数据的图表看板', tech: 'ECharts', owner: '叶奕辉' },
    ],
  },
  {
    id: 'dorm',
    name: '宿舍楼',
    emoji: '🏠',
    color: '#f59e0b',
    roofColor: '#b45309',
    route: '/dorm',
    position: [6, 0, -2.5],
    floors: 5,
    tagline: '在线状态 · 用电安全 · 归寝提醒',
    features: [
      { title: '学生在线状态', desc: '宿舍成员实时在线 / 离线状态显示', tech: 'WebSocket / SSE', owner: '叶奕辉' },
      { title: '用电安全监测', desc: '功率阈值规则引擎 + AI 异常检测', tech: '规则引擎 + AI', owner: '黄锦浩' },
      { title: '归寝提醒 Agent', desc: '定时触发归寝提醒并推送通知', tech: '定时任务 + 推送', owner: '黄锦浩' },
      { title: '室友互动', desc: '宿舍群聊 + AI 话题推荐活跃气氛', tech: '聊天 + AI 推荐', owner: '叶奕辉' },
      { title: '宿舍公告', desc: '楼栋通知发布与已读追踪', tech: '通知系统', owner: '黄圣贤' },
    ],
  },
  {
    id: 'office',
    name: '办公楼',
    emoji: '🏢',
    color: '#10b981',
    roofColor: '#047857',
    route: '/office',
    position: [0, 0, 5.2],
    floors: 3,
    tagline: '通知中心 · 资料收集 · AI 写作',
    features: [
      { title: '通知中心', desc: '消息推送与已读状态追踪', tech: '消息系统', owner: '黄圣贤' },
      { title: '资料收集', desc: '班级表单收集与数据管理', tech: '表单 + 数据', owner: '黄圣贤' },
      { title: 'AI 写作助手', desc: '通知、总结等文档一键生成', tech: 'LLM 文档生成', owner: '黄锦浩' },
      { title: '任务管理', desc: '看板式任务管理 + AI 优先级排序', tech: '看板 + Agent', owner: '黄锦浩' },
      { title: '数据统计', desc: '收集数据仪表盘与一键导出', tech: '仪表盘 + 导出', owner: '黄圣贤' },
    ],
  },
]
