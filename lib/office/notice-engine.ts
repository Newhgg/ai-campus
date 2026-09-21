// 通知整理引擎（纯规则实现：可解释、可离线、可答辩；AI 增强转写见 /api/office/rewrite）
// 数据流：原始通知 → classifyNotice（分类/紧急度/关键信息/归档号）→ templateRewrite（群发文案兜底）

export interface NoticeItem {
  id: string
  title: string
  content: string
  source: string
  date?: string
}

export interface ClassifiedNotice extends NoticeItem {
  category: string
  urgency: '普通' | '重要' | '紧急'
  keyInfo: { time?: string; place?: string; deadline?: string }
  archiveNo: string
}

// 分类规则：标题+正文关键词命中即归类（按顺序取第一个命中，规则一目了然）
const CATEGORY_RULES: Array<[string, string[]]> = [
  ['学业', ['考试', '作业', '课程', '上课', '选课', '习题', '单词', '学习']],
  ['活动', ['军训', '集合', '运动会', '班会', '讲座', '比赛', '活动']],
  ['安全', ['安全', '消防', '诈骗', '演练', '疏散']],
  ['事务', ['缴费', '注册', '表格', '填报', '收集', '提交', '材料', '打卡']],
]

// 整理一条通知：分类 + 紧急度 + 关键信息 + 归档编号
export function classifyNotice(n: NoticeItem, seq: number): ClassifiedNotice {
  const text = n.title + n.content
  let category = '综合'
  for (const [cat, words] of CATEGORY_RULES) {
    if (words.some((w) => text.includes(w))) {
      category = cat
      break
    }
  }
  const urgent = /(紧急|务必|今晚|立即|尽快)/.test(text)
  const important = /(重要|截止|必须|全体)/.test(text)
  return {
    ...n,
    category,
    urgency: urgent ? '紧急' : important ? '重要' : '普通',
    keyInfo: extractKeyInfo(text),
    archiveNo: `TZ-${n.date ? n.date.replace(/-/g, '') : 'NODATE'}-${String(seq).padStart(2, '0')}`,
  }
}

// 关键信息抽取：时间/地点/截止各取第一处命中（正则规则，答辩可直接讲）
function extractKeyInfo(text: string) {
  const time = text.match(/(今天|明天|后天|下周[一二三四五六日天]|\d{1,2}月\d{1,2}[日号]|[早下]午|\d{1,2}[:：]\d{2})[^\s，。；;]*/)?.[0]
  const place = text.match(/[\u4e00-\u9fa5A-Za-z\d]{0,8}(楼|教室|操场|会议室|广场|实验馆|图书馆|办公室)[\u4e00-\u9fa5\d]*/)?.[0]
  const deadline = text.match(/(截止|之前|以前|前交|前完成)[^\s，。；;]*/)?.[0]
  return { time, place, deadline }
}

// 模板转写：把领导式通知拼成班委群发格式（LLM 不可用时的兜底，纯字符串拼接零幻觉）
export function templateRewrite(n: NoticeItem, k: ClassifiedNotice['keyInfo']): string {
  const lines = [`【${n.title}】`, '同学们：']
  if (k.time) lines.push(`⏰ 时间：${k.time}`)
  if (k.place) lines.push(`📍 地点：${k.place}`)
  lines.push(`📋 内容：${n.content}`)
  if (k.deadline) lines.push(`⏳ 注意：${k.deadline}`)
  lines.push('请大家相互转告，按时完成。')
  lines.push(`—— 来自${n.source}，班委整理转发`)
  return lines.join('\n')
}
