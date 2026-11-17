import { gameNow } from './gameClock.js'
import { create } from 'zustand'

export const useCompanionState = create((set, get) => ({
  status: 'following',
  assistCount: 0,
  assistingUntil: 0,
  setStatus(status) {
    if (get().status !== status) set({ status })
  },
  recordAssist() {
    set((state) => ({
      status: 'assisting',
      assistCount: state.assistCount + 1,
      assistingUntil: gameNow() + 720,
    }))
  },
  reset() {
    set({ status: 'following', assistCount: 0, assistingUntil: 0 })
  },
}))
