import { create } from 'zustand'

interface AppState {
  username: string
  visited: BuildingVisited[]
  setUsername: (name: string) => void
  markVisited: (building: string) => void
}

type BuildingVisited = string

// 全局状态：用户名 + 到访楼栋记录（后续扩展对话历史等，见作战手册 §8.3 Zustand）
export const useAppStore = create<AppState>((set) => ({
  username: '',
  visited: [],
  setUsername: (name) => set({ username: name }),
  markVisited: (building) =>
    set((s) => ({ visited: s.visited.includes(building) ? s.visited : [...s.visited, building] })),
}))
