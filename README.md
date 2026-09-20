# AI 校园·三栋楼智能平台

> 2026 第九届传智杯 · 全国高校 AI Web 开发挑战赛（B 组）作品
> 队伍：黄锦浩（队长·AI 层）+ 叶奕辉（前端 + 3D）+ 黄圣贤（数据 + 文档）

一个入口逛校园：**3D 校园地图** 上三栋楼 —— 📚 学习楼 / 🏠 宿舍楼 / 🏢 办公楼，点击建筑进入对应功能模块。

## 功能总览

| 楼栋 | 核心功能 | 评分映射 |
| --- | --- | --- |
| 📚 学习楼 | RAG 课程知识库、AI 流式问答、学习规划 Agent、工具集合、学习统计 | AI 深度 35% |
| 🏠 宿舍楼 | 在线状态、用电安全监测、归寝提醒 Agent、室友互动、公告 | 实用 + 社会 20% |
| 🏢 办公楼 | 通知中心、资料收集、AI 写作助手、任务管理、数据统计 | 商业 + 运营 |

## 技术栈

- **框架**：Next.js 14（App Router + API Routes，全栈一体）
- **语言/样式**：TypeScript + Tailwind CSS + shadcn/ui
- **3D**：Three.js + React Three Fiber（低多边形夜景校园，点击建筑路由跳转）
- **AI**：Vercel AI SDK（流式输出 / Tool Calling）+ 本地 Ollama（bge-m3 嵌入 + 27b 生成）
- **状态**：Zustand

## 目录结构

```
app/
├── page.tsx              ← 首页（3D 校园 + 三栋楼入口卡片）
├── learning/             ← 📚 学习楼（含 loading.tsx / error.tsx）
├── dorm/                 ← 🏠 宿舍楼
├── office/               ← 🏢 办公楼
└── api/
    ├── health/route.ts   ← 健康检查
    └── learning/chat/    ← 问答接口（当前为流式占位，RAG 由团队实装）
components/
├── campus/               ← 3D 场景（CampusScene / Building / Windows / decorations）
├── BuildingPage.tsx      ← 楼层页通用骨架
└── ui/                   ← shadcn/ui 风格组件（button / card / badge）
lib/campus-config.ts      ← 三栋楼单一数据源（3D/首页/楼层页共用）
store/useAppStore.ts      ← Zustand 全局状态
```

## 本地运行

```bash
npm install
npm run dev        # http://localhost:3000
```

端口冲突时换端口：`npm run dev -- -p 3100`

## 开发约定（比赛合规）

- 函数不超 30 行、组件不超 100 行、注释用中文
- **核心 AI 逻辑（RAG 检索策略 / Agent 工作流）必须团队自己写**，AI 只辅助 UI / 工具函数 / 注释 / 测试
- 每次改动都 commit，保留完整提交历史（原创性证据）
- API 密钥只放 `.env`（已 gitignore），仓库只提交 `.env.example`
- 组件职责：黄锦浩=AI 层，叶奕辉=前端+3D，黄圣贤=数据+文档

## 路线图

W1 骨架+3D 校园（本仓库当前状态）→ W2 学习楼 RAG 问答 → W3 宿舍楼+召回调优 → W4 Agent+办公楼 → W5 3D 打磨 → W6 Vercel 上线 → W7 视频+文档 → W8 提交（11-12）
